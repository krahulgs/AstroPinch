"""
Numerology Service using External APIs
Integrates RapidAPI (Numerology API) and Roxy API for numerology calculations
With Phillips Numerology Model as comprehensive fallback
"""
import os
import requests
from services.phillips_numerology import get_complete_numerology_profile
from services.phillips_interpretations import get_interpretation, get_karmic_lesson_interpretation
from services.hilary_numerology_service import HilaryNumerologyService
from services.loshu_service import LoshuService

from groq import Groq

# API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
RAPIDAPI_HOST = "numerology-api4.p.rapidapi.com"

ROXY_API_KEY = os.getenv("ROXY_API_KEY", "")
ROXY_API_BASE = "https://roxyapi.com/api/v1"

def generate_ai_insights(name, birth_date_str, fadic_data, vedic_data=None, western_data=None, context=None, lang="en"):
    """
    Generates personalized numerology insights using Groq AI.
    Updated to include Vedic AND Western (Kerykeion) context.
    """
    if not GROQ_API_KEY:
        return None

    print(f"Generating insights using Groq API (Model: llama-3.3-70b-versatile)...")
    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        # Context String
        ctx_str = ""
        if context:
            p = context.get('profession')
            m = context.get('marital_status')
            if p: ctx_str += f"Profession: {p}\n"
            if m: ctx_str += f"Marital Status: {m}\n"
        
        prompt = f"""
        Act as an expert Numerologist specializing in Hilary Gerard's "Science of Success" (1937).
        
        Analyze the following profile:
        Name: {name}
        Birth Date: {birth_date_str}
        {ctx_str}
        Fadic Number: {fadic_data.get('fadic_number')} ({fadic_data.get('fadic_type')})
        
        Key Traits: {fadic_data.get('qualities', {}).get('positive')}
        Challenges: {fadic_data.get('qualities', {}).get('negative')}
        
        Vedic Context:
        Nakshatra: {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Unknown'}
        Current Dasha: {vedic_data.get('dasha', [{}])[0].get('planet') if vedic_data and vedic_data.get('dasha') else 'Unknown'}
        
        Western Context:
        Sun Sign: {western_data.get('sun_sign') if western_data else 'Unknown'}
        Ascendant: {western_data.get('ascendant') if western_data else 'Unknown'}

        Provide a deep, personalized 4-paragraph reading:
        1. The Core Vibration: How their Fadic Number shapes their fundamental character.
        2. Cosmic Alignment: How their Nakshatra (Vedic) and Sun Sign (Western) create a multidimensional identity.
        3. The Path to Success: Specific advice on leveraging their Numerology strengths alongside current Dasha energy.
        4. Future Outlook: A motivational closing statement based on their "Science of Success" archetype.
        
        Tone: Mystical but practical, encouraging, and authoritative.
        Keep it under 300 words.
        
        IMPORTANT: Provide the response in {lang} language.
        """
        
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback Template Generation
        try:
             advice = fadic_data.get('qualities', {}).get('positive', 'Focus on your strengths.')
             challenges = fadic_data.get('qualities', {}).get('negative', 'Be mindful of your weaknesses.')
             symbol = fadic_data.get('symbol', 'Unknown')
             
             fallback_text = f"""
             **The Core Vibration**
             Your Fadic Number matches the vibration of **{symbol}**. {fadic_data.get('description', '')} 
             
             **Vedic Alignment**
             Birth Nakshatra: {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Calculated separately'}. 
             This celestial alignment adds a layer of depth to your {symbol} energy.
             
             **The Path to Success**
             To achieve your highest potential, amplify your core strengths: {advice}. Success comes when you balance these opposing forces.
             
             **Future Outlook**
             As a {fadic_data.get('fadic_type', 'Seeker')}, your destiny is forged by action. 
             """
             return fallback_text
        except:
             return "AI Insights currently unavailable. Please focus on the detailed Numerology and Astrology sections above."

def calculate_numerology_rapidapi(name, year, month, day):
    """
    Calculate numerology using RapidAPI (Numerology API by Dakidarts)
    """
    if not RAPIDAPI_KEY:
        return None
    
    try:
        # Format date as YYYY-MM-DD
        birth_date = f"{year}-{month:02d}-{day:02d}"
        
        headers = {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST
        }
        
        # Life Path Number
        life_path_url = f"https://{RAPIDAPI_HOST}/life-path"
        life_path_params = {"birthdate": birth_date}
        
        # Expression Number (Destiny Number)
        expression_url = f"https://{RAPIDAPI_HOST}/destiny"
        expression_params = {"name": name}
        
        # Soul Urge Number
        soul_urge_url = f"https://{RAPIDAPI_HOST}/soul-urge"
        soul_urge_params = {"name": name}
        
        # Personality Number
        personality_url = f"https://{RAPIDAPI_HOST}/personality"
        personality_params = {"name": name}
        
        # Make API calls
        life_path_response = requests.get(life_path_url, headers=headers, params=life_path_params, timeout=10)
        expression_response = requests.get(expression_url, headers=headers, params=expression_params, timeout=10)
        soul_urge_response = requests.get(soul_urge_url, headers=headers, params=soul_urge_params, timeout=10)
        personality_response = requests.get(personality_url, headers=headers, params=personality_params, timeout=10)
        
        if all([r.status_code == 200 for r in [life_path_response, expression_response, soul_urge_response, personality_response]]):
            return {
                "life_path": life_path_response.json(),
                "expression": expression_response.json(),
                "soul_urge": soul_urge_response.json(),
                "personality": personality_response.json(),
                "source": "rapidapi"
            }
        
    except Exception as e:
        print(f"RapidAPI error: {e}")
    
    return None

def calculate_numerology_roxy(name, year, month, day):
    """
    Calculate numerology using Roxy API
    """
    if not ROXY_API_KEY:
        return None
    
    try:
        headers = {
            "Authorization": f"Bearer {ROXY_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "name": name,
            "birth_date": f"{year}-{month:02d}-{day:02d}"
        }
        
        # Complete numerology chart endpoint
        url = f"{ROXY_API_BASE}/numerology/complete-chart"
        
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            return {
                **data,
                "source": "roxy"
            }
    
    except Exception as e:
        print(f"Roxy API error: {e}")
    
    return None

def calculate_numerology_fallback(name, year, month, day):
    """
    Fallback numerology calculation using Phillips Pythagorean system
    Most comprehensive fallback with full Phillips methodology
    """
    # Get complete Phillips profile
    phillips_profile = get_complete_numerology_profile(name, year, month, day)
    
    # Extract core numbers
    core = phillips_profile["core_numbers"]
    
    # Format for compatibility with API response format
    result = {
        "life_path": core["life_path"],
        "expression": core["expression"],
        "soul_urge": core["soul_urge"],
        "personality": core["personality"],
        "birthday": core["birthday"],
        "maturity": core["maturity"],
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}",
        "source": "phillips",
        "phillips_profile": phillips_profile,  # Include full Phillips data
        "detailed_analysis": {
            "life_path": get_interpretation("life_path", core["life_path"]),
            "expression": get_interpretation("life_path", core["expression"]),
            "soul_urge": get_interpretation("life_path", core["soul_urge"]),
            "personality": get_interpretation("life_path", core["personality"])
        }
    }
    
    return result

def get_numerology_data(name, year, month, day, vedic_data=None, western_data=None, context=None, lang="en", gender="male"):
    """
    Get numerology data from external APIs with Phillips fallback
    Priority: Roxy API > RapidAPI > Phillips Model
    """
    data = None
    
    # Try Roxy API first (most comprehensive)
    roxy_data = calculate_numerology_roxy(name, year, month, day)
    if roxy_data:
        # Enrich with Phillips profile
        phillips_profile = get_complete_numerology_profile(name, year, month, day)
        roxy_data["phillips_profile"] = phillips_profile
        data = format_roxy_response(roxy_data, name, year, month, day)
    
    # Try RapidAPI second
    elif calculate_numerology_rapidapi(name, year, month, day):
        rapidapi_data = calculate_numerology_rapidapi(name, year, month, day)
        if rapidapi_data:
            # Enrich with Phillips profile
            phillips_profile = get_complete_numerology_profile(name, year, month, day)
            rapidapi_data["phillips_profile"] = phillips_profile
            data = format_rapidapi_response(rapidapi_data, name, year, month, day)
    
    # Fallback to Phillips model (most comprehensive local calculation)
    else:
        print("Using Phillips numerology model")
        data = calculate_numerology_fallback(name, year, month, day)

    # --- Integrations ---
    
    # 1. Add Hilary Gerard "Science of Success" Data
    hilary_report = HilaryNumerologyService.get_science_of_success_report(name, day, month, year)
    data["science_of_success"] = hilary_report
    
    # 2. Add Loshu Grid (AstroArunPandit Style)
    loshu_data = LoshuService.calculate_loshu_grid(day, month, year, gender)
    data["loshu_grid"] = loshu_data
    
    # 3. Add Gemini AI Insights (if key configured)
    ai_insights = generate_ai_insights(name, f"{year}-{month:02d}-{day:02d}", hilary_report, vedic_data=vedic_data, western_data=western_data, context=context, lang=lang)
    if ai_insights:
        data["ai_insights"] = ai_insights
        data["source"] = "groq-ai" # Mark as AI enhanced (Groq)
        data["ai_model"] = "llama-3.3-70b-versatile"

    return data

def format_roxy_response(data, name, year, month, day):
    """Format Roxy API response to match our schema"""
    return {
        "life_path": data.get("life_path_number", {}).get("number", 1),
        "expression": data.get("destiny_number", {}).get("number", 1),
        "soul_urge": data.get("soul_urge_number", {}).get("number", 1),
        "personality": data.get("personality_number", {}).get("number", 1),
        "birthday": day if day <= 9 else sum(int(d) for d in str(day)),
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}",
        "source": "roxy",
        "detailed_analysis": {
            "life_path": data.get("life_path_number", {}).get("interpretation", ""),
            "expression": data.get("destiny_number", {}).get("interpretation", ""),
            "soul_urge": data.get("soul_urge_number", {}).get("interpretation", ""),
            "personality": data.get("personality_number", {}).get("interpretation", "")
        }
    }

def format_rapidapi_response(data, name, year, month, day):
    """Format RapidAPI response to match our schema"""
    return {
        "life_path": data.get("life_path", {}).get("number", 1),
        "expression": data.get("expression", {}).get("number", 1),
        "soul_urge": data.get("soul_urge", {}).get("number", 1),
        "personality": data.get("personality", {}).get("number", 1),
        "birthday": day if day <= 9 else sum(int(d) for d in str(day)),
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}",
        "source": "rapidapi",
        "detailed_analysis": {
            "life_path": data.get("life_path", {}).get("description", ""),
            "expression": data.get("expression", {}).get("description", ""),
            "soul_urge": data.get("soul_urge", {}).get("description", ""),
            "personality": data.get("personality", {}).get("description", "")
        }
    }
