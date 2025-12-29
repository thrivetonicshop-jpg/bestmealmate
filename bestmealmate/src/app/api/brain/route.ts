import { NextRequest, NextResponse } from 'next/server'
import { brain } from '@/lib/bio-ai/brain'

/**
 * 🧠 BRAIN API - Public endpoint for Bio-AI Brain Module
 *
 * Exposes the Claude-powered brain for:
 * - Meal decisions
 * - Pattern recognition
 * - Creative brainstorming
 * - Learning from feedback
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, ...params } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action parameter' },
        { status: 400 }
      )
    }

    // Default userId for anonymous users
    const effectiveUserId = userId || 'anonymous'

    switch (action) {
      case 'think': {
        // Main decision-making endpoint
        const { pantryItems, dietaryRestrictions, familyPreferences, mealHistory, timeOfDay, mood } = params

        const decision = await brain.makeDecision(effectiveUserId, {
          pantryItems: pantryItems || [],
          dietaryRestrictions: dietaryRestrictions || [],
          familyPreferences: familyPreferences || [],
          mealHistory: mealHistory || [],
          timeOfDay: timeOfDay || getTimeOfDay(),
          mood
        })

        return NextResponse.json({
          success: true,
          action: 'think',
          result: decision
        })
      }

      case 'brainstorm': {
        // Creative meal idea generation
        const { pantryItems, constraints } = params

        if (!pantryItems || pantryItems.length === 0) {
          return NextResponse.json(
            { error: 'pantryItems array required for brainstorming' },
            { status: 400 }
          )
        }

        const ideas = await brain.brainstorm(pantryItems, constraints || [])

        return NextResponse.json({
          success: true,
          action: 'brainstorm',
          result: { ideas }
        })
      }

      case 'patterns': {
        // Recognize user patterns
        const patterns = await brain.recognizePatterns(effectiveUserId)

        return NextResponse.json({
          success: true,
          action: 'patterns',
          result: patterns
        })
      }

      case 'learn': {
        // Learn from feedback
        const { mealId, rating, feedback } = params

        if (!mealId || rating === undefined) {
          return NextResponse.json(
            { error: 'mealId and rating required for learning' },
            { status: 400 }
          )
        }

        const learned = await brain.learn(effectiveUserId, {
          mealId,
          rating: Number(rating),
          feedback
        })

        return NextResponse.json({
          success: true,
          action: 'learn',
          result: learned
        })
      }

      case 'remember': {
        // Store a memory
        const { category, content } = params

        if (!category || !content) {
          return NextResponse.json(
            { error: 'category and content required for memory formation' },
            { status: 400 }
          )
        }

        await brain.formMemory(effectiveUserId, category, content)

        return NextResponse.json({
          success: true,
          action: 'remember',
          result: { stored: true }
        })
      }

      case 'recall': {
        // Retrieve memories
        const { category } = params

        if (!category) {
          return NextResponse.json(
            { error: 'category required for memory retrieval' },
            { status: 400 }
          )
        }

        const memories = await brain.retrieveMemories(effectiveUserId, category)

        return NextResponse.json({
          success: true,
          action: 'recall',
          result: { memories }
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Valid actions: think, brainstorm, patterns, learn, remember, recall` },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('🧠 Brain API error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Brain processing failed',
        success: false
      },
      { status: 500 }
    )
  }
}

// GET endpoint for health check and documentation
export async function GET() {
  return NextResponse.json({
    name: '🧠 BestMealMate Brain API',
    version: '2.0.0',
    status: 'alive',
    poweredBy: 'Claude AI',
    endpoints: {
      POST: {
        actions: {
          think: {
            description: 'Get AI-powered meal decision',
            params: {
              pantryItems: 'string[] - Available ingredients',
              dietaryRestrictions: 'string[] - Allergies/restrictions',
              familyPreferences: 'string[] - Family preferences',
              mealHistory: 'string[] - Recent meals',
              timeOfDay: 'string - morning/afternoon/evening/night',
              mood: 'string - Optional mood'
            }
          },
          brainstorm: {
            description: 'Generate creative meal ideas',
            params: {
              pantryItems: 'string[] - Available ingredients',
              constraints: 'string[] - Optional constraints'
            }
          },
          patterns: {
            description: 'Analyze user eating patterns',
            params: {
              userId: 'string - User ID'
            }
          },
          learn: {
            description: 'Learn from meal feedback',
            params: {
              mealId: 'string - Meal identifier',
              rating: 'number - 1-5 rating',
              feedback: 'string - Optional text feedback'
            }
          },
          remember: {
            description: 'Store a memory',
            params: {
              category: 'preference|behavior|feedback|pattern',
              content: 'object - Memory content'
            }
          },
          recall: {
            description: 'Retrieve memories',
            params: {
              category: 'preference|behavior|feedback|pattern'
            }
          }
        }
      }
    },
    examples: {
      think: {
        action: 'think',
        pantryItems: ['chicken', 'rice', 'broccoli', 'garlic'],
        dietaryRestrictions: ['gluten-free'],
        timeOfDay: 'evening'
      },
      brainstorm: {
        action: 'brainstorm',
        pantryItems: ['eggs', 'cheese', 'spinach', 'tomatoes'],
        constraints: ['quick', 'healthy']
      }
    }
  })
}

// Helper to determine time of day
function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}
