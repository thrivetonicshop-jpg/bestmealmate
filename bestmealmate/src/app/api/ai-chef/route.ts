import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Vercel serverless timeout safety margin (55s of 60s max)
const API_TIMEOUT_MS = 55000

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function POST(request: NextRequest) {
  // Create abort controller for timeout handling
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), API_TIMEOUT_MS)

  try {
    const { message, context } = await request.json()

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Build context about the family and pantry
    const systemPrompt = `You are the AI Chef for BestMealMate, a family meal planning app.

Your job is to help families decide what to cook based on:
1. What ingredients they have (especially expiring items)
2. Each family member's dietary restrictions and allergies
3. How much time they have to cook
4. What they've eaten recently (to ensure variety)

Current context:
${JSON.stringify(context, null, 2)}

Guidelines:
- Always prioritize safety (allergies are serious!)
- Suggest meals that work for EVERYONE in the family
- Prefer using ingredients that are expiring soon
- Be friendly, helpful, and concise
- When suggesting a meal, explain why it's a good fit
- If asked for a recipe, provide clear step-by-step instructions`

    const anthropic = getAnthropic()

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })

    // Clear timeout on successful response
    clearTimeout(timeoutId)

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text')
    const reply = textContent ? textContent.text : 'I apologize, but I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    // Clear timeout on error
    clearTimeout(timeoutId)

    // Handle timeout/abort
    if (error.name === 'AbortError' || abortController.signal.aborted) {
      console.error('AI Chef timeout:', error)
      return NextResponse.json(
        { error: 'Request timed out. Please try a simpler question.' },
        { status: 504 }
      )
    }

    // Handle API key issues
    if (error.status === 401) {
      console.error('AI Chef auth error:', error)
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 500 }
      )
    }

    // Handle rate limiting
    if (error.status === 429) {
      console.error('AI Chef rate limited:', error)
      return NextResponse.json(
        { error: 'AI service is busy. Please try again in a moment.' },
        { status: 429 }
      )
    }

    console.error('AI Chef error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
