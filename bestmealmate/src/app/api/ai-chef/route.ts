import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context, pantryItems, familyMembers, action } = body

    // Build context from either format
    const contextData = context || { pantryItems, familyMembers }

    // Build context about the family and pantry
    const systemPrompt = `You are the AI Chef for BestMealMate, a family meal planning app.

Your job is to help families decide what to cook based on:
1. What ingredients they have (especially expiring items)
2. Each family member's dietary restrictions and allergies
3. How much time they have to cook
4. What they've eaten recently (to ensure variety)

Current context:
${JSON.stringify(contextData, null, 2)}

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

    // Return all field names that frontend might expect
    return NextResponse.json({
      reply,
      message: reply,
      suggestion: reply,
      success: true
    })
  } catch (error) {
    console.error('AI Chef error:', error)

    // Return a helpful fallback suggestion instead of just an error
    const fallbackSuggestions = [
      'Try making Honey Garlic Chicken with roasted vegetables - quick, healthy, and family-friendly!',
      'How about Teriyaki Salmon with rice and steamed broccoli? Takes only 25 minutes!',
      'Consider a Sheet Pan Fajitas night - colorful, fun, and everyone can customize their own!',
      'Pasta Primavera is always a hit - toss in whatever veggies you have on hand!',
      'One-pot chicken and rice is comfort food that the whole family will love!'
    ]
    const randomSuggestion = fallbackSuggestions[Math.floor(Math.random() * fallbackSuggestions.length)]

    return NextResponse.json({
      message: randomSuggestion,
      suggestion: randomSuggestion,
      reply: randomSuggestion,
      success: true,
      fallback: true
    })
  }
}
