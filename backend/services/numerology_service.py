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

def generate_ai_insights(name, birth_date_str, numerology_data, loshu_data=None, vedic_data=None, western_data=None, context=None, lang="en"):
    """
    Generates personalized numerology insights using Groq AI.
    Updated to include Vedic AND Western (Kerykeion) context.
    Fixed: Successfully handles both list and dictionary dasha formats to prevent crashes.
    """
    # Helper for fallback to avoid repetition
    def get_fallback():
        try:
             advice = numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('strength', 'Focus on your strengths.')
             lp_val = numerology_data.get('life_path', 'Core')
             
             fallback_text = f"""
             **The Core Vibration**
             As a vibration **{lp_val}**, you possess natural leadership and creative potential. {numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('text', '')} 
             
             **Vedic Alignment**
             Birth Nakshatra: {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Calculated separately'}. 
             This celestial alignment adds a layer of depth to your numeric energy.
             
             **The Path to Success**
             To achieve your highest potential, amplify your core strengths: {advice}. Success comes when you balance your ambition with steady effort.
             
             **Future Outlook**
             Your destiny is forged by action and alignment with your true self. 
             """
             return fallback_text
        except:
             return "AI Insights currently unavailable. Please focus on the detailed Numerology and Astrology sections above."

    if not GROQ_API_KEY:
        print("Warning: GROQ_API_KEY missing. Returning fallback numerology insights.")
        return get_fallback()

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
        
        # Safe Dasha Extraction
        dasha_lord = "Unknown"
        if vedic_data:
            d_data = vedic_data.get('dasha')
            if isinstance(d_data, dict):
                dasha_lord = f"{d_data.get('active_mahadasha', 'Unknown')} - {d_data.get('active_antardasha', 'Unknown')}"
            elif isinstance(d_data, list) and d_data:
                dasha_lord = d_data[0].get('planet', 'Unknown')

        # Age-aware logic
        from datetime import datetime
        try:
            birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        except:
            age = None

        age_filter = ""
        if age is not None:
            if age <= 12:
                age_filter = "RULE: User is a CHILD. Focus ONLY on character, talents, and learning. NEVER mention marriage, career, or business."
            elif age <= 17:
                age_filter = "RULE: User is a TEENAGER. Focus on personality, studies, and social skills. Avoid marriage or professional predictions."

        prompt = f"""
        Act as an expert Numerologist specializing in Pythagorean and Vedic systems.
        
        Analyze the following profile:
        Name: {name}
        Birth Date: {birth_date_str}
        {ctx_str}
        Life Path Number: {numerology_data.get('life_path')}
        Mulank: {loshu_data.get('mulank') if loshu_data else 'Unknown'}
        Bhagyank: {loshu_data.get('bhagyank') if loshu_data else 'Unknown'}
        
        Detailed Analysis Traits: {numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('strength')}
        Challenges to Master: {numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('caution')}
        
        Vedic Context:
        Nakshatra: {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Unknown'}
        Current Dasha: {dasha_lord}
        
        Western Context:
        Sun Sign: {western_data.get('sun_sign') if western_data else 'Unknown'}
        Ascendant: {western_data.get('ascendant') if western_data else 'Unknown'}

        Loshu Grid Missing Numbers & Remedies:
        {', '.join(map(str, loshu_data.get('missing_numbers', []))) if loshu_data else 'None'}
        Suggested Remedies: {loshu_data.get('remedies', {}) if loshu_data else 'None'}

        Provide a deep, personalized 4-paragraph reading:
        1. The Core Vibration: How their Life Path Number/Mulank shapes their fundamental character.
        2. Cosmic Alignment: How their Nakshatra (Vedic) and Sun Sign (Western) create a multidimensional identity.
        3. The Path to Success: Specific advice on leveraging their Numerology strengths alongside current Dasha energy.
        4. Future Outlook: A motivational closing statement based on their unique cosmic signature.
        
        Tone: Mystical but practical, encouraging, and authoritative.
        Keep it under 300 words.
        {age_filter}
        
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
        return get_fallback()


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
            "expression": get_interpretation("expression", core["expression"]),
            "soul_urge": get_interpretation("soul_urge", core["soul_urge"]),
            "personality": get_interpretation("personality", core["personality"]),
            "personal_year": get_interpretation("personal_year", phillips_profile["life_cycles"]["personal_year"]),
            "personal_month": get_interpretation("personal_month", phillips_profile["life_cycles"]["personal_month"]),
            "timing": get_interpretation("timing", phillips_profile["life_cycles"]["personal_year"]),
            "name_insight": get_interpretation("name_insight", core["expression"]),
            "lucky_elements": get_interpretation("lucky_elements", core["life_path"])
        },
        "lucky_elements": get_interpretation("lucky_elements", core["life_path"]),
        "personal_year": phillips_profile["life_cycles"]["personal_year"],
        "personal_month": phillips_profile["life_cycles"]["personal_month"]
    }
    
    return result

def get_numerology_data(name, year, month, day, vedic_data=None, western_data=None, context=None, lang="en", gender="male"):
    """
    Get numerology data from external APIs with Phillips fallback
    Parallelized version to handle external API latency.
    """
    from concurrent.futures import ThreadPoolExecutor
    
    with ThreadPoolExecutor() as executor:
        # Parallel Tasks
        roxy_future = executor.submit(calculate_numerology_roxy, name, year, month, day)
        rapid_future = executor.submit(calculate_numerology_rapidapi, name, year, month, day)
        phillips_future = executor.submit(get_complete_numerology_profile, name, year, month, day)
        loshu_future = executor.submit(LoshuService.calculate_loshu_grid, day, month, year, gender)

        # Get results
        roxy_data = roxy_future.result()
        phillips_profile = phillips_future.result()
        loshu_data = loshu_future.result()

        data = None
        if roxy_data:
            roxy_data["phillips_profile"] = phillips_profile
            data = format_roxy_response(roxy_data, name, year, month, day)
        else:
            rapidapi_data = rapid_future.result()
            if rapidapi_data:
                rapidapi_data["phillips_profile"] = phillips_profile
                data = format_rapidapi_response(rapidapi_data, name, year, month, day)
            else:
                # Fallback to Phillips
                data = calculate_numerology_fallback(name, year, month, day)

        # Attach integrations
        data["loshu_grid"] = loshu_data
        
        # Add Hilary Gerard's Science of Success
        try:
            data["science_of_success"] = HilaryNumerologyService.get_science_of_success_report(name, day, month, year)
        except Exception as e:
            print(f"Science of Success error: {e}")
            data["science_of_success"] = None
        
        # Parallel Step 2: AI Insights (Dependent on previous results)
        ai_insights = generate_ai_insights(
            name, f"{year}-{month:02d}-{day:02d}", data,
            loshu_data=loshu_data, vedic_data=vedic_data, 
            western_data=western_data, context=context, lang=lang
        )
        
        if ai_insights:
            data["ai_insights"] = ai_insights
            data["source"] = "groq-ai"
            data["ai_model"] = "llama-3.3-70b-versatile"

    return data

def format_roxy_response(data, name, year, month, day):
    """Format Roxy API response to match our schema"""
    return {
        "life_path": (data.get("life_path_number") or {}).get("number", 1),
        "expression": (data.get("destiny_number") or {}).get("number", 1),
        "soul_urge": (data.get("soul_urge_number") or {}).get("number", 1),
        "personality": (data.get("personality_number") or {}).get("number", 1),
        "birthday": day if day <= 9 else sum(int(d) for d in str(day)),
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}",
        "source": "roxy",
        "detailed_analysis": {
            "life_path": get_interpretation("life_path", (data.get("life_path_number") or {}).get("number", 1)),
            "expression": get_interpretation("expression", (data.get("destiny_number") or {}).get("number", 1)),
            "soul_urge": get_interpretation("soul_urge", (data.get("soul_urge_number") or {}).get("number", 1)),
            "personality": get_interpretation("personality", (data.get("personality_number") or {}).get("number", 1)),
            "personal_year": get_interpretation("personal_year", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_year", 1)),
            "personal_month": get_interpretation("personal_month", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_month", 1)),
            "timing": get_interpretation("timing", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_year", 1)),
            "name_insight": get_interpretation("name_insight", (data.get("destiny_number") or {}).get("number", 1)),
            "lucky_elements": get_interpretation("lucky_elements", (data.get("life_path_number") or {}).get("number", 1))
        },
        "lucky_elements": get_interpretation("lucky_elements", (data.get("life_path_number") or {}).get("number", 1)),
        "personal_year": data["phillips_profile"]["life_cycles"]["personal_year"],
        "personal_month": data["phillips_profile"]["life_cycles"]["personal_month"]
    }

def format_rapidapi_response(data, name, year, month, day):
    """Format RapidAPI response to match our schema"""
    return {
        "life_path": (data.get("life_path") or {}).get("number", 1),
        "expression": (data.get("expression") or {}).get("number", 1),
        "soul_urge": (data.get("soul_urge") or {}).get("number", 1),
        "personality": (data.get("personality") or {}).get("number", 1),
        "birthday": day if day <= 9 else sum(int(d) for d in str(day)),
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}",
        "source": "rapidapi",
        "detailed_analysis": {
            "life_path": get_interpretation("life_path", (data.get("life_path") or {}).get("number", 1)),
            "expression": get_interpretation("expression", (data.get("expression") or {}).get("number", 1)),
            "soul_urge": get_interpretation("soul_urge", (data.get("soul_urge") or {}).get("number", 1)),
            "personality": get_interpretation("personality", (data.get("personality") or {}).get("number", 1)),
            "personal_year": get_interpretation("personal_year", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_year", 1)),
            "personal_month": get_interpretation("personal_month", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_month", 1)),
            "timing": get_interpretation("timing", data.get("phillips_profile", {}).get("life_cycles", {}).get("personal_year", 1)),
            "name_insight": get_interpretation("name_insight", (data.get("expression") or {}).get("number", 1)),
            "lucky_elements": get_interpretation("lucky_elements", (data.get("life_path") or {}).get("number", 1))
        },
        "lucky_elements": get_interpretation("lucky_elements", (data.get("life_path") or {}).get("number", 1)),
        "personal_year": data["phillips_profile"]["life_cycles"]["personal_year"],
        "personal_month": data["phillips_profile"]["life_cycles"]["personal_month"]
    }
