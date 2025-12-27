import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

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

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text')
    const reply = textContent ? textContent.text : 'I apologize, but I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Chef error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
