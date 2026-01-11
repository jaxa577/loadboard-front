# Translation Fix Guide

## Issue
Translations are not appearing on the landing page - text shows as Russian instead of using i18n system.

## Root Cause
The Nuxt dev server needs to be restarted after adding new translation keys to the JSON files. The i18n module caches translations on startup.

## Solution

### 1. Restart the Development Server
```bash
cd C:\Users\Jaxa\Desktop\CLB-b-f\clb2

# Kill any running dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Clear Browser Cache (if needed)
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or open DevTools → Application → Clear Storage → Clear site data

### 3. Verify Translations Work
Open http://localhost:3000 and:
1. Check that landing page text uses current language (default: Russian)
2. Use the language switcher to change to English or Uzbek
3. Verify all text updates correctly

## What Was Fixed

### 1. ✅ Translation Keys Added
Added comprehensive translations to all 3 languages:
- `locales/en.json` - English translations
- `locales/ru.json` - Russian translations
- `locales/uz.json` - Uzbek translations

New translation sections:
- `landing.hero.*` - Hero section
- `landing.features.*` - Features section
- `landing.howItWorks.*` - How it works
- `landing.roles.*` - Platform roles
- `landing.faq.*` - FAQ section
- `landing.footer.*` - Footer

### 2. ✅ Components Updated
All landing components now use `{{ $t('key') }}` syntax:
- `LandingHero.vue`
- `LandingFeatures.vue`
- `LandingHowItWorks.vue`
- `LandingRoleCards.vue`
- `LandingFaq.vue`
- `LandingFooter.vue`
- `LandingHeader.vue`

### 3. ✅ Authentication Features
- **LandingHeader**: Shows "Profile" button for logged-in users, "Login/Register" for guests
- **Login page**: Redirects to `/loads` if user is already logged in
- **Register page**: Redirects to `/loads` if user is already logged in

### 4. ✅ Language Switcher
Added `<LanguageSwitcher />` component to LandingHeader so users can switch languages.

## Testing Checklist

- [ ] Dev server restarted successfully
- [ ] Landing page loads without errors
- [ ] Text appears in Russian by default
- [ ] Language switcher changes all text to English
- [ ] Language switcher changes all text to Uzbek
- [ ] Logged-in users see "Profile" button in header
- [ ] Logged-out users see "Login/Register" buttons
- [ ] Logged-in users redirected from /login to /loads
- [ ] Logged-in users redirected from /register to /loads

## Common Issues

### Translations still not working after restart?
1. Check browser console for errors (F12)
2. Verify JSON files have no syntax errors:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('locales/en.json', 'utf8'))"
   node -e "JSON.parse(require('fs').readFileSync('locales/ru.json', 'utf8'))"
   node -e "JSON.parse(require('fs').readFileSync('locales/uz.json', 'utf8'))"
   ```
3. Clear `.nuxt` cache folder and restart:
   ```bash
   rm -rf .nuxt
   npm run dev
   ```

### Language switcher not appearing?
Check that `LanguageSwitcher` component exists in `components/` folder.

## Files Modified

**Translation Files:**
- `locales/en.json` - Added 60+ new keys
- `locales/ru.json` - Added 60+ new keys
- `locales/uz.json` - Added 60+ new keys

**Components:**
- `components/landing/LandingHero.vue`
- `components/landing/LandingFeatures.vue`
- `components/landing/LandingHowItWorks.vue`
- `components/landing/LandingRoleCards.vue`
- `components/landing/LandingFaq.vue`
- `components/landing/LandingFooter.vue`
- `components/landing/LandingHeader.vue`

**Pages:**
- `pages/login.vue` - Added redirect for authenticated users
- `pages/register.vue` - Added redirect for authenticated users
