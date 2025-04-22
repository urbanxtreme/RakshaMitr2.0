
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

    // Initialize Twilio client
    const client = twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )

    // Create Supabase client
    const supabaseClient = createClient(
      'https://jolerxrpmyhrrbplhegd.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabaseClient
      .from('emergency_contacts')
      .select('phone_number, name')
      .eq('user_id', userId)

    if (contactsError) {
      throw new Error('Failed to fetch emergency contacts')
    }

    const googleMapsLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`
    
    // Send SMS to each contact
    const smsPromises = contacts.map(contact => 
      client.messages.create({
        body: `EMERGENCY ALERT: Your contact needs immediate assistance! Their current location: ${googleMapsLink}`,
        to: contact.phone_number,
        from: Deno.env.get('TWILIO_PHONE_NUMBER')
      })
    )

    await Promise.all(smsPromises)
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending SOS SMS:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
