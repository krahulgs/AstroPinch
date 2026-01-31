"""
Western Astrology Knowledge Base
Source: Synthesized from Cafe Astrology, Astrology.com, Labyrinthos, and professional astrological texts including 'Hellenistic Astrology' by Chris Brennan.
"""

SIGNS = {
    "Aries": {
        "motto": "I am",
        "ruler": "Mars",
        "element": "Fire",
        "quality": "Cardinal",
        "traits": "Courageous, pioneering, impulsive, energetic, assertive",
        "sun_theme": "Driven to lead and initiate new paths.",
        "moon_theme": "Emotional reactions are direct and impulsive. Needs independence.",
        "asc_theme": "Presents as a confident, energetic pioneer. First impression: Action-oriented.",
        "research_notes": "Aries on a house cusp indicates the native must take direct, often competitive action in that area. It is the archetype of the pioneer seeking self-actualization."
    },
    "Taurus": {
        "motto": "I have",
        "ruler": "Venus",
        "element": "Earth",
        "quality": "Fixed",
        "traits": "Practical, stable, sensual, determined, loyal, seeks security",
        "sun_theme": "Values stability and material success.",
        "moon_theme": "Finds emotional security in comfort and predictability.",
        "asc_theme": "Presents as calm, steady, and reliable. First impression: Patient and grounded.",
        "research_notes": "Taurus indicates where persistence and resource-gathering are paramount. It represents the physical manifestation of value and security."
    },
    "Gemini": {
        "motto": "I think",
        "ruler": "Mercury",
        "element": "Air",
        "quality": "Mutable",
        "traits": "Communicative, intellectual, adaptable, curious, versatile",
        "sun_theme": "Driven by social interaction and mental stimulation.",
        "moon_theme": "Processes emotions through logical analysis and talk.",
        "asc_theme": "Presents as quick-witted and sociable. First impression: Curious and talkative.",
        "research_notes": "Gemini on a house cusp brings duality and a need for mental variety. It is the bridge between concepts, emphasizing information exchange."
    },
    "Cancer": {
        "motto": "I feel",
        "ruler": "Moon",
        "element": "Water",
        "quality": "Cardinal",
        "traits": "Nurturing, emotional, sensitive, intuitive, protective",
        "sun_theme": "Core identity tied to family, home, and caring for others.",
        "moon_theme": "Deeply intuitive and sensitive subconscious. Strong protective instincts.",
        "asc_theme": "Presents as approachable and sensitive. First impression: Nurturing and protective.",
        "research_notes": "Cancer represents the 'womb' of the chart. It indicates where the native seeks to nurture and be nurtured, focusing on emotional safety."
    },
    "Leo": {
        "motto": "I will",
        "ruler": "Sun",
        "element": "Fire",
        "quality": "Fixed",
        "traits": "Confident, dramatic, creative, generous, seeks recognition",
        "sun_theme": "Aims to shine and lead through creative self-expression.",
        "moon_theme": "Emotional pride; needs admiration and warmth to feel secure.",
        "asc_theme": "Presents as charismatic and radiant. First impression: Dignified and warm.",
        "research_notes": "Leo indicates a life area where the individual must be 'seen'. It is the solar drive for validation, creativity, and sovereign expression."
    },
    "Virgo": {
        "motto": "I analyze",
        "ruler": "Mercury",
        "element": "Earth",
        "quality": "Mutable",
        "traits": "Analytical, practical, organized, precise, service-oriented",
        "sun_theme": "Finds purpose in service, improvement, and attention to detail.",
        "moon_theme": "Feels secure when everything is in order. Analytical emotional landscape.",
        "asc_theme": "Presents as modesty, intelligent, and refined. First impression: Observant and helpful.",
        "research_notes": "Virgo on a house cusp brings the desire for perfection and utility. It represents the harvest, focus on health, work, and refinement."
    },
    "Libra": {
        "motto": "I balance",
        "ruler": "Venus",
        "element": "Air",
        "quality": "Cardinal",
        "traits": "Balanced, diplomatic, charming, harmonious, relationship-focused",
        "sun_theme": "Core identity centered on partnership and social harmony.",
        "moon_theme": "Emotional peace depends on fairness and pleasant surroundings.",
        "asc_theme": "Presents as charming and polite. First impression: Diplomatic and elegant.",
        "research_notes": "Libra indicates where cooperation and aesthetics are necessary. It is the quest for equilibrium and the 'other' in social dynamics."
    },
    "Scorpio": {
        "motto": "I desire",
        "ruler": "Pluto (Traditional: Mars)",
        "element": "Water",
        "quality": "Fixed",
        "traits": "Intense, passionate, mysterious, transformative, deep",
        "sun_theme": "Driven to uncover secrets and undergo profound rebirth.",
        "moon_theme": "Intense, private emotions. Feels deeply but hides it well.",
        "asc_theme": "Presents as magnetic and intense. First impression: Mysterious and powerful.",
        "research_notes": "Scorpio indicates where the native encounters death, rebirth, and shared power. It is the psychological detective of the zodiac."
    },
    "Sagittarius": {
        "motto": "I see",
        "ruler": "Jupiter",
        "element": "Fire",
        "quality": "Mutable",
        "traits": "Adventurous, optimistic, philosophical, freedom-loving, expansive",
        "sun_theme": "Purpose found in the search for truth and widening horizons.",
        "moon_theme": "Emotional freedom-seeker. Optimism is a core survival trait.",
        "asc_theme": "Presents as friendly and open. First impression: Optimistic and adventurous.",
        "research_notes": "Sagittarius brings a quest for meaning and expansion on its house cusp. It represents the archer aiming for the higher mind and travel."
    },
    "Capricorn": {
        "motto": "I use",
        "ruler": "Saturn",
        "element": "Earth",
        "quality": "Cardinal",
        "traits": "Ambitious, responsible, disciplined, practical, achievement-oriented",
        "sun_theme": "Core identity tied to public status, work, and legacy.",
        "moon_theme": "Serious and controlled emotions. Finds security in structure.",
        "asc_theme": "Presents as professional and capable. First impression: Disciplined and serious.",
        "research_notes": "Capricorn indicates where the native must take responsibility and build lasting structures. It is the archetype of the climber and leader."
    },
    "Aquarius": {
        "motto": "I know",
        "ruler": "Uranus (Traditional: Saturn)",
        "element": "Air",
        "quality": "Fixed",
        "traits": "Innovative, independent, humanitarian, intellectual, unconventional",
        "sun_theme": "Driven by social progress and intellectual uniqueness.",
        "moon_theme": "Detached emotional style. Needs mental space to feel secure.",
        "asc_theme": "Presents as unique and intellectual. First impression: Friendly but unconventional.",
        "research_notes": "Aquarius indicates a house where the individual breaks tradition. It is the collective mind, focusing on friendship and social reform."
    },
    "Pisces": {
        "motto": "I believe",
        "ruler": "Neptune (Traditional: Jupiter)",
        "element": "Water",
        "quality": "Mutable",
        "traits": "Empathetic, spiritual, imaginative, compassionate, dreamy",
        "sun_theme": "Core identity linked to spiritual unity and creative empathy.",
        "moon_theme": "highly psychic and porous emotions. Needs retreats for peace.",
        "asc_theme": "Presents as soft, ethereal, and kind. First impression: Gentle and dreamy.",
        "research_notes": "Pisces indicates where dissolution and spiritual empathy occur. It is the ocean of the subconscious, art, and universal love."
    }
}

HOUSES = {
    1: {"name": "Self", "theme": "Identity, appearance, vitality, mask", "research": "The persona and physical body. Directly impacts how the world 'reads' the individual's core energy."},
    2: {"name": "Valuables", "theme": "Finances, possessions, self-worth", "research": "Personal resources and the values that provide a sense of stability. The 'garden' the native tends."},
    3: {"name": "Communication", "theme": "Mind, siblings, short trips, neighbors", "research": "The local environment and primary mental processing. This is how the native interacts with the immediate world."},
    4: {"name": "Home", "theme": "Roots, family, foundations, mother", "research": "The bottom of the chart. Emotional foundations, heritage, and the private 'nest' or home life."},
    5: {"name": "Creativity", "theme": "Romance, children, fun, play", "research": "Self-expression and joyful risk. The house of the inner child, hobbies, and creative output."},
    6: {"name": "Health", "theme": "Service, routines, daily work, pets", "research": "The daily grind and somatic health. Where the native practices skills and takes care of the physical vehicle."},
    7: {"name": "Partnerships", "theme": "Marriage, business partners, open enemies", "research": "The 'significant other'. Deals with equality, balance, and the mirrors provided by external partners."},
    8: {"name": "Transformation", "theme": "Intimacy, shared resources, death, rebirth", "research": "The deep psychological house. Where we merge with others, face taboos, and undergo profound cellular change."},
    9: {"name": "Philosophy", "theme": "Higher learning, travel, spirituality", "research": "The search for meaning. Long-distance travel, university-level study, and the personal belief system."},
    10: {"name": "Career", "theme": "Reputation, status, goals, father", "research": "The public peak. Achievements, vocational calling, and the legacy one leaves in the societal collective."},
    11: {"name": "Friendships", "theme": "Groups, dreams, community, hopes", "research": "The collective connection. Friendships based on shared ideals and the native's vision for a better future."},
    12: {"name": "Subconscious", "theme": "Secrets, solitude, endings, spirituality", "research": "The 'dustbin' and treasury of the chart. Hidden strengths, self-sabotaging patterns, and the connection to the Divine."}
}

PLANETARY_QUALITIES = {
    "Sun": "The Ego & Life Force",
    "Moon": "The Subconscious & Instinct",
    "Mercury": "The Intellect & Communication",
    "Venus": "The Values & Relationships",
    "Mars": "The Drive & Passion",
    "Jupiter": "The Expansion & Luck",
    "Saturn": "The Structure & Limitation",
    "Uranus": "The Innovation & Rebellion",
    "Neptune": "The Dreams & Spirituality",
    "Pluto": "The Power & Transformation"
}
