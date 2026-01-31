"""
Numerology Calculator Service
Calculates various numerology numbers based on name and birth date
"""

def reduce_to_single_digit(number, keep_master=True):
    """
    Reduce a number to a single digit (1-9) or master number (11, 22, 33)
    """
    while number > 9:
        if keep_master and number in [11, 22, 33]:
            return number
        number = sum(int(digit) for digit in str(number))
    return number

def letter_to_number(letter):
    """
    Convert letter to number using Pythagorean numerology system
    A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
    J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
    S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
    """
    letter = letter.upper()
    if not letter.isalpha():
        return 0
    
    # A-I = 1-9, J-R = 1-9, S-Z = 1-8
    position = ord(letter) - ord('A')
    return (position % 9) + 1

def calculate_life_path_number(year, month, day):
    """
    Calculate Life Path Number from birth date
    """
    # Reduce each component
    year_sum = reduce_to_single_digit(sum(int(d) for d in str(year)))
    month_sum = reduce_to_single_digit(month)
    day_sum = reduce_to_single_digit(day)
    
    # Combine and reduce
    total = year_sum + month_sum + day_sum
    return reduce_to_single_digit(total)

def calculate_expression_number(full_name):
    """
    Calculate Expression Number (Destiny Number) from full name
    """
    total = sum(letter_to_number(char) for char in full_name if char.isalpha())
    return reduce_to_single_digit(total)

def calculate_soul_urge_number(full_name):
    """
    Calculate Soul Urge Number (Heart's Desire) from vowels in name
    """
    vowels = 'AEIOU'
    total = sum(letter_to_number(char) for char in full_name.upper() if char in vowels)
    return reduce_to_single_digit(total)

def calculate_personality_number(full_name):
    """
    Calculate Personality Number from consonants in name
    """
    vowels = 'AEIOU'
    total = sum(letter_to_number(char) for char in full_name.upper() 
                if char.isalpha() and char not in vowels)
    return reduce_to_single_digit(total)

def calculate_birthday_number(day):
    """
    Calculate Birthday Number from day of birth
    """
    return reduce_to_single_digit(day)

def get_number_meaning(number, number_type):
    """
    Get basic meaning for a numerology number
    """
    meanings = {
        1: "Leadership, independence, innovation, and new beginnings",
        2: "Cooperation, balance, diplomacy, and partnerships",
        3: "Creativity, self-expression, joy, and communication",
        4: "Stability, hard work, practicality, and foundation",
        5: "Freedom, adventure, change, and versatility",
        6: "Harmony, responsibility, nurturing, and service",
        7: "Spirituality, introspection, wisdom, and analysis",
        8: "Power, success, material abundance, and achievement",
        9: "Compassion, humanitarianism, completion, and wisdom",
        11: "Spiritual insight, intuition, enlightenment (Master Number)",
        22: "Master builder, turning dreams into reality (Master Number)",
        33: "Master teacher, spiritual upliftment (Master Number)"
    }
    return meanings.get(number, "Unknown")

def calculate_all_numbers(name, year, month, day):
    """
    Calculate all numerology numbers for a person
    """
    return {
        "life_path": calculate_life_path_number(year, month, day),
        "expression": calculate_expression_number(name),
        "soul_urge": calculate_soul_urge_number(name),
        "personality": calculate_personality_number(name),
        "birthday": calculate_birthday_number(day),
        "name": name,
        "birth_date": f"{year}-{month:02d}-{day:02d}"
    }
