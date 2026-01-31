"""
Phillips Numerology Interpretations
Detailed meanings for all numbers based on Phillips methodology
"""

# Core Number Interpretations
LIFE_PATH_MEANINGS = {
    1: {
        "title": "The Leader",
        "description": "Independent, pioneering, and innovative. You are here to lead and create new paths.",
        "strengths": "Leadership, independence, innovation, courage, determination",
        "challenges": "Avoid being overly aggressive, domineering, or self-centered",
        "life_purpose": "To develop independence and leadership while inspiring others"
    },
    2: {
        "title": "The Peacemaker",
        "description": "Diplomatic, cooperative, and sensitive. You excel in partnerships and bringing harmony.",
        "strengths": "Diplomacy, cooperation, intuition, patience, attention to detail",
        "challenges": "Avoid being overly sensitive, indecisive, or dependent on others",
        "life_purpose": "To create harmony and balance through cooperation and understanding"
    },
    3: {
        "title": "The Creative Communicator",
        "description": "Expressive, creative, and social. You bring joy and inspiration through self-expression.",
        "strengths": "Creativity, communication, optimism, social skills, artistic talent",
        "challenges": "Avoid scattering energy, superficiality, or excessive self-indulgence",
        "life_purpose": "To inspire and uplift others through creative self-expression"
    },
    4: {
        "title": "The Builder",
        "description": "Practical, disciplined, and hardworking. You create solid foundations and lasting structures.",
        "strengths": "Organization, discipline, reliability, practicality, determination",
        "challenges": "Avoid rigidity, stubbornness, or becoming too focused on material concerns",
        "life_purpose": "To build stable foundations and create lasting value through hard work"
    },
    5: {
        "title": "The Freedom Seeker",
        "description": "Adventurous, versatile, and freedom-loving. You thrive on change and new experiences.",
        "strengths": "Adaptability, versatility, curiosity, progressive thinking, resourcefulness",
        "challenges": "Avoid restlessness, irresponsibility, or excessive indulgence",
        "life_purpose": "To experience freedom and inspire others to embrace change"
    },
    6: {
        "title": "The Nurturer",
        "description": "Responsible, caring, and service-oriented. You excel in creating harmony and helping others.",
        "strengths": "Responsibility, compassion, harmony, service, artistic appreciation",
        "challenges": "Avoid being overly controlling, self-sacrificing, or interfering",
        "life_purpose": "To serve others and create harmony in home and community"
    },
    7: {
        "title": "The Seeker",
        "description": "Analytical, spiritual, and introspective. You seek truth and deeper understanding.",
        "strengths": "Analysis, intuition, spirituality, wisdom, technical skill",
        "challenges": "Avoid isolation, skepticism, or becoming too detached from reality",
        "life_purpose": "To seek truth and share wisdom through spiritual and intellectual pursuits"
    },
    8: {
        "title": "The Powerhouse",
        "description": "Ambitious, authoritative, and business-minded. You achieve material success and power.",
        "strengths": "Leadership, business acumen, ambition, efficiency, material success",
        "challenges": "Avoid materialism, workaholism, or misuse of power",
        "life_purpose": "To achieve material success while maintaining ethical integrity"
    },
    9: {
        "title": "The Humanitarian",
        "description": "Compassionate, idealistic, and globally conscious. You serve humanity with wisdom.",
        "strengths": "Compassion, idealism, artistic talent, humanitarian service, wisdom",
        "challenges": "Avoid being overly emotional, impractical, or self-sacrificing",
        "life_purpose": "To serve humanity and inspire others through compassion and wisdom"
    },
    11: {
        "title": "The Spiritual Messenger (Master Number)",
        "description": "Intuitive, inspirational, and spiritually aware. You illuminate and inspire others.",
        "strengths": "Intuition, inspiration, spiritual insight, idealism, charisma",
        "challenges": "Avoid nervous tension, impracticality, or living in the clouds",
        "life_purpose": "To inspire and enlighten others through spiritual awareness"
    },
    22: {
        "title": "The Master Builder (Master Number)",
        "description": "Visionary, practical, and capable of manifesting grand visions into reality.",
        "strengths": "Vision, practicality, leadership, building on large scale, manifestation",
        "challenges": "Avoid overwhelming pressure, self-doubt, or misuse of power",
        "life_purpose": "To build something of lasting value that benefits humanity"
    },
    33: {
        "title": "The Master Teacher (Master Number)",
        "description": "Nurturing, responsible, and devoted to uplifting humanity through teaching and healing.",
        "strengths": "Teaching, healing, compassion, responsibility, spiritual service",
        "challenges": "Avoid martyrdom, over-responsibility, or emotional overwhelm",
        "life_purpose": "To teach, heal, and uplift humanity through selfless service"
    }
}

KARMIC_DEBT_MEANINGS = {
    13: "Karmic Debt 13: Laziness and negativity in past. Learn discipline, hard work, and positive focus.",
    14: "Karmic Debt 14: Abuse of freedom in past. Learn moderation, commitment, and responsible use of freedom.",
    16: "Karmic Debt 16: Ego and pride in past. Learn humility, spiritual values, and inner transformation.",
    19: "Karmic Debt 19: Misuse of power in past. Learn to serve others and use power wisely."
}

CHALLENGE_MEANINGS = {
    0: "No specific challenge - indicates a balanced approach to life",
    1: "Challenge of independence - learning to stand on your own",
    2: "Challenge of cooperation - learning to work with others",
    3: "Challenge of self-expression - learning to communicate effectively",
    4: "Challenge of discipline - learning to build solid foundations",
    5: "Challenge of freedom - learning to embrace change constructively",
    6: "Challenge of responsibility - learning to serve and nurture",
    7: "Challenge of faith - learning to trust inner wisdom",
    8: "Challenge of power - learning to handle authority and success"
}

PERSONAL_YEAR_MEANINGS = {
    1: "New beginnings - time to start fresh projects and take initiative",
    2: "Cooperation and patience - time to develop relationships and partnerships",
    3: "Creative expression - time to express yourself and enjoy social activities",
    4: "Hard work and foundation - time to build, organize, and establish stability",
    5: "Change and freedom - time for adventure, travel, and new experiences",
    6: "Responsibility and service - time to focus on home, family, and community",
    7: "Introspection and spirituality - time for inner growth and study",
    8: "Achievement and recognition - time for business success and material gains",
    9: "Completion and transition - time to let go and prepare for new cycles"
}

def get_interpretation(number_type, number):
    """Get interpretation for a specific number"""
    if number_type == "life_path":
        return LIFE_PATH_MEANINGS.get(number, {})
    elif number_type == "karmic_debt":
        return KARMIC_DEBT_MEANINGS.get(number, "")
    elif number_type == "challenge":
        return CHALLENGE_MEANINGS.get(number, "")
    elif number_type == "personal_year":
        return PERSONAL_YEAR_MEANINGS.get(number, "")
    return {}

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
