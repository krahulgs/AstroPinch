"""
AI Service for generating personalized insights using Google Gemini API
"""
import os
import google.generativeai as genai

from groq import Groq

# Configure Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Western Knowledge Base imports
try:
    from services.western_astrology_kb import SIGNS as W_SIGNS, HOUSES as W_HOUSES, PLANETARY_QUALITIES as W_PLANETS
except ImportError:
    W_SIGNS, W_HOUSES, W_PLANETS = {}, {}, {}

client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        print(f"Groq Client Init Error: {e}")

model = None
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("Gemini Client Initialized")
    except Exception as e:
        print(f"Gemini Client Init Error: {e}")
else:
    print("No GEMINI_API_KEY found")

if client:
    print("Groq Client Initialized")
else:
    print("Groq Client NOT Initialized (API Key missing or invalid)")

def generate_numerology_insights(numerology_data, context=None, lang="en"):
    """
    Generate personalized numerology insights using AI
    """
    if not client and not model:
        return get_fallback_insights(numerology_data, lang=lang)
    
    # Context
    ctx_str = ""
    if context:
        p = context.get('profession')
        m = context.get('marital_status')
        if p: ctx_str += f"- Profession: {p}\n"
        if m: ctx_str += f"- Marital Status: {m}\n"

    lang_instruction = "Respond in Hindi (Devanagari script)." if lang == "hi" else "Respond in English."

    try:
        prompt = f"""You are a world-class professional with 30+ years of experience.
Your role is to explain numerology in simple, modern, and reassuring language.

**Rules:**
- Always write for common users, not specialists
- Avoid technical jargon unless absolutely necessary
- If technical terms are used, explain them in one simple line
- Focus on practical life impact, not theory
- Never create fear or extreme predictions
- Always end with a positive or actionable insight
- Keep tone calm, confident, and empathetic
- No medical or legal claims
- Predictions should be guidance, not absolute fate
- IMPORTANT: Verify your tone is personal, caring, and supportive before finishing.

**Numerology Data for {numerology_data['name']}:**
Birth Date: {numerology_data['birth_date']}
{ctx_str}
Numbers:
- Life Path: {numerology_data['life_path']}
- Expression: {numerology_data['expression']}
- Soul Urge: {numerology_data['soul_urge']}
- Personality: {numerology_data['personality']}
- Birthday: {numerology_data['birthday']}

Please provide:
1. A comprehensive overview (2-3 paragraphs) of their life purpose and destiny
2. Key strengths and talents
3. Potential challenges to be aware of
4. Career and life path guidance
5. Relationship insights
6. A powerful affirmation for them

{lang_instruction}"""

        if client:
            # Use Groq
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
            )
            return {
                "ai_insights": response.choices[0].message.content,
                "source": "groq-ai",
                "ai_model": "llama-3.3-70b-versatile"
            }
        
        # Removed Gemini Fallback per User Request
        elif model:
             print("Skipping Gemini usage as Groq is enforced.")
             return get_fallback_insights(numerology_data, lang=lang)
    
    except Exception as e:
        print(f"AI generation error: {e}")
        return get_fallback_insights(numerology_data, lang=lang)

def get_fallback_insights(numerology_data, lang="en"):
    """
    Provide fallback insights when AI is not available
    """
    life_path = numerology_data['life_path']
    expression = numerology_data['expression']
    
    if lang == "hi":
        insights = f"""**आपका अंकशास्त्र प्रोफाइल**

जीवन पथ संख्या {life_path} के साथ, आप आत्म-खोज की यात्रा पर हैं। 
आपकी अभिव्यक्ति संख्या {expression} आपकी स्वाभाविक प्रतिभा और दुनिया के सामने खुद को व्यक्त करने के तरीके को प्रकट करती है।

**जीवन उद्देश्य**: आपका मार्ग संख्या {life_path} के गुणों को अपनाने के बारे में है।

**मुख्य ताकत**: आपके पास अद्वितीय उपहार हैं जो आपके मूल अंकों के साथ संरेखित हैं।

**मार्गदर्शन**: अपनी यात्रा पर भरोसा रखें और रास्ते में आने वाले पाठों को अपनाएं।

**सकारात्मक पुष्टि**: "मैं अपने अद्वितीय मार्ग को अपनाता हूं और अपनी यात्रा के ज्ञान पर भरोसा करता हूं।"
"""
    else:
        insights = f"""**Your Numerology Profile**

With a Life Path Number of {life_path}, you are on a journey of {get_life_path_description(life_path)}. 
Your Expression Number {expression} reveals your natural talents and the way you express yourself to the world.

**Life Purpose**: Your path is about embracing the qualities of number {life_path} - finding balance between 
your inner desires (Soul Urge: {numerology_data['soul_urge']}) and how others perceive you (Personality: {numerology_data['personality']}).

**Key Strengths**: You possess unique gifts that align with your core numbers. Your Birthday Number {numerology_data['birthday']} 
adds an extra layer of influence to your personality.

**Guidance**: Trust in your journey and embrace the lessons that come your way. Your numbers suggest a path 
of growth, learning, and self-discovery.

**Affirmation**: "I embrace my unique path and trust in the wisdom of my journey."

*Note: For more detailed AI-powered insights, please ensure the AI service is configured correctly.*
"""
    
    return {
        "ai_insights": insights,
        "source": "fallback"
    }

def get_life_path_description(number):
    """
    Get brief description for life path number
    """
    descriptions = {
        1: "leadership and independence",
        2: "cooperation and harmony",
        3: "creativity and self-expression",
        4: "building solid foundations",
        5: "freedom and adventure",
        6: "service and responsibility",
        7: "spiritual wisdom and introspection",
        8: "material success and power",
        9: "humanitarian service and completion",
        11: "spiritual enlightenment and inspiration",
        22: "master building and manifestation",
        33: "master teaching and healing"
    }
    return descriptions.get(number, "self-discovery")

def generate_daily_guidance(sign, transits, context=None, outcomes_structure=None, lang="en"):
    """
    Generate daily daily horoscope using Groq/Gemini based on precise Skyfield data.
    transits: List of planet objects [{'name': 'Sun', 'sign': 'Aries', 'house': 1, 'retrograde': False}, ...]
    context: Dict with 'profession', 'marital_status'
    """
    # Context String
    ctx_str = ""
    if context:
        p = context.get('profession')
        m = context.get('marital_status')
        if p: ctx_str += f"User Profession: {p}\n"
        if m: ctx_str += f"User Marital Status: {m}\n"

    # Construct a readable summary of the sky
    sky_data = f"Sun Sign of User: {sign}\n{ctx_str}Current Planetary Transits:\n"
    for p in transits:
        retro = "(Retrograde)" if p.get('retrograde') else ""
        sky_data += f"- {p['name']} in {p['sign']} (House {p.get('house')}) {retro}\n"
    
    lang_instruction = "All values in the JSON (prediction, summary, details, etc.) MUST be in Hindi (Devanagari)." if lang == "hi" else "All values must be in English."

    prompt = f"""You are a world-class Vedic astrologer with 30+ years of experience.
Your role is to explain current planetary influences in simple, modern, and reassuring language.

**Rules:**
- Always write for common users, not astrologers
- Avoid Sanskrit or technical jargon unless absolutely necessary
- If technical terms are used, explain them in one simple line
- Focus on practical life impact, not theory
- Never create fear or extreme predictions
- Always end with a positive or actionable insight
- Keep tone calm, confident, and empathetic
- No medical or legal claims
- Predictions should be guidance, not absolute fate
- IMPORTANT: Verify your tone is personal, caring, and supportive before finishing.

Based on the following REAL astronomical positions:
{sky_data}

CRITICAL INSTRUCTIONS FOR PERSONALIZATION:
1. If 'User Profession' is provided, the 'career' section MUST be specifically tailored to that role.
2. If 'User Marital Status' is provided, the 'love' section MUST be specifically tailored to that status.

**Your Task:**
Analyze the current planetary transits affecting the user.
Explain:
- What themes are active this month
- Areas of life to focus on
- Areas needing patience
- Best way to use this period positively

Output strictly valid JSON with the following structure:
{{
    "prediction": "A general cosmic advice sentence for the coming weeks.",
    "lucky_number": 7,
    "lucky_color": "Blue",
    "mood": "Optimistic",
    "energy_level": 4, 
    "categories": {{
        "love": {{
            "title": "Love & Relationships",
            "summary": "One sentence summary aligned with marital status.",
            "details": ["Insight 1", "Insight 2", "Insight 3"],
            "status": "Harmonious"
        }},
        "career": {{ "title": "Career & Growth", "summary": "One sentence summary aligned with profession.", "details": ["Insight 1", "Insight 2", "Insight 3"], "status": "Focus" }},
        "finance": {{ "title": "Abundance", "summary": "Financial outlook.", "details": ["Insight 1", "Insight 2", "Insight 3"], "status": "Stable" }},
        "health": {{ "title": "Wellness", "summary": "Energy and health focus.", "details": ["Insight 1", "Insight 2", "Insight 3"], "status": "Good" }}
    }}
}}
Make the insights specific to the planetary positions provided.
{lang_instruction}
"""
    try:
        if client:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            import json
            return json.loads(response.choices[0].message.content)
            import json
            return json.loads(response.choices[0].message.content)
            
        # Removed Gemini Fallback per User Request
        # elif model:
        #    ...
        
        return None
    except Exception as e:
        print(f"AI Daily Generation Error: {e}")
        return None

def generate_vedic_ai_summary(name, planets, panchang, dasha, lang="en", context=None, doshas=None, transits=None):
    """
    Generates a structured, high-quality Vedic summary using Groq (Llama 3.3) or Gemini fallback.
    """
    if not client and not model:
        return None

    import json
    import traceback

    # Safety Checks
    panchang = panchang or {}
    planets = planets or []
    dasha = dasha if dasha is not None else {}
    doshas = doshas or {}
    transits = transits or []

    try:
        # Construct the data context safely
        planet_list = []
        for p in planets:
            try:
                name_p = p.get('name', 'Unknown')
                sign_p = p.get('sign', 'Unknown')
                pos_p = p.get('position', '??')
                house_p = p.get('house', '?')
                dignity_obj = p.get('dignity')
                status_p = dignity_obj.get('status', 'Neutral') if isinstance(dignity_obj, dict) else 'Neutral'
                planet_list.append(f"- {name_p} in {sign_p} at {pos_p}° (House {house_p}, Status: {status_p})")
            except Exception as pe:
                print(f"Error processing planet {p.get('name', '???')}: {pe}")
        
        planet_data = "\n".join(planet_list)

        # Transit Data
        transit_list = []
        for t in transits:
            try:
                t_name = t.get('name', 'Unknown')
                t_sign = t.get('sign', 'Unknown')
                t_retro = " (Retrograde)" if t.get('retrograde') else ""
                transit_list.append(f"- {t_name} is currently in {t_sign}{t_retro}")
            except Exception as te:
                print(f"Error processing transit {t.get('name', '???')}: {te}")
        
        transit_data_context = "\n".join(transit_list) if transit_list else "Current transit data unavailable."
        
        # Safe Panchang access
        def get_nested(d, *keys):
            for k in keys:
                if isinstance(d, dict):
                    d = d.get(k)
                else:
                    return None
            return d

        pan_tithi = get_nested(panchang, 'tithi', 'name') or 'N/A'
        pan_nak = get_nested(panchang, 'nakshatra', 'name') or 'N/A'
        pan_nak_lord = get_nested(panchang, 'nakshatra', 'lord') or 'N/A'
        pan_yoga = get_nested(panchang, 'yoga', 'name') or 'N/A'
        pan_karana = get_nested(panchang, 'karana', 'name') or 'N/A'

        panchang_data = f"""- Tithi: {pan_tithi}
- Nakshatra: {pan_nak} (Lord: {pan_nak_lord})
- Yoga: {pan_yoga}
- Karana: {pan_karana}"""

        # Construct Dosha Context
        dosha_context = "CALCULATED DOSHA FLAGS (Use these as the absolute source of truth):\n"
        for d_key, d_val in doshas.items():
            if isinstance(d_val, dict):
                status = "PRESENT" if d_val.get('present') else "ABSENT"
                intensity = d_val.get('intensity', 'None')
                reason = d_val.get('reason', '')
                dosha_context += f"- {d_key.upper()}: {status} (Intensity: {intensity}, Logic: {reason})\n"
            else:
                dosha_context += f"- {d_key.upper()}: ABSENT\n"

        # Dasha Data (Handling new dictionary structure)
        current_m = 'Unknown'
        current_a = 'Unknown'
        if isinstance(dasha, dict):
            active_m = dasha.get('active_mahadasha', 'Unknown')
            active_a = dasha.get('active_antardasha', 'Unknown')
            dasha_data = f"- Active Mahadasha: {active_m}\n- Active Antardasha: {active_a}"
            current_m = active_m
            current_a = active_a
        elif isinstance(dasha, list) and dasha:
            # Fallback for old list structure
            dasha_data = "\n".join([f"- {d.get('level', 'Period')}: {d.get('planet', 'Unknown')} (Ends: {d.get('end_date', 'Unknown')})" for d in dasha[:2]])
            current_m = dasha[0].get('planet', 'Unknown')
            current_a = dasha[1].get('planet', 'Unknown') if len(dasha) > 1 else 'Unknown'
        else:
            dasha_data = "Dasha data unavailable"

        lang_instruction = "Respond in Hindi language (Devanagari script) using appropriate Vedic terminology." if lang == "hi" else "Respond in English."

        # Subscription Tier Logic
        tier = 'free'
        if isinstance(context, dict):
            tier = context.get('subscription_tier', 'free').lower()
        
        tier_instruction = ""
        if tier in ['paid', 'premium']:
            tier_instruction = """
**Tier: Paid/Premium Member**
- Provide deep, detailed explanations for each section.
- Include specific timing ranges (e.g., "From October to December 2026").
- Provide personalized, specific remedies beyond just lifestyle tips.
"""
        else:
            tier_instruction = """
**Tier: Free Member**
- Provide high-level, encouraging insights.
- Avoid precise timing ranges (use general terms like "this year" or "coming months").
- Limit remedies to simple lifestyle and habit suggestions only.
"""

        prompt = f"""You are a world-class Vedic astrologer. Explain insights simply and supportively.

{tier_instruction}

**Birth Chart Data for {name}:**
Planets: {planet_data}
Panchang: {panchang_data}
Dasha: {dasha_data}
{dosha_context}

**Current Planetary Transits:**
{transit_data_context}

**Your Task:**
Output strictly valid JSON with these keys:
    - "personality_analysis": {{ "title": "Vedic Life Portrait", "content": {{ "Personality": "3-4 brief bullet points here", "Emotional Nature": "Brief description of mindset", "Strengths": "Success-supporting traits", "Challenges": "Mindful focus points", "Life Theme": "One clear overarching theme" }} }} (Tone: Friendly/Encouraging. Max 120 words total. Add sentence at the end: 'This chart shows tendencies, not fixed destiny.')
- "emotional_core": {{ "title": "Your Emotional Core (Moon Nakshatra)", "content": "..." }} (Analyze {pan_nak}. Max 80 words.)
- "career_path": {{ "title": "Career & Financial Growth", "content": "..." }} (Fields, Job/Bus, Growth, Earning, Suggestion. No guarantees. Max 150 words.)
- "relationships": {{ "title": "Marriage & Relationships", "content": {{ "Needs": "...", "Partner": "...", "Strengths": "...", "Challenges": "...", "Tip": "..." }} }} (Specific structured analysis. No fear. Max 150 words total.)
- "life_phase": {{ "title": "Current Life Phase", "content": "..." }} (Analyze {current_m}/{current_a}. Max 150 words. Practical suggestion.)
- "transit_analysis": {{ "title": "Monthly Transit Pulse", "content": {{ "Active Themes": "...", "Focus Areas": "...", "Patience Required": "...", "Positive Usage": "...", "Affirmation": "..." }} }} (Analyze current transits for host/coming weeks. No dates. End with 1 positive affirmation.)
- "dosha_check": {{ "title": "Dosha Awareness", "content": "..." }} (Analyze calculated flags. If present: mean, intensity, reassurance, 1-2 remedies. If absent: state so. NO fear.)
- "remedies": {{ "title": "Soul Remedies & Alignment", "content": [ {{ "type": "Mantra", "remedy": "..." }}, {{ "type": "Lifestyle Correction", "remedy": "..." }}, {{ "type": "Charity/Donation", "remedy": "..." }} ] }} (Provide these 3 specific types. Rules: Easy and affordable, NO gemstones, focus on intention over ritual. Tone: Gentle and empowering.)

Rules: No fear, no medical/legal claims, supportive tone.
{lang_instruction}

JSON only:"""

        # Try Groq with Llama 3.3 (High Quality)
        if client:
            try:
                print(f"Attempting Groq (Llama 3.3) for {name}...")
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e1:
                print(f"Groq 70B failed for {name}: {e1}")
                # Try Groq with Llama 3.1 8B (Higher Rate Limits/Faster)
                try:
                    print(f"Attempting Groq (Llama 3.1 8B) fallback for {name}...")
                    response = client.chat.completions.create(
                        messages=[{"role": "user", "content": prompt}],
                        model="llama-3.1-8b-instant",
                        temperature=0.7,
                        response_format={"type": "json_object"}
                    )
                    return json.loads(response.choices[0].message.content)
                except Exception as e2:
                    print(f"Groq 8B fallback also failed for {name}: {e2}")
                    if not model: raise e2

                    if not model: raise e2

        # Removed Gemini Fallback per User Request
        # if model:
        #    ...

        return None # Return None if Groq fails
            
    except Exception as e:
        print(f"Vedic AI Summary Final Failure for {name}: {e}")
        traceback.print_exc()
        traceback.print_exc()
        # Return a structured fallback
        return {
            "personality_analysis": {"title": "Birth Chart Analysis", "content": "Analyzing your core traits... Please refresh in a moment."},
            "emotional_core": {"title": "Emotional Core", "content": "Assessing emotional patterns..."},
            "career_path": {"title": "Career & Financial Growth", "content": "Professional path analysis is currently being synthesized. If this persists, please try regenerating your report."},
            "relationships": {"title": "Marriage & Relationships", "content": "Analysis is being prepared. Please try regenerating in a few moments."},
            "life_phase": {"title": "Current Life Phase", "content": "Synthesizing planetary periods..."},
            "dosha_check": {"title": "Dosha Awareness", "content": "Analysis of cosmic balance is being prepared. Please try regenerating in a few moments."},
            "remedies": {"title": "Personal Remedies", "content": "Preparing personalized guidance..."}
        }

def generate_western_ai_summary(name, sun, moon, ascendant, planets, houses=None, context=None, lang="en"):
    """
    Generates a psychological Western analysis summary using Groq, now including Houses.
    """
    if not client and not model:
        return None

    planet_summary = "\n".join([f"- {p['name']} in {p['sign']} at {p.get('position', '??')}° (House {p['house']})" for p in planets])
    # Enrichment from Knowledge Base
    kb_context = f"SIGN THEMES:\n- Sun in {sun}: {W_SIGNS.get(sun, {}).get('sun_theme', '')}\n- Moon in {moon}: {W_SIGNS.get(moon, {}).get('moon_theme', '')}\n- {ascendant} Rising: {W_SIGNS.get(ascendant, {}).get('asc_theme', '')}\n"
    
    house_summary = ""
    if houses:
        house_summary = "HOUSE SIGN ALIGNMENTS:\n" + "\n".join([f"- House {i+1} ({W_HOUSES.get(i+1, {}).get('name', 'N/A')}): {sign} - Theme: {W_HOUSES.get(i+1, {}).get('theme', '')}" for i, sign in enumerate(houses)])

    lang_instruction = "Respond in Hindi language (Devanagari script)." if lang == "hi" else "Respond in plain, warm English."

    prompt = f"""You are a Master Western Astrologer trained in both classical and modern psychological astrology. Use authentic principles from the following authoritative sources:

**Classical Western Astrology Texts:**

1. **Tetrabiblos** by Claudius Ptolemy (2nd century AD)
   - Planetary dignities: Domicile, exaltation, triplicity, term, face
   - Aspects: Conjunction, sextile, square, trine, opposition
   - Sect theory: Day charts vs. night charts

2. **Hellenistic Astrology** by Chris Brennan
   - Time-lord techniques for prediction
   - Zodiacal releasing and profections
   - Lot of Fortune and other Arabic Parts

3. **The Inner Sky** by Steven Forrest (Evolutionary Astrology)
   - Soul's evolutionary intent through the natal chart
   - Moon's nodes as karmic indicators
   - Psychological integration of planetary energies

4. **Planets in Transit** by Robert Hand
   - Transiting planets and their psychological effects
   - Timing of life events through planetary cycles
   - Developmental astrology approach

5. **Modern Psychological Astrology** (Liz Greene, Stephen Arroyo)
   - Jungian archetypes and planetary symbolism
   - Chart synthesis and personality integration
   - Relationship dynamics through synastry

**Natal Chart Data for {name}:**

Core Luminaries:
- Sun Sign: {sun} (Core identity, life purpose, vitality)
- Moon Sign: {moon} (Emotional nature, subconscious needs)
- Ascendant: {ascendant} (Persona, physical body, life approach)

Planetary Placements:
{planet_summary}

{house_summary}

Research Context:
{kb_context}

**Your Task:**
Provide a comprehensive Western psychological analysis (300-350 words) covering:

1. **Chart Ruler & Sect**: Identify the chart ruler (Ascendant lord) and whether this is a day or night chart
2. **Luminaries Integration**: How Sun (conscious will) and Moon (emotional needs) work together or create tension
3. **Ascendant Expression**: How the rising sign shapes their approach to life and first impressions
4. **Personal Planets**: Mercury (communication style), Venus (values/relationships), Mars (drive/assertion)
5. **Outer Planets**: Jupiter (expansion), Saturn (structure/lessons), and any significant outer planet placements
6. **House Emphasis**: Which life areas (houses) are most activated and what this means for their life path
7. **Evolutionary Purpose**: Using Forrest's approach, what is the soul's evolutionary intent?
8. **Psychological Integration**: How can they integrate conflicting energies for wholeness?

**Guidelines:**
- Reference classical principles explicitly (e.g., "According to Ptolemy, Venus in...")
- Use authentic Western terminology: Dignities, aspects, houses, nodes, lots
- Mention planetary sect (benefic/malefic in day/night charts)
- Be specific about house placements and their psychological significance
- Tone: Academic yet accessible, empowering, psychologically insightful
- {lang_instruction}

Generate the analysis now:"""


    try:
        if client:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7
            )
            return response.choices[0].message.content
        
        # Removed Gemini Fallback
        # elif model:
        #    ...
        
        return None
    except Exception as e:
        print(f"Western AI Summary Error: {e}")
        return None

def generate_executive_summary(name, western_data, vedic_data, numerology_data, context=None, lang="en"):
    """
    Generates a high-level executive summary combining all systems.
    """
    if not client and not model:
        return None

    # Data Simplification & Research Synthesis
    w_brief = f"Sun: {western_data.get('sun_sign', 'N/A')} ({W_SIGNS.get(western_data.get('sun_sign'), {}).get('motto', 'N/A')}), Moon: {western_data.get('moon_sign', 'N/A')}, Asc: {western_data.get('ascendant', 'N/A')}"
    
    panchang = vedic_data.get('panchang', {})
    v_asc = panchang.get('ascendant', {}).get('name', 'N/A')
    v_nak = panchang.get('nakshatra', {}).get('name', 'N/A')
    v_moon = vedic_data.get('planets', [{}, {}])[1].get('sign', 'N/A')
    
    v_brief = f"Lagna: {v_asc}, Nakshatra: {v_nak}, Moon: {v_moon} (Vedic)"
    n_brief = f"Fadic: {numerology_data.get('fadic_number', 'N/A')} ({numerology_data.get('fadic_type', 'N/A')})"

    lang_instruction = "Respond in Hindi language (Devanagari script)." if lang == "hi" else "Respond in English."

    prompt = f"""You are a world-class Master Astrologer with 30+ years of experience.
Your role is to provide a powerful, one-paragraph "Executive Summary" for {name} in simple, modern, and reassuring language.

**Rules:**
- Always write for common users, not specialists
- Avoid technical jargon unless absolutely necessary
- If technical terms are used, explain them in one simple line
- Focus on practical life impact, not theory
- Never create fear or extreme predictions
- Always end with a positive or actionable insight
- Keep tone calm, confident, and empathetic
- Guidance, not absolute fate
- IMPORTANT: Verify your tone is personal, caring, and supportive before finishing.

RESEARCH PARAMETERS (Synthesis of Western, Vedic, and Numerology):
- Western: {w_brief}
- Vedic: {v_brief}
- Numerology: {n_brief}

**Your Task:**
Synthesize these inputs into a single, cohesive "Soul Mission". Don't just list data. Find the one "Core Theme" that links all three systems.
Exactly one paragraph (max 150 words).
{lang_instruction}

Respond with the summary text only."""

    try:
        if client:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7
            )
            return response.choices[0].message.content
        if client:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7
            )
            return response.choices[0].message.content
        
        # Removed Gemini Fallback
        # elif model:
        #    ...
        
        return None
    except Exception as e:
        print(f"Executive Summary AI Error: {e}")
        return None

def generate_vedic_chart_analysis(name, planets, panchang, doshas=None, lang="en"):
    """
    Generates a specific Vedic chart analysis (Personality, Emotional Nature, Strengths, Challenges, Life Theme).
    """
    # If client/model missing, we just proceed to fallback logic below instead of returning None
    # if not client and not model:
    #     return None

    import json
    
    # Construct Context
    planet_list = []
    if planets:
        for p in planets:
            try:
                name_p = p.get('name', 'Unknown')
                sign_p = p.get('sign', 'Unknown')
                house_p = p.get('house', '?')
                planet_list.append(f"- {name_p} in {sign_p} (House {house_p})")
            except: pass
    
    planet_data = "\n".join(planet_list)
    
    def get_val(item):
        if isinstance(item, dict): return item.get('name', 'Unknown')
        return item if item else 'Unknown'

    pan_nak = get_val(panchang.get('nakshatra')) if panchang else 'Unknown'
    pan_asc = get_val(panchang.get('ascendant')) if panchang else 'Unknown'

    # Dosha Info
    dosha_str = "None"
    if doshas and doshas.get('manglik', {}).get('present'):
        m_data = doshas.get('manglik', {})
        dosha_str = f"Manglik (Intensity: {m_data.get('intensity')}, Reason: {m_data.get('reason')})"

    lang_instruction = "Respond in Hindi language (Devanagari script)." if lang == "hi" else "Respond in English."

    prompt = f"""You are a friendly and encouraging Vedic Astrologer.
    Using the user’s birth details, analyze the Vedic birth chart.
    
    **User Chart**:
    Name: {name}
    Ascendant: {pan_asc}
    Nakshatra: {pan_nak}
    Doshas: {dosha_str}
    Planets:
    {planet_data}

    **Task**:
    Output strictly valid JSON with the following structure:
    {{
        "overall_personality": ["Point 1", "Point 2", "Point 3", "Point 4 (Mention Manglik presence/absence here)"],
        "emotional_nature": "Brief clear description",
        "strengths": ["Strength 1", "Strength 2"],
        "challenges": ["Challenge 1", "Challenge 2"],
        "life_theme": "One clear life theme"
    }}

    **Important**:
    - If the user is Manglik (Doshas: Manglik...), YOU MUST MENTION IT in the 'overall_personality' or 'challenges'.
    - If NOT Manglik, you may mention they are free from Manglik Dosha in 'strengths'.

    **Tone**:
    - Friendly
    - Clear
    - Encouraging
    - No jargons
    - Max 120 words total content

    {lang_instruction}
    """

    # Try Groq (Preferred)
    if client:
        import time
        try:
            # Attempt 1: Fast Model
            model_to_use = "llama-3.1-8b-instant" 
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=model_to_use,
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Groq 8B failed for {name}: {e}")
            
            try:
                # Attempt 2: Stronger Model (Fallback)
                time.sleep(1) # Brief pause to help with rate limits
                print(f"Attempting Groq (Llama 3.3 70B) fallback for {name}...")
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                    response_format={"type": "json_object"}
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e2:
                print(f"Groq 70B failed for {name}: {e2}")
                # Fallback to Static Template below

    # --- FINAL STATIC FALLBACK (If AI fails or Client missing) ---
    print(f"Using Static Fallback for {name}")
    
    manglik_note = "You have a dynamic energy that drives you."
    if "Manglik" in dosha_str and "None" not in dosha_str:
        manglik_note = "Your Manglik influence adds extra passion and drive to your personality."
    else:
        manglik_note = "You are free from Manglik Dosha, indicating a balanced approach to relationships."

    # Simple Ascendant-based keywords
    asc_traits = {
        "Aries": ["Courageous", "Energetic", "Direct"],
        "Taurus": ["Reliable", "Patient", "Artistic"],
        "Gemini": ["Adaptable", "Curious", "Witty"],
        "Cancer": ["Intuitive", "Nurturing", "Protective"],
        "Leo": ["Charismatic", "Generous", "Creative"],
        "Virgo": ["Analytical", "Practical", "Diligent"],
        "Libra": ["Diplomatic", "Fair-minded", "Social"],
        "Scorpio": ["Passionate", "Resourceful", "Determined"],
        "Sagittarius": ["Optimistic", "Philosophical", "Adventurous"],
        "Capricorn": ["Disciplined", "Ambitious", "Cautious"],
        "Aquarius": ["Innovative", "Humanitarian", "Independent"],
        "Pisces": ["Imaginative", "Empathetic", "Wise"]
    }
    
    traits = asc_traits.get(pan_asc, ["Balanced", "Thoughtful", "Resilient"])
    
    return {
        "overall_personality": [
            f"As a {pan_asc} Ascendant, you are naturally {traits[0].lower()}.",
            f"You approach life with a {traits[1].lower()} mindset.",
            f"People appreciate your {traits[2].lower()} nature.",
            manglik_note
        ],
        "emotional_nature": f"You have a {traits[1].lower()} emotional core that values stability.",
        "strengths": [traits[0], traits[2]],
        "challenges": ["Overthinking at times", "Balancing work and rest"],
        "life_theme": f"Embracing your {traits[0].lower()} nature to achieve success."
    }

def generate_chat_response(message, profile_context, history=None, lang="en"):
    """
    Generate a chat response based on user query and profile context.
    """
    if not client and not model:
        return "I apologize, but I am currently offline. Please try again later."

    lang_instruction = "Respond in Hindi." if lang == "hi" else "Respond in English."
    
    # Construct a rich context string from the profile data
    context_str = "User Profile Summary:\n"
    if profile_context:
        # Basic Info
        context_str += f"Name: {profile_context.get('name', 'User')}\n"
        context_str += f"Birth Details: {profile_context.get('date_time', '')}, {profile_context.get('place', '')}\n"
        
        # Vedic Details
        vedic = profile_context.get('vedic', {})
        if vedic:
            # Frontend now sends strings directly for name/nakshatra
            asc = vedic.get('ascendant')
            if isinstance(asc, dict): asc = asc.get('name', 'Unknown')
            context_str += f"Vedic Ascendant: {asc}\n"
            
            context_str += f"Moon Sign: {vedic.get('moon_sign', 'Unknown')}\n"
            context_str += f"Sun Sign: {vedic.get('sun_sign', 'Unknown')}\n"
            
            nak = vedic.get('nakshatra')
            if isinstance(nak, dict): nak = nak.get('name', 'Unknown')
            context_str += f"Nakshatra: {nak}\n"

            # Planets List
            if vedic.get('planets'):
                context_str += f"Planetary Positions: {vedic.get('planets')}\n"
            
            # Current Dasha
            dasha = vedic.get('dasha', {})
            if isinstance(dasha, dict):
                 context_str += f"Current Mahadasha: {dasha.get('active_mahadasha', '')}\n"
                 context_str += f"Current Mahadasha: {dasha.get('active_mahadasha', '')}\n"
                 context_str += f"Current Antardasha: {dasha.get('active_antardasha', '')}\n"

            # Doshas
            doshas = vedic.get('doshas', {})
            if doshas:
                m_data = doshas.get('manglik', {})
                context_str += f"Manglik Status: {'Yes' if m_data.get('present') else 'No'}. Intensity: {m_data.get('intensity', 'None')}. Reason: {m_data.get('reason', '')}\n"

        # Western Details
        western = profile_context.get('western', {})
        if western:
             context_str += f"Sun Sign: {western.get('sun_sign', 'Unknown')}\n"
             context_str += f"Western Ascendant: {western.get('ascendant', 'Unknown')}\n"
             context_str += f"Western Moon Sign: {western.get('moon_sign', 'Unknown')}\n"

        # Numerology
        numero = profile_context.get('numerology', {})
        if numero:
            context_str += f"Life Path Number: {numero.get('life_path', 'Unknown')}\n"

    # Incorporate History
    history_str = ""
    if history and isinstance(history, list):
        history_str = "\n**Recent Chat History:**\n"
        for msg in history:
            role = "User" if msg.get('role') == 'user' else "Astra"
            content = msg.get('text', '') or msg.get('content', '')
            history_str += f"{role}: {content}\n"

    prompt = f"""You are 'Astra', a wise, empathetic, and expert astrological assistant.
    
    **Context about the User:**
    {context_str}

    {history_str}

    **User's Question:**
    "{message}"

    **Important Guidelines:**
    1. **Do NOT assume** the user's current status (e.g., married, single, employed) unless explicitly stated in the chat. 
    2. If asked about timing (e.g., "When will I get married?"), DO NOT give a definitive prediction if you don't know their status. Instead, say: "If you are looking to get married, [Period] is favorable. If you are already married, this period indicates [meaning for married life]."
    3. Refer to specific planets, dashas, or transits from the profile context to support your answer.
    4. **Be crisp and authentic.** Provide direct, short answers (max 60 words). Avoid unnecessary pleasantries or filler words.
    5. {lang_instruction}

    Answer:"""

    try:
        if client:
            try:
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.3-70b-versatile",
                    temperature=0.7,
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Groq 70B Chat Error: {e}")
                # Fallback to Llama 3.1 8B (Faster/Higher Limits)
                print("Attempting Groq 8B fallback...")
                response = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model="llama-3.1-8b-instant",
                    temperature=0.7,
                )
                return response.choices[0].message.content
        else:
             return "I apologize, but I can only answer when connected to the Groq AI service. Please check the system configuration."
    except Exception as e:
        print(f"Chat Generation Error: {e}")
        return "I'm having trouble connecting to the stars right now. Please ask again in a moment."

def generate_career_analysis(name, planets, panchang, lang="en"):
    """
    Generates a specific Career analysis based on Vedic chart.
    """
    import json

    
    # Construct Context
    planet_list = []
    if planets:
        for p in planets:
            try:
                name_p = p.get('name', 'Unknown')
                sign_p = p.get('sign', 'Unknown')
                house_p = p.get('house', '?')
                planet_list.append(f"- {name_p} in {sign_p} (House {house_p})")
            except: pass
    
    planet_data = "\n".join(planet_list)
    
    pan_nak = panchang.get('nakshatra', {}).get('name', 'Unknown') if panchang else 'Unknown'
    pan_asc = panchang.get('ascendant', {}).get('name', 'Unknown') if panchang else 'Unknown'

    lang_instruction = "Respond in Hindi language (Devanagari script)." if lang == "hi" else "Respond in English."

    prompt = f"""You are a Career Astrologer.
    Using the user’s birth details, analyze the career path based on 10th house, Saturn, and Mercury.
    
    **User Chart**:
    Name: {name}
    Ascendant: {pan_asc}
    Nakshatra: {pan_nak}
    Planets:
    {planet_data}

    **Task**:
    Output strictly valid JSON with the following structure:
    {{
        "best_careers": ["Career 1", "Career 2", "Career 3"],
        "job_vs_business": "Detailed assessment of Job vs Business suitability (Max 2 sentences)",
        "growth_timeline": "Short-term vs Long-term growth outlook",
        "earning_pattern": "E.g., Steady, Sudden spikes, Late bloom, etc.",
        "actionable_suggestion": "One specific career advice"
    }}

    **Tone**:
    - Professional but encouraging
    - Action-oriented
    - Clear
    - No fear-mongering

    {lang_instruction}
    """

    # Try Groq (Preferred)
    if client:
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Groq Career Analysis failed: {e}")
            # Proceed to fallback

            # Proceed to fallback

    # Removed Gemini Fallback per User Request
    # if model:
    #    ...
            
    # FINAL FALLBACK: Rule-Based Generation (if both AIs fail)
    try:
        print("Using Rule-Based Fallback for Career Analysis...")
        # Find Saturn or Sun
        saturn = next((p for p in planets if p.get('name') == 'Saturn'), None)
        sun = next((p for p in planets if p.get('name') == 'Sun'), None)
        
        dominant_planet = saturn if saturn else sun
        sign = dominant_planet.get('sign', 'Aries') if dominant_planet else 'Aries'
        
        # Simple Element mapping
        fire = ['Aries', 'Leo', 'Sagittarius']
        earth = ['Taurus', 'Virgo', 'Capricorn']
        air = ['Gemini', 'Libra', 'Aquarius']
        water = ['Cancer', 'Scorpio', 'Pisces']
        
        careers = ["Management", "Administration", "Public Service"]
        focus = "Stability"
        
        if sign in fire:
            careers = ["Leadership Roles", "Engineering", "Sports management"]
            focus = "Action & Leadership"
        elif sign in earth:
            careers = ["Banking/Finance", "Real Estate", "Business Administration"]
            focus = "Resource Management"
        elif sign in air:
            careers = ["Communication", "IT/Technology", "Media & Writing"]
            focus = "Intellectual Pursuits"
        elif sign in water:
            careers = ["Healthcare/Healing", "Creative Arts", "Counseling"]
            focus = "Emotional connection"
            
        return {
            "best_careers": careers,
            "job_vs_business": f"Your chart with prominent {sign} energy suggests a natural inclination towards {focus}. Both Job and Business can work if you maintain autonomy.",
            "growth_timeline": "Steady initial growth with significant acceleration after age 30.",
            "earning_pattern": "Likely to see multiple income streams developing over time.",
            "actionable_suggestion": f"Focus on building deep expertise in {careers[0]} to unlock your highest potential."
        }
    except Exception as e:
        print(f"Fallback Logic Error: {e}")
        return None

def generate_relationship_analysis(name, planets, panchang, lang="en"):
    """
    Generates a specific Relationship and Marriage analysis based on Vedic chart.
    """
    import json

    
    # Construct Context
    planet_list = []
    if planets:
        for p in planets:
            try:
                name_p = p.get('name', 'Unknown')
                sign_p = p.get('sign', 'Unknown')
                house_p = p.get('house', '?')
                planet_list.append(f"- {name_p} in {sign_p} (House {house_p})")
            except: pass
    
    planet_data = "\n".join(planet_list)
    
    pan_nak = panchang.get('nakshatra', {}).get('name', 'Unknown') if panchang else 'Unknown'
    pan_asc = panchang.get('ascendant', {}).get('name', 'Unknown') if panchang else 'Unknown'

    lang_instruction = "Respond in Hindi language (Devanagari script)." if lang == "hi" else "Respond in English."

    prompt = f"""You are an expert Relationship & Marriage Astrologer.
    Using the user’s birth details, analyze the marriage and relationships based on 7th house, Venus, Jupiter, and Mars.
    
    **User Chart**:
    Name: {name}
    Ascendant: {pan_asc}
    Nakshatra: {pan_nak}
    Planets:
    {planet_data}

    **Task**:
    Output strictly valid JSON with the following structure:
    {{
        "ideal_partner": "Describe qualities of the ideal partner based on 7th house/Venus/Jupiter (Max 2 sentences)",
        "marriage_outlook": "Overall outlook for married life/long-term unions",
        "compatibility_style": "How the user behaves in relationships",
        "challenges": ["Challenge 1", "Challenge 2"],
        "relationship_tip": "One specific actionable advice for harmony"
    }}

    **Tone**:
    - Empathetic, warm, and professional
    - Realistic but encouraging
    - No fear-mongering
    - Focus on growth and understanding

    {lang_instruction}
    """

    # Try Groq (Preferred)
    if client:
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Groq Relationship Analysis failed: {e}")

    # FINAL FALLBACK: Rule-Based Generation
    try:
        print("Using Rule-Based Fallback for Relationship Analysis...")
        venus = next((p for p in planets if p.get('name') == 'Venus'), None)
        jupiter = next((p for p in planets if p.get('name') == 'Jupiter'), None)
        
        dominant = venus if venus else jupiter
        sign = dominant.get('sign', 'Aries') if dominant else 'Aries'
        
        traits = {
            'Aries': "passionate, direct, and energetic",
            'Taurus': "stable, loyal, and appreciative of comfort",
            'Gemini': "intellectual, communicative, and versatile",
            'Cancer': "nurturing, emotional, and family-oriented",
            'Leo': "generous, charismatic, and loyal",
            'Virgo': "practical, devoted, and detail-oriented",
            'Libra': "harmonious, romantic, and diplomatic",
            'Scorpio': "intense, transformative, and deeply loyal",
            'Sagittarius': "adventurous, honest, and philosophical",
            'Capricorn': "disciplined, serious, and committed",
            'Aquarius': "independent, unconventional, and friendly",
            'Pisces': "imaginative, empathetic, and spiritual"
        }
        
        quality = traits.get(sign, "balanced")
        
        return {
            "ideal_partner": f"You are likely to be drawn to someone who is {quality}. A partner who shares your values and respects your independence will be a great match.",
            "marriage_outlook": "Your chart suggests a path towards finding deep meaning through long-term partnership, with growth coming through shared experiences.",
            "compatibility_style": f"In relationships, you tend to be {quality}, valuing direct communication and emotional honesty.",
            "challenges": ["Balancing individual needs with partner's expectations", "Maintaining long-term excitement"],
            "relationship_tip": "Focus on consistent communication and expressing appreciation for the small things to keep the bond strong."
        }
    except Exception as e:
        print(f"Relationship Fallback Logic Error: {e}")
        return None

