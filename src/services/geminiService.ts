// Gemini AI service for location data
interface LocationData {
  name: string;
  population?: number;
  area?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Get Gemini API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Get location data - tries Gemini first, falls back to reverse geocoding
export async function getLocationData(lat: number, lng: number): Promise<LocationData> {
  // Try Gemini API if key is available
  if (GEMINI_API_KEY) {
    try {
      return await getLocationDataFromGemini(lat, lng, GEMINI_API_KEY);
    } catch (error) {
      console.warn('Gemini API error, falling back to reverse geocoding:', error);
      // Fall through to reverse geocoding
    }
  }
  
  // Fallback to reverse geocoding (free, no API key needed)
  
  try {
    // Try to get location name using reverse geocoding (free alternative)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'UrbanPulse/1.0',
        },
      }
    );
    
    const data = await response.json();
    
    const address = data.address || {};
    const locationName = 
      address.city || 
      address.town || 
      address.village || 
      address.municipality ||
      address.county ||
      address.state ||
      `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    
    // Mock population data (in production, use Gemini AI to get real data)
    const mockPopulation = Math.floor(Math.random() * 500000) + 50000;
    
    return {
      name: locationName,
      population: mockPopulation,
      area: address.state || 'Unknown',
      country: address.country || 'Unknown',
      state: address.state || undefined,
      city: address.city || address.town || undefined,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      coordinates: { lat, lng },
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    // Fallback data
    return {
      name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      population: 100000,
      coordinates: { lat, lng },
    };
  }
}

// Gemini AI integration function
export async function getLocationDataFromGemini(lat: number, lng: number, apiKey: string): Promise<LocationData> {
  try {
    const prompt = `Get detailed information about the location at coordinates ${lat}, ${lng}. 
    Provide: city/town name, approximate population, state/province, country, timezone.
    Return as JSON with these fields: name (string), population (number), state (string), country (string), city (string), timezone (string).`;

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
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON from the response
    let locationInfo: any = {};
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        locationInfo = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('Could not parse Gemini JSON response, using text parsing');
      // If JSON parsing fails, try to extract info from text
      locationInfo = { name: text.split('\n')[0] || `${lat.toFixed(4)}, ${lng.toFixed(4)}` };
    }

    // Also get basic location info from reverse geocoding for consistency
    const reverseGeocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      {
        headers: { 'User-Agent': 'UrbanPulse/1.0' },
      }
    );
    const reverseData = await reverseGeocodeResponse.json();
    const address = reverseData.address || {};

    return {
      name: locationInfo.name || address.city || address.town || address.village || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      population: locationInfo.population || Math.floor(Math.random() * 500000) + 50000,
      area: locationInfo.state || address.state || 'Unknown',
      country: locationInfo.country || address.country || 'Unknown',
      state: locationInfo.state || address.state,
      city: locationInfo.city || address.city || address.town,
      timezone: locationInfo.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      coordinates: { lat, lng },
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error; // Re-throw to allow fallback
  }
}

