# Numerology API Configuration

The AstroPinch numerology feature now supports external APIs for enhanced accuracy and detailed interpretations.

## Supported APIs

### 1. Roxy API (Primary)
- **Website**: https://roxyapi.com
- **Features**: Complete numerology charts, Life Path, Destiny, Soul Urge, Personality numbers
- **Setup**: 
  1. Sign up at https://roxyapi.com
  2. Get your API key
  3. Set environment variable: `ROXY_API_KEY=your_key_here`

### 2. RapidAPI - Numerology API (Secondary)
- **Website**: https://rapidapi.com/hub
- **API**: Numerology API by Dakidarts
- **Features**: Life Path, Destiny, Soul Urge, Personality calculations
- **Setup**:
  1. Sign up at https://rapidapi.com
  2. Subscribe to "Numerology API" by Dakidarts
  3. Get your RapidAPI key
  4. Set environment variable: `RAPIDAPI_KEY=your_key_here`

### 3. Fallback (Local Calculation)
- Uses Pythagorean numerology system
- Automatically activates when external APIs are unavailable
- No API key required

## Priority Order

The system tries APIs in this order:
1. **Roxy API** (most comprehensive)
2. **RapidAPI** (good alternative)
3. **Local Fallback** (always available)

## Environment Variables

Create a `.env` file in the `backend` directory or set these environment variables:

```bash
# Numerology APIs
ROXY_API_KEY=your_roxy_api_key_here
RAPIDAPI_KEY=your_rapidapi_key_here

# AI Insights (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

## Testing

Test the numerology service:

```bash
cd backend
python -c "from services.numerology_service import get_numerology_data; import json; print(json.dumps(get_numerology_data('John Doe', 1990, 5, 15), indent=2))"
```

## API Response Format

All APIs return data in a standardized format:

```json
{
  "life_path": 3,
  "expression": 8,
  "soul_urge": 8,
  "personality": 9,
  "birthday": 6,
  "name": "John Doe",
  "birth_date": "1990-05-15",
  "source": "roxy|rapidapi|fallback",
  "detailed_analysis": {
    "life_path": "Interpretation text...",
    "expression": "Interpretation text...",
    "soul_urge": "Interpretation text...",
    "personality": "Interpretation text..."
  }
}
```

## Notes

- External APIs provide more detailed interpretations
- Fallback mode ensures the feature always works
- No errors if API keys are not configured
- API responses are cached for performance (future enhancement)
