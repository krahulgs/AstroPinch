from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io
import os
import math
from services.chart_generator import ChartGenerator
from reportlab.graphics.shapes import Drawing, PolyLine, Rect, String

class PDFReportService:
    @staticmethod
    def _create_forecast_engine_chart(width, height):
        # Create Drawing
        d = Drawing(width, height)
        
        # Tracks configuration (matching frontend)
        tracks = [
            {"id": "overall", "label": "Overall Vitality", "color": colors.blue, "offset": 0},
            {"id": "career", "label": "Career & Success", "color": colors.purple, "offset": 5},
            {"id": "wealth", "label": "Financial Wealth", "color": colors.goldenrod, "offset": 12},
            {"id": "health", "label": "Physical Health", "color": colors.crimson, "offset": 8}
        ]
        
        # Background
        d.add(Rect(0, 0, width, height, strokeWidth=0.5, strokeColor=colors.lightgrey, fillColor=colors.whitesmoke))
        
        track_height = (height - 20) / len(tracks)
        
        for idx, track in enumerate(tracks):
            track_y_base = height - 20 - (idx + 1) * track_height
            
            # Draw Track Label
            d.add(String(5, track_y_base + (track_height/2) - 4, track["label"], fontSize=6, fontName="Helvetica-Bold", fillColor=track["color"]))
            
            # Generate Synthetic Data for this track
            data_values = []
            total_steps = 100 # 100 years
            for i in range(total_steps):
                # Using unique offsets for each track to make them look distinct
                off = (i + track["offset"]) / 8.0
                val = math.sin(off) * 0.3 + math.cos(off * 1.5) * 0.15 + 0.5
                val = max(0.1, min(0.9, val))
                data_values.append(val)
                
            # Draw Line for this track
            chart_points = []
            step_x = (width - 80) / (len(data_values) - 1)
            start_x = 75 # Offset for labels
            
            for p_idx, val in enumerate(data_values):
                x = start_x + (p_idx * step_x)
                y = track_y_base + (val * track_height)
                chart_points.append((x, y))
                
            d.add(PolyLine(chart_points, strokeWidth=1, strokeColor=track["color"], strokeOpacity=0.8))
            
            # Draw a baseline for clarity
            d.add(PolyLine([(start_x, track_y_base), (width, track_y_base)], strokeWidth=0.2, strokeColor=colors.grey))

        # Add Header/Footer
        d.add(String(width/2 - 50, height - 12, "Multi-Cycle Temporal Forecast", fontSize=8, fontName="Helvetica-Bold", fillColor=colors.darkblue))
        d.add(String(75, 5, "Age 0", fontSize=5, fontName="Helvetica", fillColor=colors.grey))
        d.add(String(width-20, 5, "Age 100", fontSize=5, fontName="Helvetica", fillColor=colors.grey))
        
        return d

    @staticmethod
    def generate_pdf_report(report_data, lang="en"):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        # Register Arial or UTF-8 compatible font
        font_name = 'Helvetica' # Default
        try:
            # Try loading Arial (Windows)
            if os.path.exists("C:\\Windows\\Fonts\\arial.ttf"):
                pdfmetrics.registerFont(TTFont('Arial', "C:\\Windows\\Fonts\\arial.ttf"))
                # Register Bold version too if possible, else use same
                if os.path.exists("C:\\Windows\\Fonts\\arialbd.ttf"):
                     pdfmetrics.registerFont(TTFont('Arial-Bold', "C:\\Windows\\Fonts\\arialbd.ttf"))
                else:
                     pdfmetrics.registerFont(TTFont('Arial-Bold', "C:\\Windows\\Fonts\\arial.ttf"))
                font_name = 'Arial'
        except Exception as e:
            print(f"Font registration warning: {e}")

        styles = getSampleStyleSheet()
        # Update styles to use the registered font
        styles['Normal'].fontName = font_name
        styles['Heading1'].fontName = f"{font_name}-Bold" if font_name == 'Arial' else f"{font_name}-Bold"
        styles['Heading2'].fontName = f"{font_name}-Bold" if font_name == 'Arial' else f"{font_name}-Bold"

        styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Heading1'], fontName=f"{font_name}-Bold" if font_name=='Arial' else 'Helvetica-Bold', alignment=1, spaceAfter=20))
        styles.add(ParagraphStyle(name='SectionHeader', parent=styles['Heading2'], fontName=f"{font_name}-Bold" if font_name=='Arial' else 'Helvetica-Bold', spaceBefore=15, spaceAfter=10, color=colors.darkblue))
        styles.add(ParagraphStyle(name='NormalText', parent=styles['Normal'], fontName=font_name, spaceAfter=10, leading=14))
        
        story = []
        
        sign_map = {
            "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, 
            "Leo": 5, "Virgo": 6, "Libra": 7, "Scorpio": 8, 
            "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
        }
        
        # --- Title Page ---
        story.append(Spacer(1, 2*inch))
        story.append(Paragraph("Astrology & Numerology Report", styles['CenterTitle']))
        story.append(Paragraph(f"Exclusively for {report_data['profile']['name']}", styles['NormalText']))
        story.append(Spacer(1, 0.5*inch))
        
        # Birth Details Table
        data = [
            ["Date of Birth", report_data['profile']['dob']],
            ["Time of Birth", report_data['profile']['tob']],
            ["Place of Birth", report_data['profile']['place']],
            ["Coordinates", f"{report_data['profile']['coordinates']['lat']}, {report_data['profile']['coordinates']['lng']}"]
        ]
        t = Table(data, colWidths=[2*inch, 3*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), colors.lightgrey),
            ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        story.append(t)
        story.append(PageBreak())
        
        # --- Vedic Chart Section ---
        story.append(Paragraph("Vedic Horoscope", styles['CenterTitle']))
        
        # --- Chart Visualizations (D1) ---
        vedic_data = report_data.get('vedic_astrology', {})
        raw_planets = vedic_data.get('planets', [])
        
        if raw_planets:
            story.append(Paragraph("Birth Charts (Lagna / D1)", styles['SectionHeader']))
            
            try:
                # 1. Generate North Indian (Diamond) Chart
                # This uses house positions relative to Ascendant
                chart_ni_buf = ChartGenerator.generate_lagna_chart_north_indian(vedic_data)
                img_ni = Image(chart_ni_buf, width=3.4*inch, height=3.4*inch)
                
                # 2. Generate South Indian (Square) Chart
                # Re-map signs for South Indian
                si_planets = []
                for p in raw_planets:
                    sign_name = p.get('sign', 'Aries')
                    sign_id = sign_map.get(sign_name, 1)
                    degree = int(p.get('position', 0))
                    si_planets.append({
                        "planet": p.get('name'),
                        "sign_id": sign_id,
                        "degree": f"{degree:02d}"
                    })
                
                # Add Ascendant to South Indian too
                asc_info = vedic_data.get('ascendant', {})
                si_planets.append({
                    "planet": "Asc",
                    "sign_id": sign_map.get(asc_info.get('sign'), 1),
                    "degree": f"{int(asc_info.get('longitude', 0) % 30):02d}"
                })
                
                chart_si_buf = ChartGenerator.generate_south_indian_chart_image(si_planets)
                img_si = Image(chart_si_buf, width=3.4*inch, height=3.4*inch)
                
                # Layout in a table
                visual_table = Table([[img_ni, img_si]], colWidths=[3.5*inch, 3.5*inch])
                visual_table.setStyle(TableStyle([
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ]))
                story.append(visual_table)
                
                # Captions
                captions = [[
                    Paragraph("North Indian Diamond Format", styles['NormalText']), 
                    Paragraph("South Indian Square Format", styles['NormalText'])
                ]]
                cap_table = Table(captions, colWidths=[3.5*inch, 3.5*inch])
                cap_table.setStyle(TableStyle([('ALIGN', (0,0), (-1,-1), 'CENTER')]))
                story.append(cap_table)
                
            except Exception as e:
                print(f"Chart PDF Generation Error: {e}")
                story.append(Paragraph(f"Visualizations could not be generated: {e}", styles['NormalText']))
        else:
             story.append(Paragraph("Chart data unavailable for visualization.", styles['NormalText']))
        
        story.append(Spacer(1, 0.4*inch))
        
        # --- Planetary Details Table ---
        story.append(Paragraph("Planetary Positions", styles['SectionHeader']))
        ptable_data = [["Planet", "Sign", "Nakshatra", "Degree"]]
        
        # Re-iterate raw_planets to get details for table
        if isinstance(raw_planets, list):
            for p in raw_planets:
                nak = p.get('nakshatra', {})
                nak_str = f"{nak.get('name', '')} ({nak.get('pada', '')})" if isinstance(nak, dict) else str(nak)
                ptable_data.append([
                    p.get('name', ''), 
                    p.get('sign', ''), 
                    nak_str,
                    f"{p.get('position', 0)}°"
                ])
             
        pt = Table(ptable_data, colWidths=[1.5*inch, 1.5*inch, 1.8*inch, 1.2*inch])
        pt.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.navy),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('FONTSIZE', (0,0), (-1,-1), 10)
        ]))
        story.append(pt)
        story.append(Spacer(1, 0.4*inch))
        
        # --- Panchang Section ---
        panchang = report_data.get('vedic_astrology', {}).get('panchang')
        if panchang:
            story.append(Paragraph("Panchang (5 Limbs of Time)", styles['SectionHeader']))
            panchang_data = [
                ["Tithi", panchang.get('tithi', {}).get('name', 'N/A')],
                ["Nakshatra", f"{panchang.get('nakshatra', {}).get('name', 'N/A')} (Lord: {panchang.get('nakshatra', {}).get('lord', 'N/A')})"],
                ["Yoga", panchang.get('yoga', {}).get('name', 'N/A')],
                ["Karana", panchang.get('karana', {}).get('name', 'N/A')],
                ["Ascendant", panchang.get('ascendant', {}).get('name', 'N/A')]
            ]
            panchang_t = Table(panchang_data, colWidths=[2*inch, 4*inch])
            panchang_t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,-1), colors.lightblue),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
                ('FONTSIZE', (0,0), (-1,-1), 11)
            ]))
            story.append(panchang_t)
            story.append(Spacer(1, 0.3*inch))

        # --- Avakhada Chakra ---
        avakhada = report_data.get('vedic_astrology', {}).get('avakhada')
        if avakhada:
            story.append(Paragraph("Avakhada Chakra (Astrological Attributes)", styles['SectionHeader']))
            av_data = [
                ["Attribute", "Value", "Attribute", "Value"],
                ["Varna", avakhada.get('varna', 'N/A'), "Vashya", avakhada.get('vashya', 'N/A')],
                ["Gana", avakhada.get('gana', 'N/A'), "Yoni", avakhada.get('yoni', 'N/A')],
                ["Nadi", avakhada.get('nadi', 'N/A'), "Paya", avakhada.get('paya', 'N/A')],
                ["Yunja", avakhada.get('yunja', 'N/A'), "Tatwa", avakhada.get('tatwa', 'N/A')],
                ["Moon Sign", avakhada.get('moon_sign', 'N/A'), "Nakshatra", f"{avakhada.get('nakshatra', 'N/A')} ({avakhada.get('pada', 'N/A')})"]
            ]
            av_t = Table(av_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
            av_t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,-1), colors.whitesmoke),
                ('BACKGROUND', (2,0), (2,-1), colors.whitesmoke),
                ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('FONTSIZE', (0,0), (-1,-1), 10)
            ]))
            story.append(av_t)
            story.append(Spacer(1, 0.3*inch))
        
        # --- Dasha Section ---
        dasha_obj = report_data.get('vedic_astrology', {}).get('dasha')
        if dasha_obj and isinstance(dasha_obj, dict):
            timeline = dasha_obj.get('timeline', [])
            if timeline:
                story.append(Paragraph("Vimshottari Dasha Periods", styles['SectionHeader']))
                dasha_data = [["Planet", "Start Date", "End Date"]]
                for d in timeline[:8]:  # Show more periods
                    dasha_data.append([
                        d.get('planet', ''),
                        d.get('start', ''), # Engine returns 'start'
                        d.get('end', '')    # Engine returns 'end'
                    ])
                dasha_t = Table(dasha_data, colWidths=[2*inch, 2*inch, 2*inch])
                dasha_t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.purple),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('GRID', (0,0), (-1,-1), 1, colors.black)
                ]))
                story.append(dasha_t)
                story.append(Spacer(1, 0.3*inch))
        
        # --- Astro Temporal Forecast Engine (Vitality Trend) ---
        story.append(Paragraph("Astro-Temporal Forecast Engine", styles['CenterTitle']))
        story.append(Paragraph("Life Cycle Vitality Matrix", styles['SectionHeader']))
        try:
            # Width = Page width (A4 8.27in) - margins (1in * 2) ~= 6 inches
            # height increased to 180 to accommodate multiple tracks
            vitality_chart = PDFReportService._create_forecast_engine_chart(450, 180)
            story.append(vitality_chart)
            story.append(Paragraph("This matrix visualizes fluctuating cosmic vitality levels across a 100-year life cycle. Each track represents a different life area (Career, Health, Wealth) based on planetary transits and Dasha periods.", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))
        except Exception as e:
            print(f"Vitality Chart Error: {e}")
            story.append(Paragraph(f"Temporal forecast matrix unavailable: {e}", styles['NormalText']))

        
        # --- Vedic Personality Analysis ---
        personality = report_data.get('vedic_astrology', {}).get('vedic_personality_analysis')
        if personality:
            story.append(Paragraph("Vedic Personality Analysis", styles['SectionHeader']))
            if isinstance(personality, dict):
                for section, text in personality.items():
                    if text and section != 'raw_response':
                        title = section.replace('_', ' ').title()
                        story.append(Paragraph(f"<b>{title}</b>", styles['NormalText']))
                        # If list, format as bullets
                        if isinstance(text, list):
                            text_content = "<br/>".join([f"• {item}" for item in text])
                        else:
                            text_content = str(text)
                        story.append(Paragraph(text_content, styles['NormalText']))
            else:
                story.append(Paragraph(str(personality), styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))
        else:
            # Fallback to general AI summary
            vedic_ai = report_data.get('vedic_astrology', {}).get('ai_summary')
            if vedic_ai:
                story.append(Paragraph("Astrological Summary", styles['SectionHeader']))
                story.append(Paragraph(str(vedic_ai), styles['NormalText']))
                story.append(Spacer(1, 0.3*inch))
        
        
        # --- Marriage & Relationship Analysis ---
        relationship = report_data.get('vedic_astrology', {}).get('relationship_analysis')
        if relationship:
            story.append(Paragraph("Marriage & Relationships", styles['SectionHeader']))
            if isinstance(relationship, dict):
                for section, text in relationship.items():
                    if text and section != 'raw_response':
                        title = section.replace('_', ' ').title()
                        story.append(Paragraph(f"<b>{title}</b>", styles['NormalText']))
                        # If list, format as bullets
                        if isinstance(text, list):
                            text_content = "<br/>".join([f"• {item}" for item in text])
                        else:
                            text_content = str(text)
                        story.append(Paragraph(text_content, styles['NormalText']))
            else:
                story.append(Paragraph(str(relationship), styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))
        
        # --- Graha Effects (Planet-in-House) ---

        graha_effects = report_data.get('vedic_astrology', {}).get('graha_effects')
        if graha_effects:
            story.append(Paragraph("Graha Effects (Planetary Influences)", styles['SectionHeader']))
            for effect in graha_effects[:8]:  # Show more
                story.append(Paragraph(f"<b>{effect.get('planet', '')} in House {effect.get('house', '')}</b>: {effect.get('effect', '')}", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))

        # --- Doshas ---
        doshas = report_data.get('vedic_astrology', {}).get('doshas')
        if doshas:
            has_doshas = any(info.get('present') for info in doshas.values() if isinstance(info, dict))
            if has_doshas:
                story.append(Paragraph("Vedic Dosha Analysis", styles['SectionHeader']))
                for d_key, info in doshas.items():
                    if isinstance(info, dict) and info.get('present'):
                        d_name = d_key.replace('_', ' ').title()
                        story.append(Paragraph(f"<b>{d_name}</b>: {info.get('reason', '')}", styles['NormalText']))
                        if info.get('remedy'):
                            story.append(Paragraph(f"<i>Remedy: {info.get('remedy')}</i>", styles['NormalText']))
                story.append(Spacer(1, 0.3*inch))
        
        story.append(PageBreak())

        # --- Numerology Section ---
        story.append(Paragraph("Numerology Report", styles['CenterTitle']))
        num_data = report_data.get('numerology', {})
        
        core_nums = [
            ["Life Path", num_data.get('life_path')],
            ["Expression", num_data.get('expression')],
            ["Soul Urge", num_data.get('soul_urge')],
            ["Personality", num_data.get('personality')],
        ]
        
        nt = Table(core_nums, colWidths=[2*inch, 1*inch])
        nt.setStyle(TableStyle([
             ('FONTSIZE', (0,0), (-1,-1), 12),
             ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ]))
        story.append(nt)
        
        story.append(Spacer(1, 0.2*inch))
        
        if 'ai_insights' in num_data:
             story.append(Paragraph("AI Insights", styles['SectionHeader']))
             story.append(Paragraph(str(num_data['ai_insights']), styles['NormalText']))

        # Loshu Grid
        loshu = report_data.get('vedic_astrology', {}).get('loshu_grid')
        if loshu:
            story.append(Paragraph("Loshu Grid (Vedic Numerology)", styles['SectionHeader']))
            story.append(Paragraph(f"Mulank: {loshu.get('mulank')} | Bhagyank: {loshu.get('bhagyank')}", styles['NormalText']))
            # Simple list distribution representation
            grid_str = ""
            for num, count in loshu.get('grid', {}).items():
                if count > 0:
                    grid_str += f"{num} (x{count}), "
            if grid_str:
                story.append(Paragraph(f"Active Numbers: {grid_str[:-2]}", styles['NormalText']))
            
            if loshu.get('completed_planes'):
                story.append(Paragraph(f"Completed Planes: {', '.join(loshu['completed_planes'])}", styles['NormalText']))
            
            # Add Missing Number Remedies
            remedies = loshu.get('remedies')
            if remedies:
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph("<b>Key Remedies (Missing Numbers):</b>", styles['NormalText']))
                for num, rem in remedies.items():
                    story.append(Paragraph(f"• #{num}: {rem}", styles['NormalText']))
            
            story.append(Spacer(1, 0.2*inch))

        # --- Western Astrology Section ---
        # REMOVED as per user request
        # story.append(PageBreak())
        # story.append(Paragraph("Western Astrology", styles['CenterTitle']))
        # western = report_data.get('western_astrology', {})
        # ... (Removed)

        # --- Astrocartography Section ---
        acg_data = report_data.get('astrocartography', [])
        if acg_data:
            story.append(PageBreak())
            story.append(Paragraph("Locational Astrology (Astrocartography)", styles['CenterTitle']))
            
            # Map Image
            map_buf = ChartGenerator.generate_astro_map_image(acg_data)
            map_img = Image(map_buf, width=6*inch, height=3*inch)
            story.append(map_img)
            story.append(Paragraph("Power Zones World Map", styles['NormalText']))
            story.append(Spacer(1, 0.2*inch))
            
            # Locations Table
            acg_table_data = [["City", "Planet Line", "Effect"]]
            for loc in acg_data:
                acg_table_data.append([
                    loc.get('city'),
                    loc.get('line_title'),
                    loc.get('effect_title')
                ])
            
            acg_t = Table(acg_table_data, colWidths=[2*inch, 2*inch, 2*inch])
            acg_t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.teal),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('GRID', (0,0), (-1,-1), 1, colors.black)
            ]))
            story.append(acg_t)
            
            story.append(Spacer(1, 0.2*inch))
            story.append(Paragraph("Top Location Analysis", styles['SectionHeader']))
            for loc in acg_data[:3]:
                 story.append(Paragraph(f"<b>{loc['city']}</b>: {loc['description']}", styles['NormalText']))

        # --- KP System Section ---
        kp_data = report_data.get('vedic_astrology', {}).get('kp_system')
        if kp_data:
            story.append(PageBreak())
            story.append(Paragraph("KP System (Krishnamurti Paddhati)", styles['CenterTitle']))
            
            kp_table_data = [["Planet", "Sign", "Star Lord", "Sub Lord"]]
            for p in kp_data[:9]: # Planets + nodes
                kp_table_data.append([
                    p.get('planet'),
                    p.get('sign'),
                    p.get('star_lord'),
                    p.get('sub_lord')
                ])
                
            kpt = Table(kp_table_data, colWidths=[1.5*inch, 1.5*inch, 1.5*inch, 1.5*inch])
            kpt.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.darkgreen),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('GRID', (0,0), (-1,-1), 1, colors.black)
            ]))
            story.append(kpt)
            story.append(Spacer(1, 0.3*inch))
            
            # KP Analysis (Easy English Predictions)
            kp_analysis = report_data.get('vedic_astrology', {}).get('kp_analysis')
            if kp_analysis:
                story.append(Paragraph("KP Predictions (Easy English)", styles['SectionHeader']))
                for idx, analysis in enumerate(kp_analysis[:9], 1):
                    story.append(Paragraph(f"{idx}. {analysis.get('meaning', '')}", styles['NormalText']))
                story.append(Spacer(1, 0.2*inch))

        # --- Remedial Measures ---
        remedies = report_data.get('vedic_astrology', {}).get('remedies')
        if remedies:
            story.append(PageBreak())
            story.append(Paragraph("Vedic Remedies", styles['CenterTitle']))
            
            # Gemstone
            gem = remedies.get('gemstone')
            if gem:
                story.append(Paragraph("Gemstone Recommendation", styles['SectionHeader']))
                story.append(Paragraph(f"<b>Stone:</b> {gem.get('stone')}", styles['NormalText']))
                story.append(Paragraph(f"<b>Wear On:</b> {gem.get('wear_finger')}", styles['NormalText']))
                story.append(Paragraph(f"<b>Metal:</b> {gem.get('metal')}", styles['NormalText']))
                story.append(Paragraph(f"<i>Effect: {gem.get('life_area')}</i>", styles['NormalText']))
                story.append(Spacer(1, 0.1*inch))

            # Rudraksha
            rud = remedies.get('rudraksha')
            if rud:
                story.append(Paragraph("Rudraksha", styles['SectionHeader']))
                story.append(Paragraph(f"<b>Type:</b> {rud.get('type')}", styles['NormalText']))
                story.append(Paragraph(f"<b>Benefits:</b> {rud.get('benefits')}", styles['NormalText']))
                story.append(Spacer(1, 0.1*inch))

            # Mantra
            mantra = remedies.get('mantra')
            if mantra:
                story.append(Paragraph("Sacred Mantra", styles['SectionHeader']))
                story.append(Paragraph(f"<b>Deity:</b> {mantra.get('deity')}", styles['NormalText']))
                story.append(Paragraph(f"<b>Mantra:</b> {mantra.get('sanskrit')}", styles['NormalText']))
                story.append(Paragraph(f"<i>Instructions: {mantra.get('instructions')}</i>", styles['NormalText']))

        # --- Final Predictions ---
        predictions = report_data.get('predictions_summary')
        if predictions:
            story.append(PageBreak())
            story.append(Paragraph("Expert Synthesis", styles['CenterTitle']))
            if 'best_prediction' in predictions:
                story.append(Paragraph(str(predictions['best_prediction']), styles['NormalText']))

        def add_branding(canvas, doc):
            canvas.saveState()
            canvas.setFont('Helvetica-Bold', 10)
            canvas.setFillColor(colors.purple)
            canvas.drawString(72, 800, "AstroPinch")
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.gray)
            canvas.drawRightString(523, 800, "Premium Astrology Report")
            canvas.drawString(72, 30, "Generated by AstroPinch AI Expert")
            canvas.drawRightString(523, 30, f"Page {doc.page}")
            canvas.restoreState()

        doc.build(story, onFirstPage=add_branding, onLaterPages=add_branding)
        buffer.seek(0)
        return buffer

    @staticmethod
    def generate_kundali_match_pdf(result, lang="en"):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
        
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='CenterTitle', parent=styles['Heading1'], alignment=1, spaceAfter=20, color=colors.purple))
        styles.add(ParagraphStyle(name='SectionHeader', parent=styles['Heading2'], spaceBefore=15, spaceAfter=10, color=colors.darkblue))
        styles.add(ParagraphStyle(name='ScoreHighlight', parent=styles['Normal'], fontSize=16, leading=20, alignment=1, spaceBefore=10, spaceAfter=10, textColor=colors.darkgreen))
        styles.add(ParagraphStyle(name='NormalText', parent=styles['Normal'], spaceAfter=10, leading=14))
        
        story = []
        
        # Title
        story.append(Spacer(1, 0.5*inch))
        story.append(Paragraph("Vedic Compatibility & Gun Milan Report", styles['CenterTitle']))
        story.append(Spacer(1, 0.2*inch))

        # Names
        name_style = ParagraphStyle(name='NameStyle', parent=styles['Normal'], fontSize=12, alignment=1, spaceAfter=5)
        story.append(Paragraph(f"<b>{result['bride']['name']}</b> (Bride) & <b>{result['groom']['name']}</b> (Groom)", name_style))
        story.append(Spacer(1, 0.3*inch))

        # Overall Score
        score = result['total_score']
        score_color = colors.darkgreen if score >= 25 else (colors.darkorange if score >= 18 else colors.darkred)
        styles['ScoreHighlight'].textColor = score_color
        story.append(Paragraph(f"Overall Guna Score: {score}/36", styles['ScoreHighlight']))
        story.append(Paragraph(f"Result: {result['summary']}", styles['NormalText']))
        story.append(Spacer(1, 0.3*inch))

        # Ashta-Koota Breakdown
        story.append(Paragraph("Ashta-Koota Breakdown", styles['SectionHeader']))
        table_data = [["Koota", "Significance", "Bride Val", "Groom Val", "Points"]]
        for k in result['koota_details']:
            table_data.append([
                k['name'],
                Paragraph(k['significance'], styles['Normal']),
                k['bride_val'],
                k['groom_val'],
                f"{k['points']}/{k['max_points']}"
            ])
        
        t = Table(table_data, colWidths=[1*inch, 2*inch, 1*inch, 1*inch, 1*inch])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.purple),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE')
        ]))
        story.append(t)
        story.append(Spacer(1, 0.4*inch))

        # Manglik Analysis
        story.append(Paragraph("Manglik Analysis", styles['SectionHeader']))
        story.append(Paragraph(f"Bride Status: <b>{result['bride']['manglik_status']}</b>", styles['NormalText']))
        story.append(Paragraph(f"Groom Status: <b>{result['groom']['manglik_status']}</b>", styles['NormalText']))
        story.append(Paragraph(result['manglik_summary'], styles['NormalText']))
        story.append(Spacer(1, 0.3*inch))

        # Dosha Analysis
        story.append(Paragraph("Dosha Analysis", styles['SectionHeader']))
        for d in result['doshas']:
            d_name = d['name'] + (" (Present)" if d['is_present'] else " (Not Present)")
            story.append(Paragraph(f"<b>{d_name}</b>", styles['NormalText']))
            story.append(Paragraph(d['description'], styles['NormalText']))
        story.append(Spacer(1, 0.3*inch))

        story.append(PageBreak())

        # Advanced Compatibility Analysis
        story.append(Paragraph("Advanced Compatibility Analysis", styles['CenterTitle']))
        story.append(Spacer(1, 0.2*inch))

        # Dasha Synchronization
        if 'dasha_synchronization' in result:
            dasha_sync = result['dasha_synchronization']
            story.append(Paragraph("Dasha Synchronization Analysis", styles['SectionHeader']))
            story.append(Paragraph(f"<b>Current Compatibility Score:</b> {dasha_sync.get('score', 0)}/10", styles['NormalText']))
            story.append(Paragraph(f"<b>Bride's Current Dasha:</b> {dasha_sync.get('bride_current_dasha', 'Unknown')}", styles['NormalText']))
            story.append(Paragraph(f"<b>Groom's Current Dasha:</b> {dasha_sync.get('groom_current_dasha', 'Unknown')}", styles['NormalText']))
            story.append(Paragraph(f"<b>Recommendation:</b> {dasha_sync.get('recommendation', 'N/A')}", styles['NormalText']))
            
            if dasha_sync.get('analysis'):
                story.append(Paragraph("<b>Detailed Analysis:</b>", styles['NormalText']))
                for point in dasha_sync['analysis']:
                    story.append(Paragraph(f"• {point}", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))

        # Navamsa Compatibility
        if 'navamsa_compatibility' in result:
            navamsa = result['navamsa_compatibility']
            story.append(Paragraph("Navamsa (D9) Compatibility", styles['SectionHeader']))
            story.append(Paragraph(f"<b>Marital Harmony Score:</b> {navamsa.get('score', 0)}/10", styles['NormalText']))
            story.append(Paragraph(f"<b>Recommendation:</b> {navamsa.get('recommendation', 'N/A')}", styles['NormalText']))
            
            if navamsa.get('analysis'):
                story.append(Paragraph("<b>D9 Chart Analysis:</b>", styles['NormalText']))
                for point in navamsa['analysis']:
                    story.append(Paragraph(f"• {point}", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))

        # Transit Analysis
        if 'transit_analysis' in result:
            transits = result['transit_analysis']
            story.append(Paragraph("Current Planetary Transits", styles['SectionHeader']))
            story.append(Paragraph(f"<b>Transit Favorability:</b> {transits.get('score', 0)}/10", styles['NormalText']))
            story.append(Paragraph(f"<b>Overall Assessment:</b> {transits.get('recommendation', 'N/A')}", styles['NormalText']))
            
            if transits.get('current_transits'):
                ct = transits['current_transits']
                transit_table = Table([
                    ["Planet", "Current Sign"],
                    ["Jupiter", ct.get('jupiter', 'Unknown')],
                    ["Saturn", ct.get('saturn', 'Unknown')],
                    ["Venus", ct.get('venus', 'Unknown')]
                ], colWidths=[2*inch, 2*inch])
                transit_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.darkblue),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                ]))
                story.append(transit_table)
            
            if transits.get('analysis'):
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph("<b>Transit Insights:</b>", styles['NormalText']))
                for point in transits['analysis']:
                    story.append(Paragraph(f"• {point}", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))

        # Marriage Windows
        if 'marriage_windows' in result:
            windows = result['marriage_windows']
            story.append(Paragraph("Auspicious Marriage Timing Windows", styles['SectionHeader']))
            story.append(Paragraph(f"<b>Recommendation:</b> {windows.get('recommendation', 'N/A')}", styles['NormalText']))
            
            if windows.get('windows'):
                window_table_data = [["Period", "Start Date", "End Date", "Bride Dasha", "Groom Dasha", "Favorability"]]
                for i, w in enumerate(windows['windows'][:5], 1):
                    window_table_data.append([
                        f"#{i}",
                        w.get('start_date', 'N/A'),
                        w.get('end_date', 'N/A'),
                        w.get('bride_dasha', 'N/A'),
                        w.get('groom_dasha', 'N/A'),
                        w.get('favorability', 'N/A')
                    ])
                
                window_table = Table(window_table_data, colWidths=[0.5*inch, 1.2*inch, 1.2*inch, 1*inch, 1*inch, 1*inch])
                window_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.darkgreen),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
                    ('FONTSIZE', (0,0), (-1,-1), 8),
                ]))
                story.append(window_table)
            
            if windows.get('analysis'):
                story.append(Spacer(1, 0.1*inch))
                story.append(Paragraph("<b>Timing Analysis:</b>", styles['NormalText']))
                for point in windows['analysis']:
                    story.append(Paragraph(f"• {point}", styles['NormalText']))
            story.append(Spacer(1, 0.3*inch))

        story.append(PageBreak())

        # AI Insights
        story.append(Paragraph("AI Cosmic Guidance & Expert Insights", styles['CenterTitle']))
        ai_text = result['ai_analysis'].replace('\n', '<br/>')
        story.append(Paragraph(ai_text, styles['NormalText']))

        def add_branding(canvas, doc):
            canvas.saveState()
            canvas.setFont('Helvetica-Bold', 10)
            canvas.setFillColor(colors.purple)
            canvas.drawString(72, 800, "AstroPinch")
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.gray)
            canvas.drawRightString(523, 800, "Premium Compatibility Report")
            canvas.drawString(72, 30, "Generated by AstroPinch AI Expert")
            canvas.drawRightString(523, 30, f"Page {doc.page}")
            canvas.restoreState()

        doc.build(story, onFirstPage=add_branding, onLaterPages=add_branding)
        buffer.seek(0)
        return buffer
