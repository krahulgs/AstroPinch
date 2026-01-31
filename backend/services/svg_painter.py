import math

class SVGPainter:
    ZODIAC_SIGNS = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    
    COLORS = {
        "bg_glow": "#1e1b4b",
        "rim": "#334155",
        "line": "rgba(255, 255, 255, 0.1)",
        "accent": "#a855f7",
        "text": "#cbd5e1",
        "planets": {
            "Sun": "#fbbf24", "Moon": "#e2e8f0", 
            "Mercury": "#94a3b8", "Venus": "#f472b6", 
            "Mars": "#ef4444", "Jupiter": "#fb923c", 
            "Saturn": "#4ade80", "Uranus": "#22d3ee", 
            "Neptune": "#6366f1", "Pluto": "#a855f7"
        }
    }

    @staticmethod
    def draw_chart(planets, chart_title="Natal Chart"):
        size = 400
        center = size / 2
        radius = 180
        
        svg = [f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">']
        
        # 1. Background Glow & Circles
        svg.append(f'<circle cx="{center}" cy="{center}" r="{radius}" fill="{SVGPainter.COLORS["bg_glow"]}" stroke="{SVGPainter.COLORS["rim"]}" stroke-width="2" />')
        svg.append(f'<circle cx="{center}" cy="{center}" r="{radius * 0.7}" fill="none" stroke="{SVGPainter.COLORS["line"]}" />')
        
        # 2. Draw Zodiac Segments (30 degrees each)
        for i, sign in enumerate(SVGPainter.ZODIAC_SIGNS):
            angle_start = i * 30
            angle_end = (i + 1) * 30
            
            # Draw segment lines
            x1, y1 = SVGPainter._polar_to_cartesian(center, center, radius, angle_start)
            x2, y2 = SVGPainter._polar_to_cartesian(center, center, radius * 0.7, angle_start)
            svg.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{SVGPainter.COLORS["line"]}" />')
            
            # Draw Sign Text (simplified abbreviation)
            text_angle = angle_start + 15
            tx, ty = SVGPainter._polar_to_cartesian(center, center, radius * 0.85, text_angle)
            svg.append(f'<text x="{tx}" y="{ty}" fill="{SVGPainter.COLORS["text"]}" font-size="10" text-anchor="middle" dominant-baseline="middle" font-family="Arial">{sign[:3].upper()}</text>')

        # 3. Place Planets
        for p in planets:
            p_name = p['name']
            # Convert longitude to SVG angle (0 Aries is usually at 9 o'clock or 3 o'clock depending on convention)
            # In our math, 0 deg is right (3 o'clock), we rotate counter-clockwise like standard astro
            p_angle = p['longitude']
            
            # Planet point
            px, py = SVGPainter._polar_to_cartesian(center, center, radius * 0.5, p_angle)
            p_color = SVGPainter.COLORS['planets'].get(p_name, "#fff")
            
            svg.append(f'<circle cx="{px}" cy="{py}" r="4" fill="{p_color}" />')
            
            # Planet label
            lx, ly = SVGPainter._polar_to_cartesian(center, center, radius * 0.4, p_angle)
            svg.append(f'<text x="{lx}" y="{ly}" fill="{p_color}" font-size="8" text-anchor="middle" font-family="Arial">{p_name[:2].upper()}</text>')

        # 4. Central Label
        svg.append(f'<text x="{center}" y="{center}" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="Arial">{chart_title}</text>')
        
        svg.append('</svg>')
        return "".join(svg)

    @staticmethod
    def _polar_to_cartesian(cx, cy, r, angle_deg):
        # Invert angle because SVG y grows downward
        angle_rad = math.radians(-angle_deg)
        return cx + r * math.cos(angle_rad), cy + r * math.sin(angle_rad)
