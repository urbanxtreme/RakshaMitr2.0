import { createServer, IncomingMessage } from 'http';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

createServer(async (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const parseJson = async (req: IncomingMessage): Promise<any> => {
      return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
        req.on('error', reject);
      });
    };

    const { location, userId } = await parseJson(req);

    if (!location || !location.lat || !location.lng || !userId) {
      throw new Error('Missing required parameters')
    }

    console.log("Processing SOS request for user:", userId)
    console.log("Location data:", JSON.stringify(location))

    // Create Supabase client
    const supabaseUrl = 'https://jolerxrpmyhrrbplhegd.supabase.co'
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabaseClient
      .from('emergency_contacts')
      .select('phone_number, name')
      .eq('user_id', userId)

    if (contactsError) {
      console.error("Error fetching contacts:", contactsError)
      throw new Error('Failed to fetch emergency contacts')
    }

    console.log(`Found ${contacts?.length || 0} emergency contacts`)

    if (!contacts || contacts.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'No emergency contacts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Twilio client with explicit error handling
    let client
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID
      const authToken = process.env.TWILIO_AUTH_TOKEN
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER
      
      console.log(`Twilio config - SID: ${accountSid ? "Set" : "Missing"}, Token: ${authToken ? "Set" : "Missing"}, Phone: ${twilioPhone || "Missing"}`)
      
      if (!accountSid || !authToken || !twilioPhone) {
        throw new Error('Missing Twilio credentials')
      }
      
      client = twilio(accountSid, authToken)
    } catch (twilioInitError) {
      console.error("Error initializing Twilio client:", twilioInitError)
      throw new Error('Twilio credentials error: ' + twilioInitError.message)
    }

    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`
    // Twiliophone is already defined in the try block above, don't redefine it here
    
    // Send SMS to each contact with better error handling
    const results: { success: boolean; contact: string; sid?: string; error?: string; code?: string; phoneNumber?: string }[] = []
    for (const contact of contacts) {
      try {
        // Format the phone number to ensure it has the correct format for Twilio
        let phoneNumber = contact.phone_number.trim()
        
        // Log phone details for debugging
        console.log(`Sending SMS to ${contact.name} at ${phoneNumber}`)
        
        // Ensure phone number has appropriate format for international dialing
        // Twilio requires E.164 format (+[country code][phone number])
        if (!phoneNumber.startsWith('+')) {
          // If number doesn't start with +, assume it needs the plus
          phoneNumber = '+' + phoneNumber
        }
        
        // Remove any spaces, dashes, or parentheses which can cause issues with Twilio
        phoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
        
        // Validate the phone number format
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
          console.error(`Invalid phone number format for ${contact.name}: ${phoneNumber}`)
          throw new Error(`Invalid phone number format: ${phoneNumber}`)
        }
        
        console.log(`Formatted phone number for sending: ${phoneNumber}`)
        
        // Get the Twilio phone number again from environment to ensure it's available
        const fromPhone = process.env.TWILIO_PHONE_NUMBER
        if (!fromPhone) {
          throw new Error('Missing Twilio phone number')
        }
        
        // Log full details for debugging
        console.log(`Attempting to send SMS from ${fromPhone} to ${phoneNumber}`)
        
        // Print full details of Twilio request for debugging in logs
        console.log(`SMS Request details:
          From: ${fromPhone}
          To: ${phoneNumber}
          Body: EMERGENCY ALERT with location: ${googleMapsLink}
          Account SID: ${process.env.TWILIO_ACCOUNT_SID?.substring(0, 5)}...
        `)
        
        // CRITICAL: Make sure that the "from" number is actually a number that belongs to your Twilio account
        // It must be purchased through Twilio and associated with your account
        // The number in the environment variable MUST be a valid Twilio number
        if (!fromPhone.startsWith('+')) {
          console.error("Twilio phone number must start with + and country code");
          throw new Error("Invalid Twilio phone number format. Must start with + and country code");
        }
        
        const message = await client.messages.create({
          body: `EMERGENCY ALERT: Your contact needs immediate assistance! Their current location: ${googleMapsLink}`,
          to: phoneNumber,
          from: fromPhone // This must be a valid Twilio number purchased through your account
        })
        
        console.log(`SMS sent successfully to ${contact.name}, SID: ${message.sid}`)
        
        results.push({
          success: true,
          contact: contact.name,
          sid: message.sid
        })
      } catch (smsError) {
        console.error(`Error sending SMS to ${contact.name}:`, smsError)
        
        // More detailed Twilio error logging
        let errorMessage = smsError.message || 'Unknown error';
        let errorCode = 'UNKNOWN';
        
        if (smsError.code) {
          errorCode = smsError.code;
          console.error(`Twilio error code: ${errorCode}, details:`, smsError);
        }
        
        // Handle common Twilio error codes with user-friendly messages
        if (errorCode === '21211') {
          errorMessage = 'Invalid phone number format. Please ensure the number includes country code.';
        } else if (errorCode === '21608') {
          errorMessage = 'The Twilio phone number is not available or cannot send to this destination.';
        } else if (errorCode === '21610') {
          errorMessage = 'The recipient phone number is blacklisted.';
        } else if (errorCode === '21612') {
          errorMessage = 'Twilio account is not authorized to send messages to this region.';
        } else if (smsError.message && smsError.message.includes('not a Twilio phone number')) {
          // This is precisely the error we're seeing
          const twilioNumber = process.env.TWILIO_PHONE_NUMBER || 'unknown';
          errorMessage = `The phone number in your Twilio settings (${twilioNumber}) is not a valid Twilio number. You need to purchase this number in your Twilio account.`;
          console.error(`CRITICAL ERROR: ${twilioNumber} is not a valid Twilio number. You must purchase this number through Twilio.`);
        } else if (smsError.message && smsError.message.includes('country mismatch')) {
          errorMessage = 'Country code mismatch. Your Twilio account may not be authorized to send to numbers in this country.';
          console.error(`Country mismatch error. Your Twilio account region may not match the destination number's country.`);
        }
        
        console.error(`Formatted error for ${contact.name}: ${errorCode} - ${errorMessage}`);
        
        results.push({
          success: false,
          contact: contact.name,
          error: errorMessage,
          code: errorCode,
          phoneNumber: contact.phone_number ? contact.phone_number.substring(0, 6) + '****' : 'unknown' // Redacted for privacy
        })
      }
    }
    
    // Check if any messages were sent successfully
    const anySuccess = results.some(result => result.success)
    
    // Log detailed summary of results
    console.log(`SMS sending results summary:
      Total contacts: ${contacts.length}
      Success: ${results.filter(r => r.success).length}
      Failed: ${results.filter(r => !r.success).length}
    `);
    
    return new Response(
      JSON.stringify({
        success: anySuccess,
        results,
        message: anySuccess ? 'Emergency alerts sent' : 'Failed to send emergency alerts',
        detailedMessage: results.length > 0 && !results[0].success ? results[0].error : null,
        twilioPhone: process.env.TWILIO_PHONE_NUMBER || 'Not set' // Include this for debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending SOS SMS:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        success: false
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
