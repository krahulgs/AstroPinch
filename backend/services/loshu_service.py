"""
Loshu Grid Service (AstroArunPandit Style)
Implements the 3x3 Magic Square of Saturn (Loshu Grid) 
with Plane Analysis, Kua Number, and Remedies.
"""

class LoshuService:
    @staticmethod
    def calculate_loshu_grid(day, month, year, gender="male"):
        """
        Calculates the Loshu Grid and associated numerology details.
        """
        dob_str = f"{day:02d}{month:02d}{year}"
        
        # 1. Calculate Mulank (Driver) & Bhagyank (Conductor)
        mulank = LoshuService._reduce_number(day)
        bhagyank = LoshuService._reduce_number(sum(int(d) for d in dob_str))
        
        # 2. Calculate Kua Number
        kua = LoshuService._calculate_kua_number(year, gender)
        
        # 3. Populate Grid (include Mulank, Bhagyank, Kua? 
        # Note: Different systems vary. AstroArunPandit typically uses DOB digits only for the base grid,
        # but the Mulank/Bhagyank heavily influence the reading. 
        # Standard Loshu uses ONLY digits from DOB. 
        # However, improved 'Golden' grids often include Mulank/Bhagyank. 
        # We will count DOB digits primarily.)
        
        grid_counts = {i: 0 for i in range(1, 10)}
        
        # Count from DOB
        for char in dob_str:
            if char.isdigit() and char != '0':
                grid_counts[int(char)] += 1
                
        # 4. Check Planes (Yogas)
        planes = {
            "Mental Plane (4-9-2)": [4, 9, 2],
            "Emotional Plane (3-5-7)": [3, 5, 7],
            "Practical Plane (8-1-6)": [8, 1, 6],
            "Thought Plane (4-3-8)": [4, 3, 8],
            "Will Plane (9-5-1)": [9, 5, 1],
            "Action Plane (2-7-6)": [2, 7, 6],
            "Golden Line (4-5-6)": [4, 5, 6],
            "Silver Line (2-5-8)": [2, 5, 8]
        }
        
        completed_planes = []
        for name, nums in planes.items():
            if all(grid_counts[n] > 0 for n in nums):
                completed_planes.append(name)
                
        # 5. Missing Numbers
        missing_numbers = [n for n, count in grid_counts.items() if count == 0]
        
        return {
            "mulank": mulank,
            "bhagyank": bhagyank,
            "kua": kua,
            "grid": grid_counts,
            "completed_planes": completed_planes,
            "missing_numbers": missing_numbers,
            "remedies": LoshuService._get_remedies(missing_numbers)
        }

    @staticmethod
    def _reduce_number(n):
        """Reduces a number to a single digit (1-9), except maybe master numbers? 
        AstroArunPandit uses 1-9 for Mulank/Bhagyank generally."""
        while n > 9:
            n = sum(int(d) for d in str(n))
        return n

    @staticmethod
    def _calculate_kua_number(year, gender):
        """
        Calculate Kua Number.
        Male: 11 - (Sum of Year Digits reduced)
        Female: (Sum of Year Digits reduced) + 4
        """
        year_sum = LoshuService._reduce_number(year)
        
        if gender.lower() == 'female':
            res = year_sum + 4
        else:
            res = 11 - year_sum
            
        res = LoshuService._reduce_number(res)
        if res == 0: res = 9 # Valid correction? Usually 1-9.
        return res

    @staticmethod
    def _get_remedies(missing_numbers):
        """Returns remedies for missing numbers (AstroArunPandit style)"""
        remedy_db = {
            1: "Keep a small aquarium in the North direction or carry a red handkerchief.",
            2: "Respect mother figures and wear a silver ring/chain.",
            3: "Wear a Rudraksha or respect teachers/elders. Use yellow more often.",
            4: "Use a wooden pen or keep a Tulsi plant. Avoid blue/black clothes.",
            5: "Balance your center. Spend time in nature (greenery).",
            6: "Wear a golden watch or bracelet. Respect female figures.",
            7: "Wear a silver watch or bracelet. Feed stray dogs.",
            8: "Help the underprivileged. Carry a crystal or use energetic crystals.",
            9: "Wear a red thread (Kalava) on the wrist. Avoid anger."
        }
        
        results = {}
        for n in missing_numbers:
            results[n] = remedy_db.get(n, "Balance your energy.")
        return results

