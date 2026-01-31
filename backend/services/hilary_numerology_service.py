from typing import Dict, List, Any

class HilaryNumerologyService:
    """
    Implements the 'Science of Success' system by Hilary Gerard (1937).
    Focuses on the 'Fadic Number' derived from the birth date.
    """

    @staticmethod
    def calculate_fadic_number(day: int, month: int, year: int) -> int:
        """
        Calculates the Fadic Number by summing all digits of the birth date
        and reducing to a single digit (1-9).
        Example: 5-2-1897 -> 5+2+1+8+9+7 = 32 -> 3+2 = 5.
        """
        date_str = f"{day}{month}{year}"
        total = sum(int(digit) for digit in date_str)
        
        while total > 9:
            total = sum(int(digit) for digit in str(total))
            
        return total

    @staticmethod
    def get_fadic_profile(fadic_number: int) -> Dict[str, Any]:
        """
        Returns the detailed profile for a given Fadic Number based on Hilary Gerard's text.
        """
        profiles = {
            1: {
                "type": "The AGGRESSIVE or COURAGEOUS type",
                "symbol": "Sun",
                "qualities": "Self-reliance, distinction, leadership, dignity, inventive genius, power, definiteness of purpose.",
                "faults": "Selfishness, domination, lack of forethought, narrowmindedness, inability to heed advice.",
                "description": "Indicates aggression, action, ambition. A strong number, representing force, creative ability, individualism. It is a number of ruling, directing, and the pioneer spirit.",
                "harmonies": [4, 2, 7],
                "colors": ["Violet"],
                "gems": ["Diamond"],
                "days": ["Sunday", "Thursday"],
                "occupations": ["Inventor", "Explorer", "Producer", "Director", "Foreman", "Head of Department", "Owner of Business"]
            },
            2: {
                "type": "The PLACID or BALANCED type",
                "symbol": "Moon",
                "qualities": "Keen sense of natural justice, tactfulness, desire for peace, home loving instincts, caution.",
                "faults": "Lack of ambition, procrastination, over-passiveness, tendency to give way to stronger personalities.",
                "description": "Indicates diplomacy, antithesis, balance, contrast. A social number—tact and ability to make friends ensure happiness. The world's peacemakers.",
                "harmonies": [7, 1, 4],
                "colors": ["Dark Blue"],
                "gems": ["Sapphire"],
                "days": ["Monday", "Wednesday"],
                "occupations": ["Diplomat", "Secretary", "Statistician", "Accountant", "Clerk", "Politician", "Peace-maker"]
            },
            3: {
                "type": "The EXPRESSIVE or ACTIVE type",
                "symbol": "Mars",
                "qualities": "Independence, fearlessness, enthusiasm, activeness, quick tact, versatility.",
                "faults": "Indifference, preferring popularity to esteem, extravagance, unjustifiable optimism.",
                "description": "Indicates talent, versatility, gaiety, mirth. Can succeed in almost anything if they concentrate. Their enthusiasm is contagious and sweeps away difficulties.",
                "harmonies": [6, 9],
                "colors": ["Light Blue"],
                "gems": ["Turquoise"],
                "days": ["Tuesday", "Friday"],
                "occupations": ["Actor", "Artist", "Humorist", "Writer", "Musician", "Orator", "Promoter"]
            },
            4: {
                "type": "The DELIBERATE or CAUTIOUS type",
                "symbol": "Mercury",
                "qualities": "Regularity, deliberation, strength of purpose, steadfastness, usefulness, scientific ability.",
                "faults": "Lack of imagination and initiative, crudeness, clumsiness, inability to adapt.",
                "description": "Indicates steadiness and endurance. The number of the hard worker and plodder. the 'salt of the earth' who undertake necessary but unpleasant jobs.",
                "harmonies": [1, 2, 7],
                "colors": ["Green"],
                "gems": ["Emerald"],
                "days": ["Monday", "Wednesday"],
                "occupations": ["Builder", "Contractor", "Engineer", "Farmer", "Mechanic", "Draftsman", "Chemist"]
            },
            5: {
                "type": "The VERSATILE or RESTLESS type",
                "symbol": "Jupiter",
                "qualities": "Adaptability, ceaseless activity, versatility, good 'mixers'.",
                "faults": "Changeability, fickleness, dual personality, instability.",
                "description": "Indicates adventure, travel, and experience. Complex personality. Often rolling stones whose wanderings make lives rich in experience.",
                "harmonies": [1, 3, 9], # "All numbers (except 8)", but specialized list derived
                "colors": ["Yellow"],
                "gems": ["Yellow Topaz"],
                "days": ["Thursday", "Saturday"],
                "occupations": ["Traveller", "Salesman", "Reporter", "Detective", "Evaluator", "Speculator", "Guide"]
            },
            6: {
                "type": "The DEPENDABLE or CONSIDERATE type",
                "symbol": "Venus",
                "qualities": "Honesty, reliability, unselfishness, even disposition, domesticity.",
                "faults": "Intolerance of others' imperfections, snobbishness, poor business ability (over-honesty).",
                "description": "Indicates dependability and balance. The backbone of a community. Staunch friends, good citizens, home makers. Perhaps the most fortunate number.",
                "harmonies": [3, 9],
                "colors": ["Orange"],
                "gems": ["Orange Topaz"],
                "days": ["Friday", "Tuesday"],
                "occupations": ["Doctor", "Nurse", "Teacher", "Guardian", "Hotel Manager", "Welfare Worker", "Host/Hostess"]
            },
            7: {
                "type": "The MYSTIC or MELANCHOLY type",
                "symbol": "Saturn",
                "qualities": "Studiousness, inspiration, imagination, stoicism, mental courage, psychic power.",
                "faults": "Melancholy, moodiness, lack of self-expression, craving for solitude, introspection.",
                "description": "Indicates mystery, study, knowledge. Often have a hard time visually but possess deep beauty. The mystic or psychic number.",
                "harmonies": [2, 1, 4],
                "colors": ["Red"],
                "gems": ["Ruby", "Garnet"],
                "days": ["Saturday", "Thursday"],
                "occupations": ["Scientist", "Philosopher", "Clergyman", "Author", "Researcher", "Occultist", "Naturalist"]
            },
            8: {
                "type": "The SUCCESSFUL or POWERFUL type",
                "symbol": "Uranus",
                "qualities": "Practical knowledge, executive ability, business acumen, power of consolidation.",
                "faults": "Self-assertiveness, restricted outlook, lack of imagination, self-satisfaction.",
                "description": "Indicates power, progress, and material success. The number of achievement and acquisition. Combines judgment of 2 with carefulness of 4.",
                "harmonies": [4, 1, 2, 7],
                "colors": ["Grey"],
                "gems": ["Pearl", "Opal"],
                "days": ["Wednesday", "Monday"],
                "occupations": ["Banker", "Financier", "Judge", "Executive", "Organizer", "Manufacturer", "Broker"]
            },
            9: {
                "type": "The UNIVERSAL or MAGNETIC type",
                "symbol": "Neptune",
                "qualities": "Integrity, idealism, creative genius, success without apparent effort, instinctive knowledge.",
                "faults": "Tendency to defer action, impractical ideas, dreaming.",
                "description": "Indicates universal influence and magnetic power. The number of the thinker and artist. Success often comes by accident rather than pursuit.",
                "harmonies": [3, 6],
                "colors": ["Purple"],
                "gems": ["Amethyst"],
                "days": ["Tuesday", "Friday"],
                "occupations": ["Artist", "Healer", "Writer", "Philanthropist", "Reformer", "Actor", "Preacher"]
            }
        }
        
        return profiles.get(fadic_number, {})

    @staticmethod
    def get_destiny_year(fadic_number: int, current_year: int) -> int:
        """
        Calculates the next 'Destiny Year' for the user.
        A Destiny Year is a year that sum-reduces to the Fadic Number.
        """
        # Simple iterative check from current year
        test_year = current_year
        for _ in range(10): # Look ahead 10 years
            s = sum(int(d) for d in str(test_year))
            while s > 9:
                s = sum(int(d) for d in str(s))
            
            if s == fadic_number:
                return test_year
            test_year += 1
            
        return current_year # Fallback

    @staticmethod
    def get_science_of_success_report(name: str, day: int, month: int, year: int) -> Dict[str, Any]:
        """
        Generates the full report.
        """
        import datetime
        current_year = datetime.datetime.now().year
        
        fadic = HilaryNumerologyService.calculate_fadic_number(day, month, year)
        profile = HilaryNumerologyService.get_fadic_profile(fadic)
        next_destiny_year = HilaryNumerologyService.get_destiny_year(fadic, current_year)
        
        return {
            "system_name": "Hilary Gerard's Science of Success (1937)",
            "fadic_number": fadic,
            "fadic_type": profile.get("type", ""),
            "symbol": profile.get("symbol", ""),
            "description": profile.get("description", ""),
            "qualities": {
                "positive": profile.get("qualities", ""),
                "negative": profile.get("faults", "")
            },
            "guidance": {
                "occupations": profile.get("occupations", []),
                "lucky_colors": profile.get("colors", []),
                "lucky_gems": profile.get("gems", []),
                "lucky_days": profile.get("days", []),
                "best_harmonies": profile.get("harmonies", [])
            },
            "next_destiny_year": next_destiny_year,
            "calculated_at": datetime.datetime.now().isoformat()
        }
