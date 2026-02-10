import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import matplotlib.patches as patches
import io
import numpy as np

class ChartGenerator:
    @staticmethod
    def _draw_south_indian_chart(ax, planets, signs):
        """
        Draws a South Indian Chart (Square format, signs fixed)
        """
        # Outer Border
        ax.set_xlim(0, 4)
        ax.set_ylim(0, 4)
        ax.axis('off')
        
        # Main square
        rect = patches.Rectangle((0, 0), 4, 4, linewidth=2, edgecolor='black', facecolor='none')
        ax.add_patch(rect)
        
        # Inner square (implied by grid lines)
        # Horizontal lines
        ax.plot([0, 4], [1, 1], color='black', linewidth=1)
        ax.plot([0, 4], [3, 3], color='black', linewidth=1)
        ax.plot([1, 3], [2, 2], color='black', linewidth=1) # Middle horizontal parts
        
        # Vertical lines
        ax.plot([1, 1], [0, 4], color='black', linewidth=1)
        ax.plot([3, 3], [0, 4], color='black', linewidth=1)
        ax.plot([2, 2], [1, 3], color='black', linewidth=1) # Middle vertical parts

        # Clear center
        center_rect = patches.Rectangle((1, 1), 2, 2, linewidth=0, facecolor='white', zorder=10)
        # ax.add_patch(center_rect) # Actually we want lines to stop at center, but painting over is easier if zorder works
        # Re-draw border of center hole
        ax.plot([1, 3], [1, 1], color='black', linewidth=1)
        ax.plot([1, 3], [3, 3], color='black', linewidth=1)
        ax.plot([1, 1], [1, 3], color='black', linewidth=1)
        ax.plot([3, 3], [1, 3], color='black', linewidth=1)
        
        # Map signs to grid positions (South Indian: Aries is always 2nd box top row, moves clockwise? No.)
        # South Indian Chart: Fixed Signs
        # Pisces  | Aries   | Taurus  | Gemini
        # Aquarius|         |         | Cancer
        # Capricorn|        |         | Leo
        # Sagittarius| Scorpio | Libra   | Virgo
        
        # Coordinates (x, y) - 0,0 is bottom left
        # Pisces: (0, 3) -> Box (0,3) to (1,4)
        # Aries: (1, 3)
        # Taurus: (2, 3)
        # Gemini: (3, 3)
        
        # Cancer: (3, 2)
        # Leo: (3, 1)
        # Virgo: (3, 0)
        
        # Libra: (2, 0)
        # Scorpio: (1, 0)
        # Sagittarius: (0, 0)
        
        # Capricorn: (0, 1)
        # Aquarius: (0, 2)
        
        pos_map = {
            1: (1.5, 3.5), # Aries
            2: (2.5, 3.5), # Taurus
            3: (3.5, 3.5), # Gemini
            4: (3.5, 2.5), # Cancer
            5: (3.5, 1.5), # Leo
            6: (3.5, 0.5), # Virgo
            7: (2.5, 0.5), # Libra
            8: (1.5, 0.5), # Scorpio
            9: (0.5, 0.5), # Sagittarius
            10: (0.5, 1.5), # Capricorn
            11: (0.5, 2.5), # Aquarius
            12: (0.5, 3.5), # Pisces
        }
        
        sign_names = {
            1: "Ar", 2: "Ta", 3: "Ge", 4: "Cn", 5: "Le", 6: "Vi",
            7: "Li", 8: "Sc", 9: "Sg", 10: "Cp", 11: "Aq", 12: "Pi"
        }

        # Place Sign Labels (Corner)
        for sign_id, (x, y) in pos_map.items():
            ax.text(x - 0.4, y + 0.35, sign_names[sign_id], fontsize=8, color='gray', ha='left', va='top')

        # Place Planets
        # planets dict: { "Sun": 1 (Aries), "Moon": 5 (Leo)... }
        # Need to organize by sign
        pl_by_sign = {i: [] for i in range(1, 13)}
        
        # Handling different planest input formats. 
        # format: [{'name': 'Sun', 'sign_id': 1}, ...] or {'Sun': 1}
        # Assuming list of dicts with 'name' and 'sign_id' (1-12) or 'sign' (name)
        # Let's support list of dicts: {'planet': 'Sun', 'sign_id': 1}
        
        for p in planets:
            # Shorten planet names
            p_full_name = p.get('planet') or p.get('name') or "Unknown"
            p_name = str(p_full_name)[:2]
            if p_full_name == 'Jupiter': p_name = 'Ju'
            elif p_full_name == 'Saturn': p_name = 'Sa'
            elif p_full_name == 'Mars': p_name = 'Ma'
            elif p_full_name == 'Mercury': p_name = 'Me'
            elif p_full_name == 'Venus': p_name = 'Ve'
            elif p_full_name == 'Rahu': p_name = 'Ra'
            elif p_full_name == 'Ketu': p_name = 'Ke'
            elif p_full_name in ['Ascendant', 'Lagna']: p_name = 'Asc'
            elif p_full_name == 'Uranus': p_name = 'Ur'
            elif p_full_name == 'Neptune': p_name = 'Ne'
            elif p_full_name == 'Pluto': p_name = 'Pl'
            
            # Add degree if available
            p_degree = p.get('degree', '')
            if p_degree:
                p_name = f"{p_name}{p_degree}"
            
            sid = p.get('sign_id')
            if sid:
                pl_by_sign[sid].append(p_name)
        
        for sign_id, pls in pl_by_sign.items():
            if not pls: continue
            x, y = pos_map[sign_id]
            # Center text in box
            # multi-line string
            s_text = "\n".join(pls)
            ax.text(x, y, s_text, fontsize=9, weight='bold', ha='center', va='center')


    @staticmethod
    def generate_south_indian_chart_image(planets):
        """
        Generates a PNG bytes buffer for South Indian Chart
        planets: list of dicts [{'planet': 'Sun', 'sign_id': 1}, ...]
        """
        fig = Figure(figsize=(6, 6))
        FigureCanvas(fig) # Attach canvas
        ax = fig.add_subplot(111)
        
        ChartGenerator._draw_south_indian_chart(ax, planets, None)
        
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
        buf.seek(0)
        return buf

    @staticmethod
    def generate_western_chart_image(western_data):
        """
        Generates a simplified Western Wheel Chart (Polar)
        western_data: dict containing 'planets' (list) and 'houses' (list)
        """
        try:
            fig = Figure(figsize=(8, 8))
            FigureCanvas(fig)
            ax = fig.add_subplot(111, projection='polar')
            
            # 1. Draw Zodiac Ring
            # 12 sectors
            theta = np.linspace(0, 2*np.pi, 13)
            # Colors for signs (Fire, Earth, Air, Water)
            colors = ['#FFCCCC', '#CCFFCC', '#E6E6FA', '#CCF2FF'] * 3
            
            # Bars for signs (outer ring)
            ax.bar(theta[:-1], 1, width=2*np.pi/12, bottom=2, color=colors, alpha=0.5, edgecolor='gray')
            
            # Sign Labels
            sign_names = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"]
            for i, name in enumerate(sign_names):
                angle = (i * 30 + 15) * (np.pi / 180)
                ax.text(angle, 2.5, name, ha='center', va='center', fontsize=10, fontweight='bold')
                
            # 2. Plot Planets
            # Need to convert planet longitude (0-360) to radians
            
            planets = western_data.get('planets', [])
            sign_map = {n: i for i, n in enumerate(["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"])}
            
            for p in planets:
                p_name = p['name'][:2]
                sign_str = p.get('sign','')
                if isinstance(sign_str, dict): sign_str = sign_str.get('name')
                
                # Check for absolute position if available, else derive
                sign_idx = sign_map.get(sign_str, 0)
                deg_in_sign = float(p.get('position', 0))
                abs_deg = sign_idx * 30 + deg_in_sign
                
                # Convert to radians for polar plot
                angle_rad = abs_deg * (np.pi / 180)
                
                # Plot line from center
                ax.plot([angle_rad, angle_rad], [1, 2], color='black', alpha=0.3, linestyle='-')
                # Plot marker
                ax.plot(angle_rad, 1.5, 'o', color='navy')
                # Text
                ax.text(angle_rad, 1.3, p_name, color='black', fontsize=8, ha='center', va='center', weight='bold')

            # 3. Draw Houses (Cusps) if available
            houses = western_data.get('houses', [])
            try:
                for h in houses:
                    # h usually has 'degree' (absolute)
                    deg = float(h.get('degree', 0))
                    angle_rad = deg * (np.pi / 180)
                    ax.plot([angle_rad, angle_rad], [0, 2], color='red', alpha=0.4, linestyle='--')
            except Exception as e:
                # Fallback if house data malformed
                pass

            ax.set_yticklabels([])
            ax.set_xticklabels([])
            ax.grid(False)
            ax.spines['polar'].set_visible(False)
            
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
            buf.seek(0)
            return buf
        except Exception as e:
            print(f"Western Chart Error: {e}")
            # Return empty 1x1 image on error
            fig = Figure(figsize=(1, 1))
            FigureCanvas(fig)
            buf = io.BytesIO()
            fig.savefig(buf, format='png')
            buf.seek(0)
            return buf

    @staticmethod
    def generate_astro_map_image(locations):
        """
        Generates a World Map scatter plot of Power Zones
        locations: list of dicts {'city': 'Name', 'lat': 0, 'lng': 0, ...}
        """
        try:
            fig = Figure(figsize=(10, 5))
            FigureCanvas(fig)
            ax = fig.add_subplot(111)
            
            # Background - Light Blue
            ax.set_facecolor('#e6f3ff')
            ax.set_xlim(-180, 180)
            ax.set_ylim(-90, 90)
            ax.set_aspect('equal')
            
            # Draw Simple Grid/Continents? Hard without data.
            # Just grid lines
            ax.grid(True, linestyle='--', alpha=0.5, color='white')
            ax.axhline(0, color='gray', alpha=0.3) # Equator
            ax.axvline(0, color='gray', alpha=0.3) # Prime Meridian
            
            # Plot Points
            for loc in locations:
                lat = loc.get('lat', 0)
                lng = loc.get('lng', 0)
                city = loc.get('city', 'Unknown')
                planet = loc.get('planet', '')
                
                ax.plot(lng, lat, 'o', color='red', markersize=8, transform=ax.transData)
                ax.text(lng + 3, lat + 3, f"{city}\n({planet})", fontsize=8, color='darkblue', weight='bold')

            ax.set_title("Astrocartography Power Zones", fontsize=12)
            ax.set_xlabel("Longitude")
            ax.set_ylabel("Latitude")
            
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
            buf.seek(0)
            return buf
        except Exception as e:
            print(f"Map Gen Error: {e}")
            fig = Figure(figsize=(1, 1))
            FigureCanvas(fig)
            buf = io.BytesIO()
            fig.savefig(buf, format='png')
            buf.seek(0)
            return buf

    @staticmethod
    def generate_north_indian_chart(planets, ascendant_house=1):
        """
        Generates North Indian Diamond Chart
        In North Indian style, houses are fixed and signs rotate based on ascendant
        planets: list of dicts [{'planet': 'Sun', 'house': 1}, ...]
        ascendant_house: which house number contains the ascendant (usually 1)
        """
        fig = Figure(figsize=(7, 7))
        FigureCanvas(fig)
        ax = fig.add_subplot(111)
        
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.axis('off')
        
        # Draw the diamond structure
        # Outer square
        rect = patches.Rectangle((0, 0), 10, 10, linewidth=2, edgecolor='black', facecolor='white')
        ax.add_patch(rect)
        
        # Main diagonals
        ax.plot([0, 10], [0, 10], color='black', linewidth=1.5)
        ax.plot([0, 10], [10, 0], color='black', linewidth=1.5)
        
        # Diamond lines (connecting midpoints)
        ax.plot([5, 0], [10, 5], color='black', linewidth=1.5)  # Top to Left
        ax.plot([0, 5], [5, 0], color='black', linewidth=1.5)   # Left to Bottom
        ax.plot([5, 10], [0, 5], color='black', linewidth=1.5)  # Bottom to Right
        ax.plot([10, 5], [5, 10], color='black', linewidth=1.5) # Right to Top
        
        # North Indian house positions (fixed layout)
        # House 1 is always at top center. Counting is Anti-Clockwise.
        house_positions = {
            1: (5, 8.5),      # Top center
            2: (2.5, 8.5),    # Top left
            3: (1.5, 7.5),    # Left top
            4: (1.5, 5),      # Left center
            5: (1.5, 2.5),    # Left bottom
            6: (2.5, 1.5),    # Bottom left
            7: (5, 1.5),      # Bottom center
            8: (7.5, 1.5),    # Bottom right
            9: (8.5, 2.5),    # Right bottom
            10: (8.5, 5),     # Right center
            11: (8.5, 7.5),   # Right top
            12: (7.5, 8.5),   # Top right
        }
        
        # Draw house numbers (small, in corners)
        for house_num, (x, y) in house_positions.items():
            ax.text(x, y + 0.6, str(house_num), fontsize=7, color='gray', 
                   ha='center', va='center', style='italic')
        
        # Group planets by house
        planets_by_house = {i: [] for i in range(1, 13)}
        for p in planets:
            house = p.get('house', 1)
            p_name = p.get('planet', p.get('name', ''))
            p_degree = p.get('degree', '')  # Get degree if available
            
            # Shorten planet names
            if p_name == 'Jupiter': p_name = 'Ju'
            elif p_name == 'Saturn': p_name = 'Sa'
            elif p_name == 'Mars': p_name = 'Ma'
            elif p_name == 'Mercury': p_name = 'Me'
            elif p_name == 'Venus': p_name = 'Ve'
            elif p_name == 'Rahu': p_name = 'Ra'
            elif p_name == 'Ketu': p_name = 'Ke'
            elif p_name in ['Ascendant', 'Lagna']: p_name = 'Asc'
            elif p_name == 'Uranus': p_name = 'Ur'
            elif p_name == 'Neptune': p_name = 'Ne'
            elif p_name == 'Pluto': p_name = 'Pl'
            elif len(p_name) > 2: p_name = p_name[:2]
            
            # Add degree if available
            if p_degree:
                planet_text = f"{p_name}{p_degree}"
            else:
                planet_text = p_name
                
            planets_by_house[house].append(planet_text)
        
        # Place planets in houses
        for house_num, planet_list in planets_by_house.items():
            if not planet_list:
                continue
            x, y = house_positions[house_num]
            planet_text = '\n'.join(planet_list)
            ax.text(x, y - 0.2, planet_text, fontsize=8, weight='bold', 
                   ha='center', va='center', color='darkblue')
        
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight', dpi=120)
        buf.seek(0)
        return buf

    @staticmethod
    def generate_lagna_chart_north_indian(planets_data):
        """
        Generate Lagna (D1) chart in North Indian style
        planets_data: dict with 'planets' list and 'ascendant' info
        """
        planets = []
        for p in planets_data.get('planets', []):
            # Get planet degree (position in sign)
            degree = p.get('position')
            try:
                degree_str = f"{int(float(degree)):02d}" if degree is not None else ""
            except (ValueError, TypeError):
                degree_str = ""
            
            planets.append({
                'planet': p.get('name', p.get('planet', '')),
                'house': p.get('house', 1),
                'degree': degree_str
            })
        
        # Add ascendant marker with degree
        asc_house = 1  # Ascendant is always in house 1
        asc_long = planets_data.get('ascendant', {}).get('longitude')
        try:
            asc_degree = float(asc_long or 0) % 30
            asc_degree_str = f"{int(asc_degree):02d}"
        except (ValueError, TypeError):
            asc_degree_str = "00"
        planets.append({'planet': 'Asc', 'house': asc_house, 'degree': asc_degree_str})
        
        return ChartGenerator.generate_north_indian_chart(planets, asc_house)

    @staticmethod
    def generate_navamsa_chart_north_indian(navamsa_data):
        """
        Generate Navamsa (D9) chart in North Indian style
        navamsa_data: dict with D9 planet positions
        """
        planets = []
        d9_planets = navamsa_data.get('D9', [])
        
        for p in d9_planets:
            planets.append({
                'planet': p.get('name', ''),
                'house': p.get('house', 1)
            })
        
        return ChartGenerator.generate_north_indian_chart(planets)

    @staticmethod
    def generate_lagna_chart_south_indian(planets_data):
        """
        Generate Lagna (D1) chart in South Indian style
        planets_data: dict with 'planets' list
        """
        planets = []
        for p in planets_data.get('planets', []):
            # Get sign index (1-12)
            sign = p.get('sign', '')
            sign_map = {
                'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
                'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
                'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
            }
            sign_id = sign_map.get(sign, 1)
            
            # Get planet degree
            degree = p.get('position')
            try:
                degree_str = f"{int(float(degree)):02d}" if degree is not None else ""
            except (ValueError, TypeError):
                degree_str = ""
            
            planets.append({
                'planet': p.get('name', p.get('planet', '')),
                'sign_id': sign_id,
                'degree': degree_str
            })
        
        # Add ascendant with degree
        asc_sign = planets_data.get('ascendant', {}).get('sign', 'Aries')
        asc_degree = planets_data.get('ascendant', {}).get('longitude', 0) % 30
        asc_degree_str = f"{int(asc_degree):02d}"
        planets.append({
            'planet': 'Asc',
            'sign_id': sign_map.get(asc_sign, 1),
            'degree': asc_degree_str
        })
        
        return ChartGenerator.generate_south_indian_chart_image(planets)

    @staticmethod
    def generate_navamsa_chart_south_indian(navamsa_data):
        """
        Generate Navamsa (D9) chart in South Indian style
        navamsa_data: dict with D9 planet positions
        """
        planets = []
        d9_planets = navamsa_data.get('D9', [])
        
        sign_map = {
            'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
            'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
            'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
        }
        
        for p in d9_planets:
            sign = p.get('sign', 'Aries')
            planets.append({
                'planet': p.get('name', ''),
                'sign_id': sign_map.get(sign, 1)
            })
        
        return ChartGenerator.generate_south_indian_chart_image(planets)
