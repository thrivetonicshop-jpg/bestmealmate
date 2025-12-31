# Dependency Audit Report

**Date:** December 31, 2025
**Project:** BestMealMate

## Summary

| Category | Status |
|----------|--------|
| Security Vulnerabilities | 0 found |
| Outdated Packages | 6 significant |
| Potential Bloat | 2 packages |

---

## Security Vulnerabilities

**npm audit: 0 vulnerabilities found**

The project has no known security vulnerabilities in its dependency tree.

---

## Outdated Packages

### High Priority Updates

| Package | Current | Latest | Priority | Notes |
|---------|---------|--------|----------|-------|
| `@anthropic-ai/sdk` | 0.39.0 | 0.71.2 | **HIGH** | Critical for AI features - update immediately |
| `@supabase/supabase-js` | 2.39.0 | 2.89.0 | **MEDIUM** | Bug fixes and performance improvements |
| `react-hot-toast` | 2.4.1 | 2.6.0 | **LOW** | Minor improvements |

### Major Version Updates (Evaluate Carefully)

| Package | Current | Latest | Recommendation |
|---------|---------|--------|----------------|
| `next` | 15.5.9 | 16.1.1 | **WAIT** - Next.js 16 is very new, wait for ecosystem stability |
| `react` / `react-dom` | 18.2.0 | 19.2.3 | **WAIT** - React 19 has breaking changes, many libraries don't support it yet |
| `framer-motion` | 11.0.0 | 12.23.26 | **EVALUATE** - Review changelog for breaking changes before updating |
| `lucide-react` | 0.460.0 | 0.562.0 | **OK TO UPDATE** - Icon library, low risk |

---

## Bloat Analysis

### 1. Duplicate Playwright Packages

**Issue:** Both `playwright` and `@playwright/test` are installed as devDependencies.

```json
"@playwright/test": "^1.56.0",
"playwright": "^1.56.0",
```

**Recommendation:** Remove `playwright` - the `@playwright/test` package includes the full Playwright library.

**Savings:** ~50MB in node_modules

### 2. Capacitor Packages (Potential Removal)

**Packages:**
- `@capacitor/core` (dependency)
- `@capacitor/android` (devDependency)
- `@capacitor/ios` (devDependency)
- `@capacitor/cli` (devDependency)

**Analysis:**
- `capacitor.config.ts` exists and is configured for mobile builds
- **No Capacitor imports found in source code** (`src/` directory)
- Mobile app appears to be set up but not actively used

**Recommendation:**
- If mobile development is **not planned**: Remove all Capacitor packages (~100MB savings)
- If mobile development is **planned**: Keep packages but note they add significant weight

---

## Package Usage Analysis

| Package | Usage | Verdict |
|---------|-------|---------|
| `lucide-react` | 50 files | Essential - heavily used |
| `react-hot-toast` | 17 files | Essential - core UX |
| `framer-motion` | 4 files | Used but light usage |
| `resend` | 1 file (`email.ts`) | Essential for email |
| `@vercel/analytics` | Layout only | Essential for analytics |

---

## Recommended Actions

### Immediate (Low Risk)

```bash
# Update minor versions
npm update @anthropic-ai/sdk @supabase/supabase-js react-hot-toast lucide-react

# Remove duplicate playwright
npm uninstall playwright
```

### Short-term

1. Test the Anthropic SDK update in development before deploying
2. Review framer-motion 12.x changelog for breaking changes

### Long-term (Wait 3-6 months)

1. **React 19 Migration** - Wait for ecosystem maturity
2. **Next.js 16 Migration** - Wait for stability and community feedback

### Decision Required

**Capacitor packages:** Keep or remove based on mobile development plans.

To remove:
```bash
npm uninstall @capacitor/core @capacitor/android @capacitor/ios @capacitor/cli
rm capacitor.config.ts
# Also remove mobile scripts from package.json
```

---

## Updated package.json (Recommended)

After applying immediate updates:

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.71.0",
    "@capacitor/core": "^8.0.0",
    "@stripe/stripe-js": "^8.6.0",
    "@supabase/supabase-js": "^2.89.0",
    "@vercel/analytics": "^1.6.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.562.0",
    "next": "15.5.9",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.6.0",
    "resend": "^6.6.0",
    "stripe": "^20.1.0"
  },
  "devDependencies": {
    "@capacitor/android": "^8.0.0",
    "@capacitor/cli": "^8.0.0",
    "@capacitor/ios": "^8.0.0",
    "@eslint/eslintrc": "^3.3.3",
    "@playwright/test": "^1.56.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "15.5.9",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.7",
    "postcss": "^8.4.0",
    "sharp": "^0.34.5",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

Note: `playwright` removed from devDependencies.
