"""
Phillips Numerology Interpretations
Detailed meanings for all numbers based on Phillips methodology
"""

# Core Number Interpretations (Standard Traits)
STANDARD_TRAITS = {
    1: {
        "strength": "Unyielding leadership and self-reliance.",
        "caution": "Avoid being overly domineering or aggressive.",
        "life_path": "You are a pioneer meant to lead and innovate. Your journey involves mastering independence and initiating new projects.",
        "expression": "You work best when you have the freedom to lead. Your success comes from your ability to innovate and stand alone.",
        "soul_urge": "You have a deep inner desire to be number one and achieve complete independence and autonomy.",
        "personality": "Others see you as a strong, assertive leader who is capable of making tough decisions alone."
    },
    2: {
        "strength": "Natural diplomacy and intuitive cooperation.",
        "caution": "Be careful not to become overly dependent on others.",
        "life_path": "Your path is one of harmony and cooperation. You bring balance to environments through sensitivity and teamwork.",
        "expression": "You excel in supportive roles and partnerships. Success follows your ability to facilitate peace and detail-oriented work.",
        "soul_urge": "You crave emotional security, harmony, and a peaceful environment above all else.",
        "personality": "Others perceive you as a gentle, approachable, and highly sensitive individual who values relationships."
    },
    3: {
        "strength": "Vibrant creativity and expressive communication.",
        "caution": "Watch out for scattered energy or superficiality.",
        "life_path": "You are here to inspire through self-expression. Your theme centers on creativity, social joy, and artistic communication.",
        "expression": "Success comes through creative fields and public speaking. You work best in social, expressive environments.",
        "soul_urge": "Your heart longs for creative freedom and the ability to uplift others through your unique voice.",
        "personality": "Others see you as the 'life of the party'—charming, optimistic, and possessing an infectious creative spirit."
    },
    4: {
        "strength": "Rock-solid discipline and organizational skill.",
        "caution": "Avoid becoming overly rigid or predictable.",
        "life_path": "Your theme is stability and structure. You are the builder who creates lasting foundations through hard work and order.",
        "expression": "You work through method and system. Your success is built brick-by-brick through perseverance and extreme detail.",
        "soul_urge": "You desire order, security, and the feeling that everything in your life is solid and well-managed.",
        "personality": "Others see you as reliable, grounded, and the person they can always count on to get the job done right."
    },
    5: {
        "strength": "Dynamic versatility and adventurous spirit.",
        "caution": "Guard against restlessness and lack of focus.",
        "life_path": "Your life is a journey of freedom and change. You thrive on variety and teaching others how to be adaptable.",
        "expression": "You succeed in fast-paced jobs that involve travel or rapid change. You work best without strict constraints.",
        "soul_urge": "You seek constant stimulation and the freedom to explore every facet of life without boundaries.",
        "personality": "Others perceive you as exciting, magnetic, and always ready for the next big adventure."
    },
    6: {
        "strength": "Compassionate nurturing and deep responsibility.",
        "caution": "Avoid self-sacrifice to the point of exhaustion.",
        "life_path": "Your theme is service and harmony. Your path involves domestic responsibility and caring for the welfare of others.",
        "expression": "Success is found in service-oriented industries like teaching or healing. You work through empathy and care.",
        "soul_urge": "You are motivated by the desire to love, be loved, and create a beautiful, harmonious home.",
        "personality": "Others see you as a warm 'parental' figure—someone who is always there to help and provide comfort."
    },
    7: {
        "strength": "Profound intuition and analytical wisdom.",
        "caution": "Watch for tendencies toward isolation or skepticism.",
        "life_path": "You are on a spiritual and intellectual quest. Your theme is seeking truth through introspection and study.",
        "expression": "You succeed in technical, spiritual, or research fields. You work best in quiet, undisturbed environments.",
        "soul_urge": "Your deepest motivation is to find the hidden meaning of life and achieve inner perfection.",
        "personality": "Others perceive you as mysterious, intellectual, and perhaps a bit detached or eccentric."
    },
    8: {
        "strength": "Strategic power and material mastery.",
        "caution": "Beware of workaholism or ego-driven ambition.",
        "life_path": "Your path is one of authority and financial balance. You are here to learn how to manage power and resources effectively.",
        "expression": "You work on a large scale. Success comes through business management, finance, and large organizations.",
        "soul_urge": "You are driven by the desire for status, power, and the ability to manifest material wealth.",
        "personality": "Others see you as a practical, authoritative 'boss' figure who radiates competence and success."
    },
    9: {
        "strength": "Universal compassion and humanitarian vision.",
        "caution": "Avoid being overly emotional or impractical.",
        "life_path": "Your theme is global service and completion. You are a humanitarian here to teach the power of unconditional love.",
        "expression": "You succeed in fields that benefit humanity. You work best when your efforts serve a larger, noble purpose.",
        "soul_urge": "You are motivated by the need to help the world and leave a lasting, positive legacy behind.",
        "personality": "Others see you as a wise, selfless individual who is deeply concerned with the state of the world."
    },
    11: {
        "strength": "High-level intuition and visionary insight.",
        "caution": "Manage nervous tension and impractical expectations.",
        "life_path": "As a Master Number, your theme is spiritual illumination. You are meant to be a beacon of light and inspiration.",
        "expression": "Success comes through sharing high-level insights. You work through your magnetic, inspirational presence.",
        "soul_urge": "You crave spiritual truth and have a mission to enlighten others through your intuitive gifts.",
        "personality": "Others see you as an 'old soul'—someone who is incredibly bright, sensitive, and uniquely gifted."
    },
    22: {
        "strength": "Masterful manifestation and practical vision.",
        "caution": "Avoid feeling overwhelmed by your own ambitions.",
        "life_path": "Your path is to turn grand visions into concrete reality. You are the 'Master Builder' of systems that benefit many.",
        "expression": "You succeed in massive projects and global enterprises. You work by combining vision with extreme practicality.",
        "soul_urge": "You are motivated by the desire to create something of lasting importance that changes the world.",
        "personality": "People see you as extraordinarily capable and disciplined—a person of immense potential and power."
    },
    33: {
        "strength": "Selfless service and spiritual guidance.",
        "caution": "Don't let the weight of others' problems bury you.",
        "life_path": "Your theme is the 'Master Teacher.' You are here to raise the consciousness of others through love and guidance.",
        "expression": "You succeed in spiritual leadership or altruistic work. You work through pure compassion and high integrity.",
        "soul_urge": "Your deepest drive is to serve humanity selflessly and protect those who cannot protect themselves.",
        "personality": "Others perceive you as a highly evolved, compassionate guide who radiates safety and spiritual wisdom."
    }
}

KARMIC_DEBT_MEANINGS = {
    13: "Karmic Debt 13: Focusing on discipline and hard work to overcome past-life laziness.",
    14: "Karmic Debt 14: Learning moderation and commitment to overcome past-life abuse of freedom.",
    16: "Karmic Debt 16: Cultivating humility and spiritual values to release past-life ego.",
    19: "Karmic Debt 19: Learning to use power wisely and serve others to balance past-life dominance."
}

CHALLENGE_MEANINGS = {
    0: "Balanced approach—no specific challenge dominates your current cycle.",
    1: "Independence—learning to stand on your own feet without fear.",
    2: "Cooperation—learning to collaborate and handle sensitive relationships.",
    3: "Self-expression—learning to communicate your truth without scattering energy.",
    4: "Discipline—learning to build foundations and stick to a program.",
    5: "Freedom—learning to embrace change without losing your sense of responsibility.",
    6: "Responsibility—learning to serve and care for others without becoming controlling.",
    7: "Faith—learning to trust your inner voice and find spiritual peace.",
    8: "Power—learning to handle success and authority with ethical integrity."
}

# Personal Year & Month Cycle Data
CYCLE_MEANINGS = {
    1: {
        "title": "New Beginnings",
        "theme": "Individualization & Independence",
        "start": "New projects, business ventures, or a fresh fitness routine.",
        "focus": "Independence, self-reliance, and leadership roles.",
        "avoid": "Procrastination and relying too heavily on others' approval."
    },
    2: {
        "title": "Patience & Cooperation",
        "theme": "Relationships & Detail",
        "start": "Partnerships, mediation, and relationship healing.",
        "focus": "Patience, listening skills, and cooperative teamwork.",
        "avoid": "Confrontation, aggression, and unnecessary impulsive moves."
    },
    3: {
        "title": "Creative Expression",
        "theme": "Social Joy & Optimism",
        "start": "Artistic hobbies, writing, or public speaking courses.",
        "focus": "Socializing, creative self-expression, and positive thinking.",
        "avoid": "Scattering your energy and engaging in negative gossip."
    },
    4: {
        "title": "Practical Foundation",
        "theme": "Hard Work & Discipline",
        "start": "Savings plans, technical training, and home organization.",
        "focus": "Consistency, organization, and building stable structures.",
        "avoid": "Laziness and cutting corners in your duties."
    },
    5: {
        "title": "Change & Freedom",
        "theme": "Versatility & Adventure",
        "start": "Travel, new social circles, and learning local languages.",
        "focus": "Adaptability, embracing freedom, and exploring variety.",
        "avoid": "Impulsivity and excessive indulgence in sensory pleasures."
    },
    6: {
        "title": "Responsibility & Service",
        "theme": "Home, Family & Nurturing",
        "start": "Home decorating, marriage counseling, or community service.",
        "focus": "Domestic responsibility, service to others, and harmony.",
        "avoid": "Interfering in others' lives and being overly controlling."
    },
    7: {
        "title": "Introspection",
        "theme": "Spiritual Growth & Wisdom",
        "start": "Meditation, research projects, and specialized study.",
        "focus": "Inner growth, seeking truth, and intellectual perfection.",
        "avoid": "Major business expansions and loud, chaotic social events."
    },
    8: {
        "title": "Achievement",
        "theme": "Business Mastery & Power",
        "start": "Investment strategies, career changes, and large-scale plans.",
        "focus": "Money management, leadership, and efficient operations.",
        "avoid": "Workaholism and letting your ego override your ethics."
    },
    9: {
        "title": "Completion",
        "theme": "Humanitarianism & Renewal",
        "start": "Charitable work, finishing old tasks, and deep cleaning.",
        "focus": "Letting go of the past, service to humanity, and wisdom.",
        "avoid": "Starting brand new, long-term business ventures."
    }
}


# Career & Money Timing Guidance
TIMING_GUIDANCE = {
    1: {
        "best_activities": "Launch new ventures, aggressively pursue promotions, and set 9-year financial goals.",
        "job_change": "Months: January, October",
        "business": "Best year to start. Go big, start small.",
        "investment": "Focus on high-growth, long-term assets.",
        "warning": "Avoid over-extending credit. Timing is for building, not just spending."
    },
    2: {
        "best_activities": "Networking, forming partnerships, and negotiating better terms in existing contracts.",
        "job_change": "Months: February, November",
        "business": "Focus on joint ventures and collaborative projects.",
        "investment": "Safe, collaborative funds or joint accounts.",
        "warning": "Extreme patience required. Don't force a deal if it feels off."
    },
    3: {
        "best_activities": "Marketing, sales, creative product launches, and social expansion for your brand.",
        "job_change": "Months: March, December",
        "business": "Invest in 'visibility'—ads, PR, and public appearances.",
        "investment": "Moderate risk in creative or tech sectors.",
        "warning": "Scattered spending. Track every penny during high-social months."
    },
    4: {
        "best_activities": "Systems implementation, real estate, and fundamental organizational cleanup.",
        "job_change": "Months: April",
        "business": "Strengthen your infrastructure. This is a maintenance year.",
        "investment": "Real estate, gold, and tangible assets.",
        "warning": "Frustration is high. Avoid 'get rich quick' schemes now."
    },
    5: {
        "best_activities": "Diversifying income streams, rapid pivots, and taking advantage of sudden market shifts.",
        "job_change": "Months: May",
        "business": "The 'Change' year. Good for rebranding or moving location.",
        "investment": "Quick trades or liquid assets. High risk allowed.",
        "warning": "High volatility. Don't gamble what you can't afford to lose."
    },
    6: {
        "best_activities": "Client retention, service-based growth, and investing in high-end comfort or luxury.",
        "job_change": "Months: June",
        "business": "Excellent for teaching, healing, or home-based businesses.",
        "investment": "Home equity and family-run enterprises.",
        "warning": "Over-responsibility. Don't let family loans drain your capital."
    },
    7: {
        "best_activities": "Research, specialized skill development, and deep-dive audits of your finances.",
        "job_change": "Months: July",
        "business": "Not for expansion. Refine your 'secret sauce' or intellectual property.",
        "investment": "Education and self-improvement assets.",
        "warning": "Poor for major financial gambles. Stay conservative."
    },
    8: {
        "best_activities": "Scaling up, major capital raising, and executing large-scale business deals.",
        "job_change": "Months: August",
        "business": "Peak financial year. The 'Money Year.' Ask for the raise.",
        "investment": "Major assets, stocks, and business buyouts.",
        "warning": "Power struggles. High ethics are required for high rewards."
    },
    9: {
        "best_activities": "Completing projects, clearing debts, and transitioning away from outdated work models.",
        "job_change": "Months: September",
        "business": "Closing underperforming lines. Preparing for the next cycle.",
        "investment": "Charitable giving and liquidating old holdings.",
        "warning": "Do NOT start massive new debt cycles this year."
    }
}

# Name Insight Data
NAME_INSIGHTS = {
    1: {
        "career": "Highly Supportive (Leadership & Innovation)",
        "relationship": "Neutral (Requires personal space)",
        "stability": "Good (Strong self-reliance)",
        "suggestion": "Ensure your signature is upward-sloping to boost ambition."
    },
    2: {
        "career": "Supportive (Collaboration & Diplomacy)",
        "relationship": "Excellent (Deep empathy & Connection)",
        "stability": "Needs Balance (Avoid over-dependence)",
        "suggestion": "Incorporate more silver or cream colors in your daily life."
    },
    3: {
        "career": "Excellent (Communication & PR)",
        "relationship": "Supportive (Social & Joyful)",
        "stability": "Fluctuating (Watch for scattered energy)",
        "suggestion": "Avoid messy handwriting; a clear script brings mental focus."
    },
    4: {
        "career": "Strong (Systems & Engineering)",
        "relationship": "Neutral (Loyal but can be rigid)",
        "stability": "Excellent (The ultimate 'Builder' energy)",
        "suggestion": "Use your full middle name in legal documents for extra grounding."
    },
    5: {
        "career": "Mixed (Best for Sales/Travel)",
        "relationship": "Neutral (High need for freedom)",
        "stability": "Challenged (Volatility is high)",
        "suggestion": "Carry a yellow handkerchief to stabilize rapid energy shifts."
    },
    6: {
        "career": "Supportive (Service & Luxury sectors)",
        "relationship": "Excellent (Deeply nurturing & Family-centered)",
        "stability": "Good (Home-based stability)",
        "suggestion": "Always start your signature with a clear, firm capital letter."
    },
    7: {
        "career": "Excellent (Technical & Research)",
        "relationship": "Needs Effort (Secretive nature)",
        "stability": "Internal (Strong spiritual grounding)",
        "suggestion": "Limit use of abbreviations; full names refine your aura."
    },
    8: {
        "career": "Masterful (Finance & Power)",
        "relationship": "Neutral (Work/Life balance is key)",
        "stability": "Strong (Material foundation)",
        "suggestion": "Sign documents with a blue ink pen to invite professional luck."
    },
    9: {
        "career": "Global (Humanitarian & Arts)",
        "relationship": "Supportive (Universal love)",
        "stability": "Neutral (Cycle of transitions)",
        "suggestion": "Ensure your signature does not end with a downward stroke."
    },
    11: {
        "career": "Visionary (Spiritual & Inspirational)",
        "relationship": "Sensitive (High emotional depth)",
        "stability": "Fragile (Needs intentional grounding)",
        "suggestion": "Avoid using nicknames; your full vibration is your power."
    },
    22: {
        "career": "Supreme (Global infrastructure)",
        "relationship": "Stable (Pragmatic & Purposeful)",
        "stability": "Unbeatable (Practical manifestation)",
        "suggestion": "Keep your signature consistent across all platforms."
    },
    33: {
        "career": "Supreme (Teaching & Healing)",
        "relationship": "Profound (Sacrificial love)",
        "stability": "Strong (Guided by high values)",
        "suggestion": "Focus on clarity in your name's phonetic sounding."
    }
}

# Lucky Elements Data
LUCKY_ELEMENTS = {
    1: {
        "numbers": [1, 10, 19, 28],
        "dates": "1st, 10th, 19th, 28th",
        "colors": "Gold, Yellow, Orange",
        "days": "Sunday, Monday",
        "gemstone": "Ruby"
    },
    2: {
        "numbers": [2, 11, 20, 29],
        "dates": "2nd, 11th, 20th, 29th",
        "colors": "White, Cream, Silver, Pale Green",
        "days": "Monday, Friday, Sunday",
        "gemstone": "Pearl"
    },
    3: {
        "numbers": [3, 12, 21, 30],
        "dates": "3rd, 12th, 21st, 30th",
        "colors": "Yellow, Violet, Purple, Pink",
        "days": "Thursday, Tuesday, Friday",
        "gemstone": "Yellow Sapphire"
    },
    4: {
        "numbers": [4, 13, 22, 31],
        "dates": "4th, 13th, 22nd, 31st",
        "colors": "Blue, Grey, Khaki",
        "days": "Saturday, Sunday, Monday",
        "gemstone": "Hessonite"
    },
    5: {
        "numbers": [5, 14, 23],
        "dates": "5th, 14th, 23rd",
        "colors": "Light Green, White, Silver",
        "days": "Wednesday, Friday",
        "gemstone": "Emerald"
    },
    6: {
        "numbers": [6, 15, 24],
        "dates": "6th, 15th, 24th",
        "colors": "Blue, Pink, White",
        "days": "Friday, Tuesday, Thursday",
        "gemstone": "Diamond"
    },
    7: {
        "numbers": [7, 16, 25],
        "dates": "7th, 16th, 25th",
        "colors": "Light Green, White, Light Yellow",
        "days": "Monday, Wednesday, Sunday",
        "gemstone": "Cat's Eye"
    },
    8: {
        "numbers": [8, 17, 26],
        "dates": "8th, 17th, 26th",
        "colors": "Dark Blue, Black, Purple",
        "days": "Saturday, Friday",
        "gemstone": "Blue Sapphire"
    },
    9: {
        "numbers": [9, 18, 27],
        "dates": "9th, 18th, 27th",
        "colors": "Red, Crimson, Pink",
        "days": "Tuesday, Thursday, Sunday",
        "gemstone": "Red Coral"
    },
    11: {
        "numbers": [1, 2, 7, 11],
        "dates": "1st, 2nd, 7th, 11th, 20th",
        "colors": "White, Silver, Pale Yellow",
        "days": "Monday, Sunday",
        "gemstone": "White Topaz"
    },
    22: {
        "numbers": [4, 8, 22],
        "dates": "4th, 8th, 13th, 22nd",
        "colors": "Deep Blue, Gold, Grey",
        "days": "Saturday, Sunday",
        "gemstone": "Blue Garnet"
    },
    33: {
        "numbers": [3, 6, 9, 33],
        "dates": "6th, 15th, 24th, 33rd",
        "colors": "Sky Blue, Bright White, Lavender",
        "days": "Friday, Thursday",
        "gemstone": "Clear Quartz"
    }
}

def get_interpretation(number_type, number):
    """Get interpretation for a specific number"""
    # Robust numeric conversion for dictionary lookups
    try:
        if isinstance(number, (str, float, int)):
            number = int(float(number or 0))
            
        # If it's a multi-digit number and not a master number, reduce it
        if number > 9 and number not in [11, 22, 33]:
            number = sum(int(digit) for digit in str(number))
            if number > 9: # second reduction if needed
                number = sum(int(digit) for digit in str(number))
    except (ValueError, TypeError):
        pass

    if number_type == "lucky_elements":
        return LUCKY_ELEMENTS.get(number, {})
        
    if number_type == "name_insight":
        return NAME_INSIGHTS.get(number, {})

    if number_type == "timing":
        return TIMING_GUIDANCE.get(number, {})
        
    if number_type in ["personal_year", "personal_month"]:
        return CYCLE_MEANINGS.get(number, {})

    data = STANDARD_TRAITS.get(number, {})
    if not data:
        return {}
        
    res = {
        "strength": data.get("strength", ""),
        "caution": data.get("caution", "")
    }
    
    if number_type == "life_path":
        res["text"] = data.get("life_path", "")
    elif number_type == "expression":
        res["text"] = data.get("expression", "")
    elif number_type == "soul_urge":
        res["text"] = data.get("soul_urge", "")
    elif number_type == "personality":
        res["text"] = data.get("personality", "")
        
    return res

def get_karmic_lesson_interpretation(missing_numbers):
    """Get interpretation for karmic lessons"""
    lessons = {
        1: "Learn self-reliance and leadership",
        2: "Learn cooperation and sensitivity",
        3: "Learn creative expression and communication",
        4: "Learn discipline and practical skills",
        5: "Learn adaptability and constructive use of freedom",
        6: "Learn responsibility and service to others",
        7: "Learn to trust intuition and seek inner wisdom",
        8: "Learn business skills and material management",
        9: "Learn compassion and humanitarian service"
    }
    return [{"number": num, "lesson": lessons.get(num, "")} for num in missing_numbers]
