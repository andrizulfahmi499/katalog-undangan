# Task 1.3 Testing Guide

## Manual Testing Instructions

This guide provides step-by-step instructions for manually testing the theme configuration API endpoints.

## Prerequisites

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Have a test member in the database with:
   - `landingPageEnabled: true`
   - `landingPageTheme: 'cleanapp'`
   - A valid `customSlug`

## Test Cases

### Test 1: Save Theme Configuration (Valid Data)

**Endpoint:** POST `/api/admin/theme-config`

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/theme-config \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "YOUR_MEMBER_ID",
    "config": {
      "hero": {
        "title": "Welcome to My Wedding",
        "subtitle": "Join us for our special day",
        "ctaText": "RSVP Now",
        "backgroundImage": "",
        "heroImage": ""
      },
      "features": {
        "title": "Why Choose Us",
        "items": [
          {
            "icon": "✨",
            "title": "Beautiful Design",
            "description": "Stunning templates for your special day"
          },
          {
            "icon": "📱",
            "title": "Mobile Ready",
            "description": "Perfect on all devices"
          },
          {
            "icon": "🎨",
            "title": "Customizable",
            "description": "Make it your own"
          }
        ]
      },
      "pricing": {
        "title": "Our Packages",
        "tiers": [
          {
            "name": "Basic",
            "price": "$99",
            "features": ["Feature 1", "Feature 2"],
            "ctaText": "Choose",
            "recommended": false
          }
        ]
      },
      "faq": {
        "title": "FAQ",
        "items": [
          {
            "question": "How does it work?",
            "answer": "It works great!"
          },
          {
            "question": "What is included?",
            "answer": "Everything you need."
          },
          {
            "question": "Can I customize?",
            "answer": "Yes, fully customizable."
          }
        ]
      },
      "footer": {
        "text": "Thank you for visiting",
        "contactEmail": "contact@example.com",
        "contactPhone": "+1234567890",
        "socialMedia": {
          "facebook": "",
          "instagram": "",
          "twitter": "",
          "whatsapp": ""
        }
      },
      "colors": {
        "primary": "#FF6B9D",
        "secondary": "#C8E6F5",
        "accent": "#FFD700",
        "background": "#FFF8F0",
        "backgroundSecondary": "#FFFFFF",
        "textPrimary": "#2D3748",
        "textSecondary": "#718096"
      }
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Theme configuration saved successfully",
  "data": {
    "memberId": "YOUR_MEMBER_ID",
    "theme": "cleanapp",
    "config": { /* saved configuration */ }
  }
}
```

### Test 2: Save Theme Configuration (Invalid Data - Empty Title)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/theme-config \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "YOUR_MEMBER_ID",
    "config": {
      "hero": {
        "title": "",
        "ctaText": "Click"
      }
    }
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid configuration structure",
  "details": [
    {
      "path": "hero.title",
      "message": "Hero title is required"
    }
  ]
}
```

### Test 3: Save Theme Configuration (Invalid Data - Too Few Features)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/theme-config \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "YOUR_MEMBER_ID",
    "config": {
      "features": {
        "items": [
          {
            "icon": "✨",
            "title": "Feature 1",
            "description": "Description"
          }
        ]
      }
    }
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid configuration structure",
  "details": [
    {
      "path": "features.items",
      "message": "At least 3 features are required"
    }
  ]
}
```

### Test 4: Save Theme Configuration (Invalid Data - Invalid Color)

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/theme-config \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "YOUR_MEMBER_ID",
    "config": {
      "colors": {
        "primary": "red",
        "secondary": "#C8E6F5"
      }
    }
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Invalid configuration structure",
  "details": [
    {
      "path": "colors.primary",
      "message": "Color must be a valid hex color (e.g., #FF5733 or #F57)"
    }
  ]
}
```

### Test 5: Retrieve Theme Configuration (Admin)

**Endpoint:** GET `/api/admin/theme-config?memberId={memberId}`

**Request:**
```bash
curl http://localhost:3000/api/admin/theme-config?memberId=YOUR_MEMBER_ID
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "memberId": "YOUR_MEMBER_ID",
    "memberName": "Member Name",
    "theme": "cleanapp",
    "config": { /* configuration or default */ },
    "landingPageEnabled": true
  }
}
```

### Test 6: Retrieve Theme Configuration (Public - by slug)

**Endpoint:** GET `/api/public/settings?slug={customSlug}`

**Request:**
```bash
curl http://localhost:3000/api/public/settings?slug=YOUR_CUSTOM_SLUG
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "memberId": "YOUR_MEMBER_ID",
    "memberName": "Member Name",
    "theme": "cleanapp",
    "config": { /* configuration or default */ }
  }
}
```

### Test 7: Retrieve Theme Configuration (Public - by memberId)

**Endpoint:** GET `/api/public/settings?memberId={memberId}`

**Request:**
```bash
curl http://localhost:3000/api/public/settings?memberId=YOUR_MEMBER_ID
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "memberId": "YOUR_MEMBER_ID",
    "memberName": "Member Name",
    "theme": "cleanapp",
    "config": { /* configuration or default */ }
  }
}
```

### Test 8: Retrieve Global Settings (No Parameters)

**Endpoint:** GET `/api/public/settings`

**Request:**
```bash
curl http://localhost:3000/api/public/settings
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "landingPageTheme": "default"
  }
}
```

### Test 9: Error - Member Not Found

**Request:**
```bash
curl http://localhost:3000/api/public/settings?memberId=INVALID_ID
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Member not found"
}
```

### Test 10: Error - Landing Page Not Enabled

**Request:**
```bash
curl http://localhost:3000/api/public/settings?memberId=MEMBER_WITH_DISABLED_LP
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Landing page is not enabled for this member"
}
```

## Validation Rules Summary

### Hero Section
- `title`: Required, 1-200 characters
- `subtitle`: Optional, max 500 characters
- `ctaText`: Required, 1-50 characters
- `backgroundImage`: Optional, valid URL or empty string
- `heroImage`: Optional, valid URL or empty string

### Features Section
- `title`: Optional, max 200 characters
- `items`: Array of 3-6 feature items
  - `icon`: Required
  - `title`: Required, 1-100 characters
  - `description`: Required, 1-300 characters

### Pricing Section
- `title`: Optional, max 200 characters
- `tiers`: Array of 1-5 pricing tiers
  - `name`: Required, 1-100 characters
  - `price`: Required, 1-50 characters
  - `features`: Array of at least 1 feature string
  - `ctaText`: Required, 1-50 characters
  - `recommended`: Optional boolean

### FAQ Section
- `title`: Optional, max 200 characters
- `items`: Array of 3-10 FAQ items
  - `question`: Required, 1-300 characters
  - `answer`: Required, 1-1000 characters

### Footer Section
- `text`: Optional, max 500 characters
- `contactEmail`: Optional, valid email
- `contactPhone`: Optional, max 50 characters
- `socialMedia`: Optional object
  - `facebook`: Optional, valid URL or empty string
  - `instagram`: Optional, valid URL or empty string
  - `twitter`: Optional, valid URL or empty string
  - `whatsapp`: Optional string

### Colors
- All colors must be valid hex format: `#RGB` or `#RRGGBB`
- Required colors: `primary`, `secondary`, `accent`, `background`, `textPrimary`, `textSecondary`
- Optional: `backgroundSecondary`

## Testing with Postman/Insomnia

You can import these requests into Postman or Insomnia for easier testing:

1. Create a new collection
2. Add environment variables:
   - `BASE_URL`: `http://localhost:3000`
   - `MEMBER_ID`: Your test member ID
   - `CUSTOM_SLUG`: Your test member's custom slug

3. Create requests for each test case above
4. Use the environment variables in your requests

## Database Verification

After saving configuration, verify in the database:

```sql
SELECT 
  id, 
  name, 
  "landingPageTheme", 
  "landingPageConfig"
FROM "Member"
WHERE id = 'YOUR_MEMBER_ID';
```

The `landingPageConfig` column should contain the saved JSON configuration.

## Next Steps

After verifying these endpoints work correctly:
1. Proceed to Task 2.1: Define TypeScript types
2. Proceed to Task 2.2: Create CleanAppConfigContext
3. Integrate these endpoints into the admin dashboard UI
