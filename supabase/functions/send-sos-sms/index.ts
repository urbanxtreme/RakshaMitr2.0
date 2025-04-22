
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import twilio from 'npm:twilio@4.19.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location, userId } = await req.json()

    if (!location || !location.lat || !location.lng || !userId) {
      throw new Error('Missing required parameters')
    }

    console.log("Processing SOS request for user:", userId)
    console.log("Location data:", JSON.stringify(location))

    // Create Supabase client
    const supabaseUrl = 'https://jolerxrpmyhrrbplhegd.supabase.co'
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
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
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
      const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER')
      
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
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER')
    
    // Send SMS to each contact with better error handling
    const results = []
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
          console.log(`Reformatted phone number to: ${phoneNumber}`)
        }
        
        const message = await client.messages.create({
          body: `EMERGENCY ALERT: Your contact needs immediate assistance! Their current location: ${googleMapsLink}`,
          to: phoneNumber,
          from: twilioPhone
        })
        
        console.log(`SMS sent successfully to ${contact.name}, SID: ${message.sid}`)
        
        results.push({
          success: true,
          contact: contact.name,
          sid: message.sid
        })
      } catch (smsError) {
        console.error(`Error sending SMS to ${contact.name}:`, smsError)
        results.push({
          success: false,
          contact: contact.name,
          error: smsError.message || 'Unknown error'
        })
      }
    }
    
    // Check if any messages were sent successfully
    const anySuccess = results.some(result => result.success)
    
    return new Response(
      JSON.stringify({ 
        success: anySuccess, 
        results,
        message: anySuccess ? 'Emergency alerts sent' : 'Failed to send emergency alerts'
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
