"""
Phillips Numerology Engine
Based on "The Complete Book of Numerology" by David A. Phillips

Implements comprehensive Pythagorean numerology system with:
- Core numbers (Life Path, Expression, Soul Urge, Personality, Maturity, Birthday)
- Karmic Debt detection (13, 14, 16, 19)
- Karmic Lessons (missing numbers in name)
- Challenge Numbers
- Pinnacle Numbers
- Personal Year calculation
- Detailed interpretations
"""

from datetime import datetime

# Letter to number mapping (Pythagorean system)
LETTER_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
}

VOWELS = set('AEIOU')
MASTER_NUMBERS = {11, 22, 33}
KARMIC_DEBT_NUMBERS = {13, 14, 16, 19}

def reduce_to_single_digit(number, keep_master=True, track_karmic=False):
    """
    Reduce number to single digit, preserving master numbers and tracking karmic debt
    Returns: (final_number, has_karmic_debt)
    """
    original = number
    has_karmic = False
    
    while number > 9:
        if keep_master and number in MASTER_NUMBERS:
            return (number, has_karmic)
        if track_karmic and number in KARMIC_DEBT_NUMBERS:
            has_karmic = True
        number = sum(int(digit) for digit in str(number))
    
    return (number, has_karmic)

def calculate_life_path(year, month, day):
    """
    Calculate Life Path Number using Phillips method
    Returns: (life_path_number, has_karmic_debt)
    """
    # Reduce each component separately
    year_sum = sum(int(d) for d in str(year))
    month_sum = month
    day_sum = day
    
    # Check for karmic debt in components
    has_karmic = any(num in KARMIC_DEBT_NUMBERS for num in [year_sum, month_sum, day_sum])
    
    # Reduce each to single digit or master number
    year_reduced, _ = reduce_to_single_digit(year_sum, keep_master=True)
    month_reduced, _ = reduce_to_single_digit(month_sum, keep_master=True)
    day_reduced, _ = reduce_to_single_digit(day_sum, keep_master=True)
    
    # Add and reduce final
    total = year_reduced + month_reduced + day_reduced
    life_path, lp_karmic = reduce_to_single_digit(total, keep_master=True, track_karmic=True)
    
    return (life_path, has_karmic or lp_karmic)

def calculate_expression(full_name):
    """
    Calculate Expression/Destiny Number from full birth name
    Returns: (expression_number, has_karmic_debt)
    """
    total = sum(LETTER_VALUES.get(char.upper(), 0) for char in full_name if char.isalpha())
    return reduce_to_single_digit(total, keep_master=True, track_karmic=True)

def calculate_soul_urge(full_name):
    """
    Calculate Soul Urge/Heart's Desire Number from vowels
    Returns: (soul_urge_number, has_karmic_debt)
    """
    total = sum(LETTER_VALUES.get(char.upper(), 0) 
                for char in full_name.upper() if char in VOWELS)
    return reduce_to_single_digit(total, keep_master=True, track_karmic=True)

def calculate_personality(full_name):
    """
    Calculate Personality Number from consonants
    Returns: (personality_number, has_karmic_debt)
    """
    total = sum(LETTER_VALUES.get(char.upper(), 0) 
                for char in full_name.upper() 
                if char.isalpha() and char not in VOWELS)
    return reduce_to_single_digit(total, keep_master=True, track_karmic=True)

def calculate_maturity(life_path, expression):
    """
    Calculate Maturity Number (Life Path + Expression)
    Represents long-term goals and later-life achievements
    """
    total = life_path + expression
    maturity, _ = reduce_to_single_digit(total, keep_master=True)
    return maturity

def calculate_birthday(day):
    """
    Calculate Birthday Number from day of birth
    Returns: (birthday_number, has_karmic_debt)
    """
    return reduce_to_single_digit(day, keep_master=False, track_karmic=True)

def calculate_karmic_lessons(full_name):
    """
    Calculate Karmic Lessons - missing numbers (1-9) in full name
    These represent areas requiring development
    """
    name_numbers = set()
    for char in full_name.upper():
        if char.isalpha():
            name_numbers.add(LETTER_VALUES[char])
    
    all_numbers = set(range(1, 10))
    missing = sorted(all_numbers - name_numbers)
    return missing

def calculate_challenges(year, month, day):
    """
    Calculate four Challenge Numbers from birth date
    Challenges represent obstacles to overcome
    """
    month_reduced, _ = reduce_to_single_digit(month, keep_master=False)
    day_reduced, _ = reduce_to_single_digit(day, keep_master=False)
    year_reduced, _ = reduce_to_single_digit(sum(int(d) for d in str(year)), keep_master=False)
    
    # First Challenge: |month - day|
    challenge1 = abs(month_reduced - day_reduced)
    
    # Second Challenge: |day - year|
    challenge2 = abs(day_reduced - year_reduced)
    
    # Third Challenge: |challenge1 - challenge2|
    challenge3 = abs(challenge1 - challenge2)
    
    # Fourth Challenge: |month - year|
    challenge4 = abs(month_reduced - year_reduced)
    
    return {
        "first": challenge1,
        "second": challenge2,
        "third": challenge3,
        "fourth": challenge4
    }

def calculate_pinnacles(year, month, day):
    """
    Calculate four Pinnacle Numbers from birth date
    Pinnacles represent major life periods and opportunities
    """
    month_reduced, _ = reduce_to_single_digit(month, keep_master=True)
    day_reduced, _ = reduce_to_single_digit(day, keep_master=True)
    year_reduced, _ = reduce_to_single_digit(sum(int(d) for d in str(year)), keep_master=True)
    
    # First Pinnacle: month + day
    pinnacle1, _ = reduce_to_single_digit(month_reduced + day_reduced, keep_master=True)
    
    # Second Pinnacle: day + year
    pinnacle2, _ = reduce_to_single_digit(day_reduced + year_reduced, keep_master=True)
    
    # Third Pinnacle: pinnacle1 + pinnacle2
    pinnacle3, _ = reduce_to_single_digit(pinnacle1 + pinnacle2, keep_master=True)
    
    # Fourth Pinnacle: month + year
    pinnacle4, _ = reduce_to_single_digit(month_reduced + year_reduced, keep_master=True)
    
    return {
        "first": pinnacle1,
        "second": pinnacle2,
        "third": pinnacle3,
        "fourth": pinnacle4
    }

def calculate_personal_year(year, month, day, current_year=None):
    """
    Calculate Personal Year Number for current or specified year
    Part of 9-year cycles
    """
    if current_year is None:
        current_year = datetime.now().year
    
    month_reduced, _ = reduce_to_single_digit(month, keep_master=False)
    day_reduced, _ = reduce_to_single_digit(day, keep_master=False)
    year_reduced, _ = reduce_to_single_digit(sum(int(d) for d in str(current_year)), keep_master=False)
    
    total = month_reduced + day_reduced + year_reduced
    personal_year, _ = reduce_to_single_digit(total, keep_master=False)
    
    return personal_year

def get_complete_numerology_profile(name, year, month, day):
    """
    Calculate complete Phillips numerology profile
    """
    # Core numbers
    life_path, lp_karmic = calculate_life_path(year, month, day)
    expression, exp_karmic = calculate_expression(name)
    soul_urge, su_karmic = calculate_soul_urge(name)
    personality, pers_karmic = calculate_personality(name)
    birthday_num, bd_karmic = calculate_birthday(day)
    maturity = calculate_maturity(life_path, expression)
    
    # Advanced calculations
    karmic_lessons = calculate_karmic_lessons(name)
    challenges = calculate_challenges(year, month, day)
    pinnacles = calculate_pinnacles(year, month, day)
    personal_year = calculate_personal_year(year, month, day)
    
    # Compile karmic debt information
    karmic_debt_numbers = []
    if lp_karmic:
        karmic_debt_numbers.append(("Life Path", life_path))
    if exp_karmic:
        karmic_debt_numbers.append(("Expression", expression))
    if bd_karmic:
        karmic_debt_numbers.append(("Birthday", birthday_num))
    
    return {
        "core_numbers": {
            "life_path": life_path,
            "expression": expression,
            "soul_urge": soul_urge,
            "personality": personality,
            "birthday": birthday_num,
            "maturity": maturity
        },
        "karmic_patterns": {
            "karmic_debt": karmic_debt_numbers,
            "karmic_lessons": karmic_lessons
        },
        "life_cycles": {
            "challenges": challenges,
            "pinnacles": pinnacles,
            "personal_year": personal_year
        },
        "metadata": {
            "name": name,
            "birth_date": f"{year}-{month:02d}-{day:02d}",
            "calculation_method": "Phillips Pythagorean System"
        }
    }
