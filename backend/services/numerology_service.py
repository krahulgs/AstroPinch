"""
Numerology Service using External APIs
Integrates RapidAPI (Numerology API) and Roxy API for numerology calculations
With Phillips Numerology Model as comprehensive fallback
"""
import os
import json
import requests
from services.phillips_numerology import get_complete_numerology_profile
from services.phillips_interpretations import get_interpretation, get_karmic_lesson_interpretation
from services.hilary_numerology_service import HilaryNumerologyService
from services.loshu_service import LoshuService

from groq import Groq
import google.generativeai as genai

# API Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
RAPIDAPI_HOST = "numerology-api4.p.rapidapi.com"

ROXY_API_KEY = os.getenv("ROXY_API_KEY", "")
ROXY_API_BASE = "https://roxyapi.com/api/v1"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

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

        lang_instruction = "Respond in conversational Hindi (Hinglish style) using Devanagari script. Use English words for technical terms (e.g., Career, Finance) to make it easy to understand. Avoid complex Hindi/Sanskrit." if lang == "hi" else "Respond in English."
        
        prompt = f"""
        Act as a highly experienced Astrologer and Numerologist working for AstroPinch Astrology Portal.
        Your role is to give clear, honest, and straightforward predictions without hiding or softening important truths.

        STRICT RULES:
        - Use simple, plain language that is easy for non-experts to understand.
        - Avoid complicated words, technical jargon, or confusing sentences.
        - Be direct and transparent. Do not hide negative results (challenges, delays, losses, risks).
        - Give practical guidance along with predictions.
        - Mention important planetary positions, doshas, numbers, or cycles in simple words.
        - Focus on: Career & Business, Money & Finance, Marriage & Relationships, Health, Education, Property & Travel.
        - Tone: Honest, Calm, Supportive, Professional. No drama. No sugarcoating.
        - Format: Use short paragraphs or bullet points for easy reading.

        PROFILE ANALYSIS:
        Name: {name}
        Birth Date: {birth_date_str}
        {ctx_str}
        Life Path Number: {numerology_data.get('life_path')}
        Mulank: {loshu_data.get('mulank') if loshu_data else 'Unknown'}
        Bhagyank: {loshu_data.get('bhagyank') if loshu_data else 'Unknown'}
        
        Traits/Strengths: {numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('strength')}
        Challenges: {numerology_data.get('detailed_analysis', {}).get('life_path', {}).get('caution')}
        
        Vedic Context:
        Nakshatra: {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Unknown'}
        Current Dasha: {dasha_lord}
        
        Western Context:
        Sun Sign: {western_data.get('sun_sign') if western_data else 'Unknown'}
        Ascendant: {western_data.get('ascendant') if western_data else 'Unknown'}

        Loshu Context:
        Missing Numbers: {', '.join(map(str, loshu_data.get('missing_numbers', []))) if loshu_data else 'None'}
        Suggested Remedies: {loshu_data.get('remedies', {}) if loshu_data else 'None'}
        
        RESPONSE STRUCTURE (Follow exactly):
        Start with a short summary: 
        "Based on your birth details and numerology, this is your honest reading." (Translate this intro to the target language)

        Then follow this format:
        1. Current Phase
        Explain what is happening now (Personal Year/Dasha context).

        2. Future Prediction (6–12 Months)
        Explain upcoming events clearly.

        3. Positive Points
        What will work in favor.

        4. Challenges & Warnings
        What may go wrong and why. Be honest.

        5. Remedies & Advice
        Simple, practical solutions.

        6. Lucky Factors
        Lucky dates, numbers, colors.

        Other Rules:
        - Never give fake hope.
        - Never exaggerate.
        - Never copy generic horoscope content.
        - Every answer must feel personal and sincere.

        {age_filter}
        
        IMPORTANT: {lang_instruction}
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
        print(f"Groq API Error in generate_ai_insights: {e}. Trying Gemini Fallback...")
        if GEMINI_API_KEY:
            try:
                # Use verified model from user's system
                model = genai.GenerativeModel('gemini-2.0-flash')
                gem_response = model.generate_content(prompt)
                return gem_response.text
            except Exception as ge:
                print(f"Gemini Fallback Error: {ge}. Trying gemini-2.5-flash...")
                try:
                    model = genai.GenerativeModel('gemini-2.5-flash')
                    gem_response = model.generate_content(prompt)
                    return gem_response.text
                except:
                    pass
        
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

def generate_hindi_numerology_details(numerology_data, context=None):
    """
    Generates structured Hindi (Hinglish) translations for specific numerology sections.
    """
    if not GROQ_API_KEY:
        return None

    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        # Prepare data for prompt - focus on core numbers and cycles
        input_data = {
            "life_path": numerology_data.get("life_path"),
            "expression": numerology_data.get("expression"),
            "soul_urge": numerology_data.get("soul_urge"),
            "personality": numerology_data.get("personality"),
            "personal_year": numerology_data.get("personal_year"),
            "personal_month": numerology_data.get("personal_month"),
        }
        
        system_msg = "You are a highly experienced Astrologer and Numerologist. Your role is to give clear, honest, and straightforward predictions without sugarcoating. Convert the following Numerology profile into conversational Hindi (Hinglish) using Devanagari script, but English for technical terms."
        
        user_msg = f"""
        Please provide a JSON object with the following structure, filled with Hinglish content for the given numbers.
        The content should be a direct translation/adaptation of standard numerology interpretations for these specific numbers.
        
        {{
            "life_path": {{ "text": "...", "strength": "...", "caution": "..." }},
            "expression": {{ "text": "...", "strength": "...", "caution": "..." }},
            "soul_urge": {{ "text": "...", "strength": "...", "caution": "..." }},
            "personality": {{ "text": "...", "strength": "...", "caution": "..." }},
            "personal_year": {{ "title": "...", "theme": "...", "start": "...", "focus": "...", "avoid": "..." }},
            "personal_month": {{ "title": "...", "theme": "...", "start": "...", "focus": "...", "avoid": "..." }},
            "timing": {{ "best_activities": "...", "job_change": "...", "business": "...", "investment": "...", "warning": "..." }},
            "name_insight": {{ "career": "...", "relationship": "...", "stability": "...", "suggestion": "..." }},
            "lucky_elements": {{ "numbers": ["..."], "dates": "...", "colors": "...", "days": "...", "gemstone": "..." }}
        }}

        Input Numbers: {json.dumps(input_data)}
        
        Keep descriptions concise, honest, and direct. Do not sugarcoat challenges.
        Respond with ONLY the JSON object.
        """
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=2000,
        )
        
        response_content = chat_completion.choices[0].message.content
        
        # Extract JSON
        json_start = response_content.find('{')
        json_end = response_content.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            json_str = response_content[json_start:json_end]
            return json.loads(json_str)
        else:
            print("Failed to parse JSON from Hindi Numerology response")
            return None

    except Exception as e:
        print(f"Error generating Hindi numerology details: {e}")
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

def generate_health_insights(name, birth_date_str, numerology_data, loshu_data=None, vedic_data=None, western_data=None, context=None, lang="en"):
    """
    Generate detailed Honest Health Analysis (10-point structure).
    """
    if not GROQ_API_KEY:
        return None
        
    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        # Safe Dasha Extraction
        dasha_lord = "Unknown"
        if vedic_data:
            d_data = vedic_data.get('dasha')
            if isinstance(d_data, dict):
                dasha_lord = f"{d_data.get('active_mahadasha', 'Unknown')} - {d_data.get('active_antardasha', 'Unknown')}"
            elif isinstance(d_data, list) and d_data:
                dasha_lord = d_data[0].get('planet', 'Unknown')

        # Age Calculation for Relevance
        from datetime import datetime
        try:
            birth_date = datetime.strptime(birth_date_str, "%Y-%m-%d")
            today = datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        except:
            age = None
            
        # Context String
        ctx_str = ""
        if context:
            p = context.get('profession')
            m = context.get('marital_status')
            if p: ctx_str += f"Profession: {p}\n"
            if m: ctx_str += f"Marital Status: {m}\n"

        lang_instruction = "Respond in conversational Hindi (Hinglish style) using Devanagari script for the main analysis, but English headers." if lang == "hi" else "Respond in English."
        
        prompt = f"""
        Act as a highly experienced Astrologer and Numerologist working for Astropinch Astrology Portal.
        Your task is to give a clear, honest, and detailed health analysis based on astrology and numerology.

        Input Profile:
        Name: {name}
        Age: {age}
        Numerology: Life Path {numerology_data.get('life_path')}, Expression {numerology_data.get('expression')}, Personal Year {numerology_data.get('personal_year')}
        Vedic Context: Dasha {dasha_lord}, Nakshatra {vedic_data.get('panchang', {}).get('nakshatra', {}).get('name') if vedic_data else 'Unknown'}
        Loshu Grid Missing: {', '.join(map(str, loshu_data.get('missing_numbers', []))) if loshu_data else 'None'}
        {ctx_str}
        
        ⚠️ Important Rules
        - Be direct and transparent.
        - Do not give medical diagnosis.
        - Clearly mention risks if visible.
        - Give practical advice.
        - Always combine Astrology + Numerology.
        - Keep language simple for non-English speakers.
        - Tone: Straightforward, Non-judgmental, Objective, Professional. No sugarcoating or lecturing. Just clear indications.

        📌 Structure of the Health Reading (Follow EXACTLY):

        Start with:
        "Based on your birth chart and numerology, this is your honest health analysis." (Translate if needed)

        1️⃣ Current Health Phase
        Explain current planetary influence affecting health (Dasha/Personal Year).
        Mention energy level (low / average / strong).
        Is this a stable period or sensitive period?

        2️⃣ Physical Health Analysis
        Mention body areas clearly:
        - Head & Mental stress
        - Heart & Blood pressure
        - Stomach & Digestion
        - Bones & Joints
        - Skin & Allergies
        Be specific and practical.

        3️⃣ Mental & Emotional Health
        Explain: Stress level, Anxiety risk, Overthinking pattern, Sleep quality.
        Be honest if mental pressure is high.

        4️⃣ Numerology Health Impact
        Include: Life Path Number health tendency, Birth Date impact, Personal Year Number effect.

        5️⃣ Risk Periods (Next 6–12 Months)
        Mention sensitive months and transit impacts.
        Clearly say when health needs attention.

        6️⃣ Long-Term Health Pattern
        Is this temporary, lifestyle-related, or recurring? Be honest.

        7️⃣ Lifestyle Observations
        Identify work stress, sleep habits, and food patterns. Provide clear, straightforward indications.

        8️⃣ Practical Advice
        Diet, Exercise, Yoga, Meditation, Routine.

        9️⃣ Remedies (If Needed)
        Mantras, Color suggestions, etc.

        🔟 Health Risk Indicator
        End with:
        Health Status Level: [Green/Yellow/Red Circle] Stable / Needs Attention / High Risk Period
        Add 2–3 line summary explaining the level.

        IMPORTANT: {lang_instruction}
        """
        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.6 
        )
        return response.choices[0].message.content
        
    except Exception as e:
        error_msg = str(e)
        print(f"Health Analysis Error: {error_msg}. Trying Gemini Fallback...")
        
        # Gemini Fallback if Groq fails
        if GEMINI_API_KEY:
            try:
                # Use verified model from user's system
                model = genai.GenerativeModel('gemini-2.0-flash')
                gem_response = model.generate_content(prompt)
                return gem_response.text
            except Exception as ge:
                print(f"Gemini Health Fallback Error: {ge}. Trying gemini-2.5-flash...")
                try:
                    model = genai.GenerativeModel('gemini-2.5-flash')
                    gem_response = model.generate_content(prompt)
                    return gem_response.text
                except:
                    pass

        if "rate_limit_exceeded" in error_msg.lower():
            return "Error: AI Rate Limit Reached. The Honest Astrologer is currently busy with other consultations. Please try again in 1-2 minutes."
        if "authentication" in error_msg.lower() or "api_key" in error_msg.lower():
            return "Error: AI Authentication Failed. Please check if your GROQ_API_KEY is valid."
        return f"Error: The AI encountered an issue generating your report ({error_msg[:50]}...). Please try again."

def get_numerology_data(name, year, month, day, vedic_data=None, western_data=None, context=None, lang="en", gender="male", include_health=False):
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
        ai_future = executor.submit(
            generate_ai_insights,
            name, f"{year}-{month:02d}-{day:02d}", data,
            loshu_data=loshu_data, vedic_data=vedic_data, 
            western_data=western_data, context=context, lang=lang
        )
        
        health_future = None
        if include_health:
            health_future = executor.submit(
                generate_health_insights,
                name, f"{year}-{month:02d}-{day:02d}", data,
                loshu_data=loshu_data, vedic_data=vedic_data, 
                western_data=western_data, context=context, lang=lang
            )
        
        hindi_details_future = None
        if lang == "hi" and GROQ_API_KEY:
             hindi_details_future = executor.submit(generate_hindi_numerology_details, data, context)
        
        ai_insights = ai_future.result()
        
        if hindi_details_future:
            hindi_details = hindi_details_future.result()
            if hindi_details:
                if "detailed_analysis" not in data:
                    data["detailed_analysis"] = {}
                
                # Update detailed analysis with Hindi content
                for key, value in hindi_details.items():
                    if value and isinstance(value, dict):
                        data["detailed_analysis"][key] = value
                        
                        # Special handling for lucky_elements to update top-level key for frontend
                        if key == "lucky_elements":
                            data["lucky_elements"] = value

        if ai_insights:
            data["ai_insights"] = ai_insights
            data["source"] = "groq-ai"
            data["ai_model"] = "llama-3.3-70b-versatile"

        if health_future:
            health_analysis = health_future.result()
            if health_analysis:
                data["health_analysis"] = health_analysis

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
