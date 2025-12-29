'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChefHat,
  Calendar,
  ShoppingCart,
  Refrigerator,
  Users,
  Search,
  Filter,
  Clock,
  Star,
  Plus,
  Settings,
  LogOut,
  Heart,
  Users as UsersIcon,
  Flame,
  Sparkles,
  X,
  SlidersHorizontal,
  BookOpen,
  TrendingUp
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
  prep_time_minutes: number
  cook_time_minutes: number
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  image_url: string
  is_kid_friendly: boolean
  is_quick_meal: boolean
  tags: string[]
  rating: number
  is_favorite: boolean
  calories: number
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Sheet Pan Chicken & Vegetables',
    description: 'A simple one-pan dinner with roasted chicken and seasonal vegetables.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 35,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.5,
    is_favorite: true,
    calories: 450
  },
  {
    id: '2',
    name: 'Beef Tacos',
    description: 'Classic Mexican tacos with seasoned ground beef and fresh toppings.',
    cuisine: 'Mexican',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 520
  },
  {
    id: '3',
    name: 'Pasta Primavera',
    description: 'Light and fresh pasta with garden vegetables in a garlic olive oil sauce.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2c5?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.2,
    is_favorite: false,
    calories: 380
  },
  {
    id: '4',
    name: 'Honey Garlic Salmon',
    description: 'Sweet and savory salmon fillets glazed with honey and garlic.',
    cuisine: 'Asian Fusion',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 420
  },
  {
    id: '5',
    name: 'Veggie Stir Fry',
    description: 'Quick and healthy vegetable stir fry with a savory sauce.',
    cuisine: 'Asian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.0,
    is_favorite: false,
    calories: 280
  },
  {
    id: '6',
    name: 'Chicken Alfredo',
    description: 'Creamy pasta with tender chicken in a rich Parmesan sauce.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: true,
    calories: 650
  },
  {
    id: '7',
    name: 'Fluffy Pancakes',
    description: 'Classic buttermilk pancakes that are light, fluffy, and perfect for weekend mornings.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.9,
    is_favorite: true,
    calories: 350
  },
  {
    id: '8',
    name: 'Avocado Toast',
    description: 'Creamy avocado on crispy sourdough with cherry tomatoes and everything seasoning.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 5,
    cook_time_minutes: 5,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.4,
    is_favorite: false,
    calories: 290
  },
  {
    id: '9',
    name: 'Greek Yogurt Parfait',
    description: 'Layers of creamy Greek yogurt, fresh berries, and crunchy granola.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.3,
    is_favorite: false,
    calories: 320
  },
  {
    id: '10',
    name: 'Mediterranean Salad',
    description: 'Fresh greens with feta, olives, cucumber, and tangy lemon dressing.',
    cuisine: 'Mediterranean',
    meal_type: 'lunch',
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.5,
    is_favorite: true,
    calories: 280
  },
  {
    id: '11',
    name: 'Chicken Caesar Wrap',
    description: 'Grilled chicken with romaine, Parmesan, and creamy Caesar dressing in a flour tortilla.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.6,
    is_favorite: false,
    calories: 480
  },
  {
    id: '12',
    name: 'Tomato Basil Soup',
    description: 'Creamy homemade tomato soup with fresh basil, perfect with grilled cheese.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 30,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.7,
    is_favorite: true,
    calories: 220
  },
  {
    id: '13',
    name: 'Shrimp Pad Thai',
    description: 'Classic Thai rice noodles with shrimp, peanuts, and tangy tamarind sauce.',
    cuisine: 'Thai',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 520
  },
  {
    id: '14',
    name: 'BBQ Pulled Pork',
    description: 'Slow-cooked tender pork shoulder in smoky BBQ sauce, perfect for sandwiches.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 480,
    difficulty: 'easy',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.9,
    is_favorite: true,
    calories: 380
  },
  {
    id: '15',
    name: 'Vegetable Curry',
    description: 'Aromatic Indian curry with mixed vegetables in a rich coconut sauce.',
    cuisine: 'Indian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 340
  },
  {
    id: '16',
    name: 'Grilled Cheese & Tomato',
    description: 'Golden crispy grilled cheese with fresh tomato slices on sourdough.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 5,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.5,
    is_favorite: false,
    calories: 420
  },
  {
    id: '17',
    name: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade cookies loaded with chocolate chips.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 12,
    difficulty: 'easy',
    servings: 24,
    image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.9,
    is_favorite: true,
    calories: 150
  },
  {
    id: '18',
    name: 'Berry Smoothie Bowl',
    description: 'Thick and creamy smoothie bowl topped with fresh fruits, granola, and coconut.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 380
  },
  {
    id: '19',
    name: 'Beef Burgers',
    description: 'Juicy homemade beef patties with all the classic toppings.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.8,
    is_favorite: true,
    calories: 680
  },
  {
    id: '20',
    name: 'Sushi Rolls',
    description: 'Fresh California and spicy tuna rolls with pickled ginger and wasabi.',
    cuisine: 'Japanese',
    meal_type: 'dinner',
    prep_time_minutes: 45,
    cook_time_minutes: 20,
    difficulty: 'hard',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 350
  },
  {
    id: '21',
    name: 'Energy Bites',
    description: 'No-bake protein balls with oats, peanut butter, and dark chocolate.',
    cuisine: 'American',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 12,
    image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.4,
    is_favorite: false,
    calories: 120
  },
  {
    id: '22',
    name: 'Hummus & Veggie Platter',
    description: 'Creamy homemade hummus with fresh cut vegetables and warm pita.',
    cuisine: 'Mediterranean',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.5,
    is_favorite: false,
    calories: 180
  },
  {
    id: '23',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.',
    cuisine: 'Italian',
    meal_type: 'dessert',
    prep_time_minutes: 30,
    cook_time_minutes: 0,
    difficulty: 'medium',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.9,
    is_favorite: true,
    calories: 420
  },
  {
    id: '24',
    name: 'French Omelette',
    description: 'Perfectly folded omelette with herbs, cheese, and your choice of fillings.',
    cuisine: 'French',
    meal_type: 'breakfast',
    prep_time_minutes: 5,
    cook_time_minutes: 5,
    difficulty: 'medium',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 280
  },
  {
    id: '25',
    name: 'Chicken Teriyaki Bowl',
    description: 'Glazed teriyaki chicken over steamed rice with vegetables.',
    cuisine: 'Japanese',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1609183480237-ccecfa29a776?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['dairy_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 520
  },
  {
    id: '26',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.8,
    is_favorite: true,
    calories: 450
  },
  {
    id: '27',
    name: 'Fish and Chips',
    description: 'Crispy beer-battered cod with golden fries and tartar sauce.',
    cuisine: 'British',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 25,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 680
  },
  {
    id: '28',
    name: 'Greek Gyros',
    description: 'Seasoned lamb in warm pita with tzatziki, tomatoes, and onions.',
    cuisine: 'Greek',
    meal_type: 'dinner',
    prep_time_minutes: 25,
    cook_time_minutes: 20,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: false,
    calories: 580
  },
  {
    id: '29',
    name: 'Breakfast Burrito',
    description: 'Scrambled eggs, cheese, bacon, and potatoes in a warm tortilla.',
    cuisine: 'Mexican',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.6,
    is_favorite: true,
    calories: 520
  },
  {
    id: '30',
    name: 'Caprese Salad',
    description: 'Fresh mozzarella, ripe tomatoes, and basil with balsamic glaze.',
    cuisine: 'Italian',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 220
  },
  {
    id: '31',
    name: 'Ramen Noodle Soup',
    description: 'Rich pork broth with noodles, soft-boiled egg, and chashu pork.',
    cuisine: 'Japanese',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 180,
    difficulty: 'hard',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.9,
    is_favorite: true,
    calories: 650
  },
  {
    id: '32',
    name: 'Chicken Quesadilla',
    description: 'Crispy tortilla filled with seasoned chicken and melted cheese.',
    cuisine: 'Mexican',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.5,
    is_favorite: false,
    calories: 480
  },
  {
    id: '33',
    name: 'Banana Bread',
    description: 'Moist and sweet homemade banana bread with walnuts.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 60,
    difficulty: 'easy',
    servings: 10,
    image_url: 'https://images.unsplash.com/photo-1605286978633-2dec93ff88a2?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.7,
    is_favorite: true,
    calories: 280
  },
  {
    id: '34',
    name: 'Falafel Wrap',
    description: 'Crispy falafel with hummus, vegetables, and tahini in warm pita.',
    cuisine: 'Middle Eastern',
    meal_type: 'lunch',
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.6,
    is_favorite: false,
    calories: 420
  },
  {
    id: '35',
    name: 'Beef Stroganoff',
    description: 'Tender beef in creamy mushroom sauce over egg noodles.',
    cuisine: 'Russian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76978ae3906?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: false,
    calories: 580
  },
  {
    id: '36',
    name: 'Shakshuka',
    description: 'Poached eggs in spiced tomato sauce with peppers and onions.',
    cuisine: 'Middle Eastern',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.7,
    is_favorite: true,
    calories: 320
  },
  {
    id: '37',
    name: 'Pho',
    description: 'Vietnamese beef noodle soup with fresh herbs and lime.',
    cuisine: 'Vietnamese',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 120,
    difficulty: 'medium',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 450
  },
  {
    id: '38',
    name: 'Cobb Salad',
    description: 'Hearty salad with chicken, bacon, eggs, avocado, and blue cheese.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 20,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 520
  },
  {
    id: '39',
    name: 'Apple Pie',
    description: 'Classic American pie with cinnamon-spiced apples in flaky crust.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 45,
    cook_time_minutes: 55,
    difficulty: 'hard',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.8,
    is_favorite: true,
    calories: 350
  },
  {
    id: '40',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato-based curry sauce.',
    cuisine: 'Indian',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 30,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free'],
    rating: 4.9,
    is_favorite: true,
    calories: 550
  },
  {
    id: '41',
    name: 'BLT Sandwich',
    description: 'Classic bacon, lettuce, and tomato on toasted bread with mayo.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 5,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.4,
    is_favorite: false,
    calories: 450
  },
  {
    id: '42',
    name: 'Mango Lassi',
    description: 'Creamy Indian yogurt drink blended with sweet mango.',
    cuisine: 'Indian',
    meal_type: 'snack',
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 180
  },
  {
    id: '43',
    name: 'Lemon Garlic Shrimp',
    description: 'Quick sautéed shrimp in garlic butter with fresh lemon.',
    cuisine: 'Mediterranean',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 8,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 280
  },
  {
    id: '44',
    name: 'Spinach Artichoke Dip',
    description: 'Creamy baked dip with spinach, artichokes, and melted cheese.',
    cuisine: 'American',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    difficulty: 'easy',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.6,
    is_favorite: true,
    calories: 220
  },
  {
    id: '45',
    name: 'Meatball Sub',
    description: 'Italian meatballs in marinara with melted mozzarella on a hoagie.',
    cuisine: 'Italian',
    meal_type: 'lunch',
    prep_time_minutes: 15,
    cook_time_minutes: 25,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1578267725846-0d0a66e38c26?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: false,
    calories: 620
  },
  {
    id: '46',
    name: 'Waffles',
    description: 'Crispy golden Belgian waffles with syrup and fresh berries.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.7,
    is_favorite: true,
    calories: 380
  },
  {
    id: '47',
    name: 'Chicken Tikka Masala',
    description: 'Grilled chicken chunks in creamy spiced tomato sauce.',
    cuisine: 'Indian',
    meal_type: 'dinner',
    prep_time_minutes: 25,
    cook_time_minutes: 30,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['gluten_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 520
  },
  {
    id: '48',
    name: 'Cheesecake',
    description: 'Rich and creamy New York style cheesecake with graham crust.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 30,
    cook_time_minutes: 60,
    difficulty: 'medium',
    servings: 12,
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.9,
    is_favorite: true,
    calories: 450
  },
  {
    id: '49',
    name: 'Clam Chowder',
    description: 'Creamy New England soup with tender clams and potatoes.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 15,
    cook_time_minutes: 35,
    difficulty: 'medium',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.6,
    is_favorite: false,
    calories: 380
  },
  {
    id: '50',
    name: 'Korean Bibimbap',
    description: 'Rice bowl with vegetables, beef, fried egg, and gochujang sauce.',
    cuisine: 'Korean',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 20,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 580
  },
  {
    id: '51',
    name: 'Croissants',
    description: 'Flaky, buttery French pastries perfect for breakfast.',
    cuisine: 'French',
    meal_type: 'breakfast',
    prep_time_minutes: 120,
    cook_time_minutes: 20,
    difficulty: 'hard',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.8,
    is_favorite: false,
    calories: 320
  },
  {
    id: '52',
    name: 'Nachos Supreme',
    description: 'Loaded tortilla chips with cheese, beef, jalapeños, and toppings.',
    cuisine: 'Mexican',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.5,
    is_favorite: true,
    calories: 480
  },
  {
    id: '53',
    name: 'Lobster Roll',
    description: 'Fresh lobster meat with mayo and herbs in a buttered roll.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 15,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: [],
    rating: 4.8,
    is_favorite: false,
    calories: 420
  },
  {
    id: '54',
    name: 'Pesto Pasta',
    description: 'Fresh basil pesto tossed with pasta, pine nuts, and Parmesan.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.6,
    is_favorite: false,
    calories: 520
  },
  {
    id: '55',
    name: 'Eggs Benedict',
    description: 'Poached eggs on English muffin with ham and hollandaise sauce.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1608039829572-9b6bdf5ced8f?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: [],
    rating: 4.7,
    is_favorite: true,
    calories: 480
  },
  {
    id: '56',
    name: 'Chocolate Mousse',
    description: 'Light and airy French chocolate dessert with whipped cream.',
    cuisine: 'French',
    meal_type: 'dessert',
    prep_time_minutes: 20,
    cook_time_minutes: 0,
    difficulty: 'medium',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.8,
    is_favorite: false,
    calories: 320
  },
  {
    id: '57',
    name: 'Chicken Fried Rice',
    description: 'Wok-fried rice with chicken, vegetables, and scrambled eggs.',
    cuisine: 'Chinese',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['dairy_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 450
  },
  {
    id: '58',
    name: 'Banh Mi',
    description: 'Vietnamese sandwich with grilled pork, pickled veggies, and cilantro.',
    cuisine: 'Vietnamese',
    meal_type: 'lunch',
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1600454309261-3dc0d91c7d20?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['dairy_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 480
  },
  {
    id: '59',
    name: 'Guacamole',
    description: 'Fresh avocado dip with lime, cilantro, and jalapeño.',
    cuisine: 'Mexican',
    meal_type: 'snack',
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1600335895229-6e6ae9763b51?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.7,
    is_favorite: true,
    calories: 150
  },
  {
    id: '60',
    name: 'Lasagna',
    description: 'Layers of pasta, meat sauce, ricotta, and melted mozzarella.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 45,
    cook_time_minutes: 60,
    difficulty: 'medium',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.9,
    is_favorite: true,
    calories: 580
  },
  {
    id: '61',
    name: 'French Toast',
    description: 'Egg-dipped bread pan-fried golden, served with maple syrup.',
    cuisine: 'French',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.6,
    is_favorite: false,
    calories: 420
  },
  {
    id: '62',
    name: 'Kung Pao Chicken',
    description: 'Spicy stir-fried chicken with peanuts and vegetables.',
    cuisine: 'Chinese',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 480
  },
  {
    id: '63',
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil, and garlic.',
    cuisine: 'Italian',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 5,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.5,
    is_favorite: false,
    calories: 120
  },
  {
    id: '64',
    name: 'Lemon Bars',
    description: 'Tangy lemon curd on buttery shortbread with powdered sugar.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 20,
    cook_time_minutes: 35,
    difficulty: 'easy',
    servings: 16,
    image_url: 'https://images.unsplash.com/photo-1597403491447-3ab08f8e44dc?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.6,
    is_favorite: false,
    calories: 180
  },
  {
    id: '65',
    name: 'Shepherd\'s Pie',
    description: 'Ground lamb with vegetables topped with creamy mashed potatoes.',
    cuisine: 'British',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 45,
    difficulty: 'medium',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 520
  },
  {
    id: '66',
    name: 'Açaí Bowl',
    description: 'Frozen açaí blended thick, topped with granola and fresh fruit.',
    cuisine: 'Brazilian',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 340
  },
  {
    id: '67',
    name: 'Stuffed Bell Peppers',
    description: 'Bell peppers filled with seasoned ground beef, rice, and cheese.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 40,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['gluten_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 380
  },
  {
    id: '68',
    name: 'Brownies',
    description: 'Rich, fudgy chocolate brownies with a crackly top.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    difficulty: 'easy',
    servings: 16,
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.8,
    is_favorite: true,
    calories: 220
  },
  {
    id: '69',
    name: 'Spring Rolls',
    description: 'Fresh Vietnamese rolls with shrimp, vermicelli, and peanut sauce.',
    cuisine: 'Vietnamese',
    meal_type: 'snack',
    prep_time_minutes: 30,
    cook_time_minutes: 0,
    difficulty: 'medium',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 120
  },
  {
    id: '70',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken cutlet with marinara and melted mozzarella.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 20,
    cook_time_minutes: 25,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: [],
    rating: 4.7,
    is_favorite: true,
    calories: 580
  },
  {
    id: '71',
    name: 'Overnight Oats',
    description: 'No-cook oatmeal soaked overnight with milk and toppings.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.4,
    is_favorite: false,
    calories: 350
  },
  {
    id: '72',
    name: 'Carbonara',
    description: 'Classic Roman pasta with eggs, pecorino, guanciale, and black pepper.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 15,
    cook_time_minutes: 20,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.8,
    is_favorite: true,
    calories: 620
  },
  {
    id: '73',
    name: 'Crème Brûlée',
    description: 'Creamy vanilla custard with caramelized sugar top.',
    cuisine: 'French',
    meal_type: 'dessert',
    prep_time_minutes: 20,
    cook_time_minutes: 45,
    difficulty: 'hard',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.9,
    is_favorite: true,
    calories: 380
  },
  {
    id: '74',
    name: 'Tuna Salad Sandwich',
    description: 'Classic tuna salad with celery and mayo on soft bread.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 10,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: [],
    rating: 4.3,
    is_favorite: false,
    calories: 380
  },
  {
    id: '75',
    name: 'General Tso\'s Chicken',
    description: 'Crispy fried chicken in sweet and spicy sauce.',
    cuisine: 'Chinese',
    meal_type: 'dinner',
    prep_time_minutes: 25,
    cook_time_minutes: 20,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 520
  },
  {
    id: '76',
    name: 'Deviled Eggs',
    description: 'Hard-boiled eggs filled with creamy seasoned yolk mixture.',
    cuisine: 'American',
    meal_type: 'snack',
    prep_time_minutes: 20,
    cook_time_minutes: 12,
    difficulty: 'easy',
    servings: 12,
    image_url: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.4,
    is_favorite: false,
    calories: 80
  },
  {
    id: '77',
    name: 'Beef Bourguignon',
    description: 'French braised beef stew with red wine, mushrooms, and onions.',
    cuisine: 'French',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 180,
    difficulty: 'hard',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.9,
    is_favorite: true,
    calories: 580
  },
  {
    id: '78',
    name: 'Granola',
    description: 'Homemade crunchy oat clusters with nuts, seeds, and honey.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 10,
    cook_time_minutes: 30,
    difficulty: 'easy',
    servings: 10,
    image_url: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian', 'vegan'],
    rating: 4.5,
    is_favorite: false,
    calories: 280
  },
  {
    id: '79',
    name: 'Miso Soup',
    description: 'Traditional Japanese soup with tofu, seaweed, and green onions.',
    cuisine: 'Japanese',
    meal_type: 'lunch',
    prep_time_minutes: 5,
    cook_time_minutes: 10,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan'],
    rating: 4.4,
    is_favorite: false,
    calories: 80
  },
  {
    id: '80',
    name: 'Panna Cotta',
    description: 'Silky Italian cream dessert with berry compote.',
    cuisine: 'Italian',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 5,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 280
  },
  {
    id: '81',
    name: 'Fried Chicken',
    description: 'Southern-style crispy fried chicken with secret spice blend.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 20,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 650
  },
  {
    id: '82',
    name: 'Gazpacho',
    description: 'Cold Spanish tomato soup with cucumber and peppers.',
    cuisine: 'Spanish',
    meal_type: 'lunch',
    prep_time_minutes: 20,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.4,
    is_favorite: false,
    calories: 120
  },
  {
    id: '83',
    name: 'Churros',
    description: 'Crispy fried dough sticks coated in cinnamon sugar.',
    cuisine: 'Spanish',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1624371414361-e670edf4898f?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.7,
    is_favorite: true,
    calories: 250
  },
  {
    id: '84',
    name: 'Ceviche',
    description: 'Fresh fish marinated in citrus with onion, cilantro, and peppers.',
    cuisine: 'Peruvian',
    meal_type: 'lunch',
    prep_time_minutes: 30,
    cook_time_minutes: 0,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 180
  },
  {
    id: '85',
    name: 'Hash Browns',
    description: 'Crispy shredded potato patties cooked golden brown.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.5,
    is_favorite: false,
    calories: 220
  },
  {
    id: '86',
    name: 'Paella',
    description: 'Spanish saffron rice with seafood, chicken, and vegetables.',
    cuisine: 'Spanish',
    meal_type: 'dinner',
    prep_time_minutes: 30,
    cook_time_minutes: 40,
    difficulty: 'hard',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400',
    is_kid_friendly: false,
    is_quick_meal: false,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 520
  },
  {
    id: '87',
    name: 'Trail Mix',
    description: 'Homemade blend of nuts, dried fruits, and chocolate chips.',
    cuisine: 'American',
    meal_type: 'snack',
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.3,
    is_favorite: false,
    calories: 180
  },
  {
    id: '88',
    name: 'Mac and Cheese',
    description: 'Creamy homemade macaroni with sharp cheddar cheese sauce.',
    cuisine: 'American',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 25,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.7,
    is_favorite: true,
    calories: 480
  },
  {
    id: '89',
    name: 'Baklava',
    description: 'Layered phyllo pastry with nuts and honey syrup.',
    cuisine: 'Greek',
    meal_type: 'dessert',
    prep_time_minutes: 45,
    cook_time_minutes: 40,
    difficulty: 'hard',
    servings: 24,
    image_url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian'],
    rating: 4.8,
    is_favorite: false,
    calories: 180
  },
  {
    id: '90',
    name: 'Minestrone Soup',
    description: 'Hearty Italian vegetable soup with beans and pasta.',
    cuisine: 'Italian',
    meal_type: 'lunch',
    prep_time_minutes: 20,
    cook_time_minutes: 40,
    difficulty: 'easy',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian', 'vegan'],
    rating: 4.5,
    is_favorite: false,
    calories: 220
  },
  {
    id: '91',
    name: 'Bacon and Eggs',
    description: 'Classic breakfast with crispy bacon and eggs your way.',
    cuisine: 'American',
    meal_type: 'breakfast',
    prep_time_minutes: 5,
    cook_time_minutes: 15,
    difficulty: 'easy',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['gluten_free'],
    rating: 4.6,
    is_favorite: true,
    calories: 420
  },
  {
    id: '92',
    name: 'Lamb Chops',
    description: 'Pan-seared lamb chops with rosemary and garlic.',
    cuisine: 'Mediterranean',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['gluten_free', 'dairy_free'],
    rating: 4.7,
    is_favorite: false,
    calories: 450
  },
  {
    id: '93',
    name: 'Fruit Salad',
    description: 'Fresh mixed seasonal fruits with honey lime dressing.',
    cuisine: 'American',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'vegan', 'gluten_free'],
    rating: 4.4,
    is_favorite: false,
    calories: 120
  },
  {
    id: '94',
    name: 'Ice Cream Sundae',
    description: 'Vanilla ice cream with hot fudge, whipped cream, and cherry.',
    cuisine: 'American',
    meal_type: 'dessert',
    prep_time_minutes: 5,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 1,
    image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.7,
    is_favorite: true,
    calories: 450
  },
  {
    id: '95',
    name: 'Risotto',
    description: 'Creamy Italian rice dish with Parmesan and white wine.',
    cuisine: 'Italian',
    meal_type: 'dinner',
    prep_time_minutes: 10,
    cook_time_minutes: 30,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 420
  },
  {
    id: '96',
    name: 'Chicken Noodle Soup',
    description: 'Comforting soup with chicken, egg noodles, and vegetables.',
    cuisine: 'American',
    meal_type: 'lunch',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    difficulty: 'easy',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.7,
    is_favorite: true,
    calories: 280
  },
  {
    id: '97',
    name: 'Dumplings',
    description: 'Pan-fried or steamed dumplings with pork and vegetable filling.',
    cuisine: 'Chinese',
    meal_type: 'dinner',
    prep_time_minutes: 45,
    cook_time_minutes: 15,
    difficulty: 'hard',
    servings: 6,
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
    is_kid_friendly: true,
    is_quick_meal: false,
    tags: ['dairy_free'],
    rating: 4.8,
    is_favorite: true,
    calories: 320
  },
  {
    id: '98',
    name: 'Cheese Platter',
    description: 'Assorted cheeses with crackers, fruits, and honey.',
    cuisine: 'French',
    meal_type: 'snack',
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    difficulty: 'easy',
    servings: 8,
    image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian', 'gluten_free'],
    rating: 4.6,
    is_favorite: false,
    calories: 280
  },
  {
    id: '99',
    name: 'Eggs Florentine',
    description: 'Poached eggs on spinach and English muffin with hollandaise.',
    cuisine: 'French',
    meal_type: 'breakfast',
    prep_time_minutes: 15,
    cook_time_minutes: 15,
    difficulty: 'medium',
    servings: 2,
    image_url: 'https://images.unsplash.com/photo-1608039829572-9b6bdf5ced8f?w=400',
    is_kid_friendly: false,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.6,
    is_favorite: false,
    calories: 420
  },
  {
    id: '100',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center and vanilla ice cream.',
    cuisine: 'French',
    meal_type: 'dessert',
    prep_time_minutes: 15,
    cook_time_minutes: 14,
    difficulty: 'medium',
    servings: 4,
    image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    is_kid_friendly: true,
    is_quick_meal: true,
    tags: ['vegetarian'],
    rating: 4.9,
    is_favorite: true,
    calories: 480
  }
]

const mealTypeColors: Record<string, string> = {
  breakfast: 'from-yellow-400 to-orange-400',
  lunch: 'from-green-400 to-emerald-400',
  dinner: 'from-purple-400 to-pink-400',
  snack: 'from-orange-400 to-red-400',
  dessert: 'from-pink-400 to-rose-400'
}

const difficultyConfig: Record<string, { color: string; bg: string }> = {
  easy: { color: 'text-green-700', bg: 'bg-green-100' },
  medium: { color: 'text-amber-700', bg: 'bg-amber-100' },
  hard: { color: 'text-red-700', bg: 'bg-red-100' }
}

const navItems = [
  { icon: Calendar, label: 'Meal Plan', href: '/dashboard', active: false },
  { icon: ShoppingCart, label: 'Grocery List', href: '/dashboard/groceries', active: false },
  { icon: Refrigerator, label: 'Pantry', href: '/dashboard/pantry', active: false },
  { icon: ChefHat, label: 'Recipes', href: '/dashboard/recipes', active: true },
  { icon: Users, label: 'Family', href: '/dashboard/family', active: false },
]

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMealType, setFilterMealType] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterQuickMeals, setFilterQuickMeals] = useState(false)
  const [filterKidFriendly, setFilterKidFriendly] = useState(false)
  const [filterFavorites, setFilterFavorites] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (searchTerm && !recipe.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      if (filterMealType !== 'all' && recipe.meal_type !== filterMealType) {
        return false
      }
      if (filterDifficulty !== 'all' && recipe.difficulty !== filterDifficulty) {
        return false
      }
      if (filterQuickMeals && !recipe.is_quick_meal) {
        return false
      }
      if (filterKidFriendly && !recipe.is_kid_friendly) {
        return false
      }
      if (filterFavorites && !recipe.is_favorite) {
        return false
      }
      return true
    })
  }, [recipes, searchTerm, filterMealType, filterDifficulty, filterQuickMeals, filterKidFriendly, filterFavorites])

  const activeFiltersCount = [
    filterMealType !== 'all',
    filterDifficulty !== 'all',
    filterQuickMeals,
    filterKidFriendly,
    filterFavorites
  ].filter(Boolean).length

  function toggleFavorite(recipeId: string) {
    setRecipes(recipes.map(r =>
      r.id === recipeId ? { ...r, is_favorite: !r.is_favorite } : r
    ))
    const recipe = recipes.find(r => r.id === recipeId)
    toast.success(recipe?.is_favorite ? 'Removed from favorites' : 'Added to favorites')
  }

  function addToMealPlan(recipe: Recipe) {
    toast.success(`Added "${recipe.name}" to meal plan`)
  }

  function clearFilters() {
    setFilterMealType('all')
    setFilterDifficulty('all')
    setFilterQuickMeals(false)
    setFilterKidFriendly(false)
    setFilterFavorites(false)
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BestMealMate</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.active && <div className="ml-auto w-2 h-2 rounded-full bg-white/50" />}
            </Link>
          ))}
        </nav>

        {/* AI Chef Promo */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Recipe Finder</span>
            </div>
            <p className="text-sm text-white/80 mb-3">Tell me what you&apos;re craving and I&apos;ll find the perfect recipe!</p>
            <button className="w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors">
              Ask AI Chef
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 space-y-1">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-7 h-7 text-brand-600" />
                  Recipe Collection
                </h1>
                <p className="text-gray-500">Discover delicious meals for your family</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all">
                <Plus className="w-5 h-5" />
                Add Recipe
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Recipes', value: recipes.length.toString(), icon: BookOpen, color: 'from-brand-500 to-emerald-500' },
              { label: 'Favorites', value: recipes.filter(r => r.is_favorite).length.toString(), icon: Heart, color: 'from-pink-500 to-rose-500' },
              { label: 'Quick Meals', value: recipes.filter(r => r.is_quick_meal).length.toString(), icon: Flame, color: 'from-orange-500 to-amber-500' },
              { label: 'Kid Friendly', value: recipes.filter(r => r.is_kid_friendly).length.toString(), icon: UsersIcon, color: 'from-blue-500 to-cyan-500' },
            ].map((stat, i) => (
              <div key={i} className="card p-4 group hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes by name, cuisine, or ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
                  showFilters
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                    <select
                      value={filterMealType}
                      onChange={(e) => setFilterMealType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all bg-white"
                    >
                      <option value="all">All Types</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                      <option value="dessert">Dessert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={filterDifficulty}
                      onChange={(e) => setFilterDifficulty(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all bg-white"
                    >
                      <option value="all">All Levels</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { label: 'Quick Meals', value: filterQuickMeals, setter: setFilterQuickMeals, icon: Flame },
                    { label: 'Kid Friendly', value: filterKidFriendly, setter: setFilterKidFriendly, icon: UsersIcon },
                    { label: 'Favorites Only', value: filterFavorites, setter: setFilterFavorites, icon: Heart },
                  ].map((filter, i) => (
                    <button
                      key={i}
                      onClick={() => filter.setter(!filter.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        filter.value
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <filter.icon className="w-4 h-4" />
                      {filter.label}
                    </button>
                  ))}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredRecipes.length}</span> recipes
            </p>
          </div>

          {/* Recipe Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-card-hover hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={recipe.image_url}
                      alt={recipe.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Favorite button */}
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-sm transition-all ${
                        recipe.is_favorite
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${recipe.is_favorite ? 'fill-current' : ''}`} />
                    </button>

                    {/* Badges */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-lg bg-gradient-to-r ${mealTypeColors[recipe.meal_type]} text-white shadow-lg`}>
                        {recipe.meal_type}
                      </span>
                      {recipe.is_quick_meal && (
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 flex items-center gap-1 shadow-lg">
                          <Flame className="w-3 h-3 text-orange-500" />
                          Quick
                        </span>
                      )}
                      {recipe.is_kid_friendly && (
                        <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/90 text-gray-700 shadow-lg">
                          Kid Friendly
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-600 transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        <UsersIcon className="w-4 h-4 text-gray-400" />
                        {recipe.servings}
                      </span>
                      <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg ${difficultyConfig[recipe.difficulty].bg} ${difficultyConfig[recipe.difficulty].color}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= recipe.rating
                                ? 'text-amber-400 fill-current'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium text-gray-600 ml-1.5">{recipe.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{recipe.calories} cal</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:shadow-glow transition-all">
                        View Recipe
                      </button>
                      <button
                        onClick={() => addToMealPlan(recipe)}
                        className="p-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                item.active
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
