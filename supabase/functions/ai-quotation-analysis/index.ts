// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    
    const geminiApiKey = Deno.env.get('VITE_GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error("GEMINI API key not found")
    }

    // Call Gemini API (gemini-3.0-flash-preview)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash-preview:generateContent?key=${geminiApiKey}`

    const systemPrompt = `
You are an AI assistant for a travel agency. Your goal is to extract information from the user's prompt and output a JSON object describing a travel quotation.
The JSON should follow this structure exactly (no markdown wrapping, just raw JSON):
{
  "title": "string",
  "clientName": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "paxCount": number,
  "targetMarginPercentage": number,
  "schedules": [
    { "dayNumber": number, "date": "YYYY-MM-DD", "description": "string" }
  ],
  "costs": [
    { "category": "Hotel|Transport|Guide|Meal|Ticket|Other", "description": "string", "unitPrice": number, "quantity": number, "days": number, "currency": "KRW|THB|VND|LAK|USD", "exchangeRate": number }
  ]
}
If information is missing, use reasonable defaults or dummy data (targetMarginPercentage default: 15, dates default to today or a few days later).
Make sure to return ONLY valid JSON.
`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt + "\n\nUser Input: " + prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${data.error?.message || response.statusText}`)
    }

    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!resultText) {
       throw new Error("Invalid response format from Gemini")
    }

    try {
      const parsedData = JSON.parse(resultText)
      return new Response(JSON.stringify(parsedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse AI output as JSON" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
