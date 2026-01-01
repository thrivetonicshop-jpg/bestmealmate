# Dependency Audit Report

**Generated:** 2026-01-01
**Project:** BestMealMate

---

## Summary

| Category | Status |
|----------|--------|
| Security Vulnerabilities | **0 found** |
| Outdated Packages | 13 packages |
| Unused Dependencies | 1 confirmed |
| Total Dependencies | 533 packages |

---

## Security Vulnerabilities

**No vulnerabilities detected.** The npm audit shows 0 issues at all severity levels.

Note: `node-domexception@1.0.0` is deprecated but poses no security risk. It recommends using the platform's native DOMException instead.

---

## Outdated Packages

### Critical Updates (Major Versions Behind)

| Package | Current | Latest | Priority | Risk |
|---------|---------|--------|----------|------|
| `@anthropic-ai/sdk` | 0.39.0 | 0.71.2 | **High** | API changes, new features |
| `framer-motion` | 11.18.2 | 12.23.26 | Medium | Breaking animation API changes |
| `lucide-react` | 0.460.0 | 0.562.0 | Low | New icons, minor changes |
| `react` / `react-dom` | 18.3.1 | 19.2.3 | **Defer** | Major version - significant changes |
| `next` | 15.5.9 | 16.1.1 | **Defer** | Major version - requires testing |
| `tailwindcss` | 3.4.19 | 4.1.18 | **Defer** | Major version - significant migration |

### Minor/Patch Updates (Safe to Update)

| Package | Current | Wanted | Latest |
|---------|---------|--------|--------|
| `@playwright/test` | 1.56.0 | 1.57.0 | 1.57.0 |
| `playwright` | 1.56.0 | 1.57.0 | 1.57.0 |
| `@types/node` | 20.19.27 | 20.19.27 | 25.0.3 |
| `@types/react` | 18.3.27 | 18.3.27 | 19.2.7 |
| `@types/react-dom` | 18.3.7 | 18.3.7 | 19.2.3 |
| `eslint-config-next` | 15.5.9 | 15.5.9 | 16.1.1 |

---

## Unused Dependencies

### Confirmed Unused (Can Remove)

| Package | Type | Size | Recommendation |
|---------|------|------|----------------|
| `@stripe/stripe-js` | dependency | ~200KB | **Remove** - Frontend Stripe SDK not imported anywhere. Backend uses `stripe` package directly. |

### Potentially Unused (Verify Before Removing)

| Package | Type | Reason to Keep |
|---------|------|----------------|
| `@capacitor/core` | dependency | Required for native mobile app builds (Capacitor) |
| `@capacitor/android` | devDependency | Required for Android builds |
| `@capacitor/ios` | devDependency | Required for iOS builds |

---

## Bundle Bloat Analysis

### Largest Dependencies

| Package | Size | Notes |
|---------|------|-------|
| `@next/` | 273MB | Next.js core - required |
| `next/` | 137MB | Next.js framework - required |
| `@img/` | 33MB | Sharp image processing deps |
| `lucide-react` | 29MB | Icon library - consider tree-shaking |
| `typescript` | 23MB | Dev only - not in production bundle |
| `playwright-core` | 8.1MB | Dev only - testing |
| `stripe` | 6.8MB | Backend API - server only |
| `tailwindcss` | 5.7MB | Dev only - CSS build |

### Optimization Opportunities

1. **lucide-react (29MB installed, ~200KB client bundle)**
   - Currently importing icons correctly with tree-shaking
   - No action needed if using named imports like `import { Icon } from 'lucide-react'`

2. **Sharp (33MB @img dependencies)**
   - Required for Next.js Image Optimization
   - Already a devDependency - doesn't affect client bundle

---

## Recommendations

### Immediate Actions (Low Risk)

```bash
# Update Playwright (testing tools)
npm update @playwright/test playwright

# Update Anthropic SDK (API improvements)
npm install @anthropic-ai/sdk@latest

# Remove unused Stripe frontend SDK
npm uninstall @stripe/stripe-js
```

### Short-term Actions (Test After)

```bash
# Update lucide-react (new icons)
npm install lucide-react@latest

# Update framer-motion (test animations)
npm install framer-motion@latest
```

### Defer (Major Version Changes)

These require significant testing and potential code changes:

1. **React 19** - Wait for Next.js 16 stable compatibility
2. **Next.js 16** - Evaluate after stable release, test thoroughly
3. **Tailwind CSS 4** - Major migration, new configuration format

---

## Version Pinning Recommendations

Consider pinning these versions more strictly in `package.json`:

```json
{
  "dependencies": {
    "next": "15.5.9",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@anthropic-ai/sdk": "^0.71.0"
  }
}
```

---

## Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Weekly | Run `npm audit` for security |
| Monthly | Run `npm outdated` for updates |
| Quarterly | Evaluate major version upgrades |

---

## Commands Reference

```bash
# Check for outdated packages
npm outdated

# Security audit
npm audit

# Check for unused dependencies
npx depcheck

# Update within semver range
npm update

# Interactive update tool
npx npm-check-updates -i
```
