# Gemini AI Integration Setup

## Current Implementation

The app currently uses OpenStreetMap's Nominatim API for reverse geocoding to get location names and basic information. This is free and doesn't require an API key.

## Future: Gemini AI Integration

To use Gemini AI for enhanced location data (population, detailed area information, etc.), you'll need to:

1. Get a Gemini API key from Google AI Studio: https://makersuite.google.com/app/apikey

2. Update `src/services/geminiService.ts`:

```typescript
// Uncomment and configure the Gemini API call
export async function getLocationDataFromGemini(lat: number, lng: number, apiKey?: string): Promise<LocationData> {
  if (!apiKey) {
    return getLocationData(lat, lng); // Fallback
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Get detailed information about the location at coordinates ${lat}, ${lng}. Include: city name, population, state/province, country, timezone. Return as JSON with fields: name, population, area, country, state, city, timezone.`
          }]
        }]
      })
    }
  );

  const data = await response.json();
  // Parse Gemini response and return LocationData
}
```

3. Add API key to environment variables (create `.env` file):
```
VITE_GEMINI_API_KEY=your_api_key_here
```

4. Update the service to use the API key:
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
return getLocationDataFromGemini(lat, lng, apiKey);
```

## Current Features

- ✅ Reverse geocoding for location names (free, no API key needed)
- ✅ Location data fetching on location change
- ✅ Real-time location updates
- ✅ Population estimation (currently mock data, replace with Gemini)
- ✅ Country/State/City information from reverse geocoding

