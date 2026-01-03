# Performance Issues Analysis - BestMealMate

This document catalogs all identified performance anti-patterns, N+1 queries, unnecessary re-renders, and inefficient algorithms in the codebase.

---

## Critical Issues

### 1. N+1 Query Pattern in Account Deletion
**File:** `src/app/api/account/delete/route.ts:69-89`

**Problem:** Sequential queries inside nested loops cause exponential database calls.

```typescript
// Lines 69-77: For each grocery list, executes separate delete
const { data: lists } = await supabaseAdmin.from('grocery_lists').select('id')...
if (lists) {
  for (const list of lists) {
    await supabaseAdmin.from('grocery_items').delete().eq('list_id', list.id)  // N+1!
  }
}
```

**Impact:** If user has 100 grocery lists, this executes 101 queries instead of 1.

**Fix:** Use bulk delete with `IN` clause or configure CASCADE deletes in database schema.

---

### 2. Sequential Image Processing (No Parallelization)
**File:** `src/app/api/scan-and-cook/route.ts:49-107`

**Problem:** AI image analysis runs sequentially for each image.

```typescript
for (const imageData of images) {
  const response = await anthropic.messages.create({...})  // Waits for each one!
}
```

**Impact:** Processing 5 images takes 5x the time vs. parallel execution.

**Fix:** Use `Promise.all()` for concurrent image analysis:
```typescript
const results = await Promise.all(images.map(async (imageData) => {
  return anthropic.messages.create({...})
}))
```

---

### 3. O(n*m) Pantry Lookup Algorithm
**File:** `src/app/api/generate-grocery-list/route.ts:107-113, 150`

**Problem:** For every ingredient, iterates through entire pantry with string comparisons.

```typescript
function isInPantry(ingredientName: string, pantryItems: Array<...>): boolean {
  const normalized = normalizeIngredient(ingredientName)
  return pantryItems.some(item => {
    const pantryNormalized = normalizeIngredient(item.name)  // Normalizes each time!
    return normalized.includes(pantryNormalized) || pantryNormalized.includes(normalized)
  })
}
```

**Impact:** 10 meals * 15 ingredients * 50 pantry items = 7,500 string operations.

**Fix:** Pre-build a Set of normalized pantry names once, then check membership in O(1):
```typescript
const pantrySet = new Set(pantryItems.map(item => normalizeIngredient(item.name)))
```

---

### 4. AuthContext Value Object Created Inline
**File:** `src/lib/auth-context.tsx:196-211`

**Problem:** Provider value is a new object on every render, triggering re-renders of entire component tree.

```typescript
<AuthContext.Provider
  value={{
    user,
    session,
    household,
    familyMember,
    loading,
    signOut,
    refreshHousehold,
    exportUserData,
    createBackup,
  }}  // New object every render!
>
```

**Impact:** Every state change re-renders all children consuming this context.

**Fix:** Memoize the context value with `useMemo`:
```typescript
const contextValue = useMemo(() => ({
  user, session, household, familyMember, loading,
  signOut, refreshHousehold, exportUserData, createBackup,
}), [user, session, household, familyMember, loading])
```

---

### 5. No Barcode Lookup Cache
**File:** `src/app/api/barcode-lookup/route.ts:167-204`

**Problem:** Every barcode scan hits external OpenFoodFacts API with no caching.

**Impact:** Repeated scans of same product (common behavior) make duplicate API calls.

**Fix:** Cache results in database or Redis with TTL.

---

## High Priority Issues

### 6. Duplicate Data Fetching on Login
**File:** `src/lib/auth-context.tsx:145-175`

**Problem:** Multiple overlapping queries during sign-in:
- Line 133: `fetchUserData()` fetches family_members with household
- Line 148-152: Separate query for user_preferences
- Line 156-160: Another query for family_members.household_id
- Line 172-175: Separate UPDATE for last_login_at

**Impact:** 4+ round trips on every login that could be 1-2.

**Fix:** Batch queries and use upsert for preferences.

---

### 7. Unbounded Health Metrics Query
**File:** `src/app/api/wearables/sync/route.ts:97-102`

**Problem:** No pagination/limit on health metrics query.

```typescript
const { data: todayMetrics } = await supabase
  .from('health_metrics')
  .select('metric_type, value')
  .eq('family_member_id', familyMember.id)
  .gte('recorded_at', `${today}T00:00:00`)
  // No .limit() !
```

**Impact:** Wearable users with 10,000+ daily heart rate readings load all into memory.

**Fix:** Add `.limit(10000)` or use pagination.

---

### 8. JavaScript Aggregation Instead of SQL
**File:** `src/app/api/wearables/sync/route.ts:118-142, 244-267`

**Problem:** Metrics summed/averaged in JavaScript loop instead of database.

```typescript
for (const metric of todayMetrics) {
  switch (metric.metric_type) {
    case 'steps':
      summary.steps = (summary.steps || 0) + metric.value  // App-side aggregation
      break
  }
}
```

**Impact:** Transfers all raw data to app server, then processes.

**Fix:** Use SQL aggregation:
```sql
SELECT metric_type, SUM(value) FROM health_metrics
WHERE family_member_id = $1 GROUP BY metric_type
```

---

### 9. Inefficient Aisle Categorization
**File:** `src/app/api/generate-grocery-list/route.ts:31-96`

**Problem:** Multiple `.some()` array scans with `.includes()` for each ingredient.

```typescript
if (['lettuce', 'spinach', 'kale', ...34 more].some(p => name.includes(p))) {
  return 'Produce'
}
// Repeats for 12 categories!
```

**Impact:** Linear search through 100+ strings for each ingredient.

**Fix:** Use a Map/object lookup or compile to regex.

---

### 10. Missing Indexes (Potential)
**Files:** Multiple API routes

The following columns are frequently queried but may lack indexes:
- `households.stripe_customer_id` (`src/app/api/stripe/webhook/route.ts:81-85`)
- `family_members.user_id` (`src/app/api/wearables/route.ts:32-36`)
- `user_preferences.user_id` (`src/lib/auth-context.tsx:148-152`)

**Fix:** Verify indexes exist in `supabase/schema.sql`, add if missing:
```sql
CREATE INDEX idx_households_stripe_customer_id ON households(stripe_customer_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
```

---

## Medium Priority Issues

### 11. Missing useMemo for Expensive Computations
**Files:**
- `src/components/WeeklyMealPlan.tsx:86-103` - `weeklyTotals` calculation
- `src/components/TodaysMeals.tsx:79-98` - `completedMeals`, `totalConsumed`, `remaining`
- `src/components/GroceryShoppingMode.tsx:80-99` - `itemsByAisle`, `filteredItems`

**Problem:** Complex calculations re-run on every render.

**Fix:** Wrap in `useMemo` with appropriate dependencies.

---

### 12. Inline Functions in JSX Props
**Files:**
- `src/components/FoodScanner.tsx:298-301, 358`
- `src/components/WeeklyMealPlan.tsx:228-242, 301-303`
- `src/components/TodaysMeals.tsx:233-252, 400-446`
- `src/app/dashboard/pantry/page.tsx:538-544, 790-950`

**Problem:** `onClick={() => ...}` creates new function references, causing child re-renders.

**Fix:** Extract handlers with `useCallback`:
```typescript
const handleClick = useCallback(() => { ... }, [deps])
```

---

### 13. No React.memo on Frequently Re-rendered Components
**Files:** All component files in `src/components/`

**Problem:** No components use `React.memo()`, causing unnecessary re-renders when parent updates.

**Priority candidates:**
- Pantry item cards (rendered in large lists)
- Meal cards in WeeklyMealPlan
- Individual meal rows in TodaysMeals

---

### 14. Over-fetching with SELECT *
**Files:**
- `src/app/api/wearables/route.ts:43-47` - Fetches all columns including tokens
- `src/lib/auth-context.tsx:77-84` - Fetches nested relations not used in export

**Problem:** `select('*')` returns unnecessary columns like access_token, refresh_token.

**Fix:** Specify only needed columns:
```typescript
.select('id, provider, is_active, created_at, last_sync_at')
```

---

### 15. Sequential Data Fetching in Pantry Page
**File:** `src/app/dashboard/pantry/page.tsx:200-204`

**Problem:** `fetchPantryItems()` and `fetchIngredients()` run sequentially in useEffect.

**Fix:** Use `Promise.all()`:
```typescript
useEffect(() => {
  Promise.all([fetchPantryItems(), fetchIngredients()])
}, [])
```

---

### 16. Inline Style Objects
**Files:**
- `src/components/CookingMode.tsx:408`
- `src/components/TodaysMeals.tsx:162`
- `src/components/WeeklyMealPlan.tsx:193`

**Problem:** `style={{ width: ... }}` creates new object each render.

**Fix:** Extract to `useMemo` or CSS classes.

---

## Low Priority Issues

### 17. Multiple Supabase Client Instantiation
**File:** `src/app/api/amazon/verify-receipt/route.ts:79-82, 124-127`

**Problem:** Creates new Supabase client twice in same request.

**Fix:** Pass client as parameter or reuse singleton.

---

### 18. No Request Deduplication
**Files:** Multiple data fetching locations

**Problem:** No SWR/React Query for caching and deduplication.

**Recommendation:** Consider adopting `@tanstack/react-query` or `swr` for:
- Automatic caching
- Request deduplication
- Stale-while-revalidate pattern
- Optimistic updates

---

### 19. No Virtual List for Large Item Collections
**File:** `src/app/dashboard/pantry/page.tsx:757-847`

**Problem:** Large pantry lists render all items to DOM.

**Recommendation:** Use `react-window` or `@tanstack/react-virtual` for lists > 100 items.

---

## Summary by Severity

| Severity | Count | Top Issues |
|----------|-------|------------|
| Critical | 5 | N+1 queries, No parallelization, O(n*m) algorithm, Context re-renders |
| High | 5 | Duplicate fetching, Unbounded queries, JS aggregation |
| Medium | 6 | Missing useMemo, Inline functions, Over-fetching |
| Low | 3 | Client duplication, No caching library, No virtualization |

---

## Recommended Fix Priority

1. **Immediate:** Fix AuthContext memoization (affects every page)
2. **Immediate:** Add `Promise.all()` to scan-and-cook image processing
3. **This Sprint:** Optimize grocery list pantry lookup algorithm
4. **This Sprint:** Fix N+1 in account deletion
5. **Next Sprint:** Add useMemo to heavy computations
6. **Backlog:** Adopt React Query for data fetching
7. **Backlog:** Add react-window for long lists

---

*Generated: 2026-01-02*
