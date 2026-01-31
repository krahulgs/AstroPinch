from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import io
import os
from services.chart_generator import ChartGenerator

class PDFReportService:
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
        
        # --- Career Analysis ---
        career = report_data.get('vedic_astrology', {}).get('career_analysis')
        if career:
            story.append(Paragraph("Career & Professional Path", styles['SectionHeader']))
            if isinstance(career, dict):
                for section, text in career.items():
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
                story.append(Paragraph(str(career), styles['NormalText']))
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
            story.append(Spacer(1, 0.2*inch))

        # --- Western Astrology Section ---
        story.append(PageBreak())
        story.append(Paragraph("Western Astrology", styles['CenterTitle']))
        western = report_data.get('western_astrology', {})
        
        # Western Chart Image
        if western:
             try:
                 w_chart_buf = ChartGenerator.generate_western_chart_image(western)
                 w_img = Image(w_chart_buf, width=5*inch, height=5*inch)
                 story.append(w_img)
                 story.append(Paragraph("Tropical Placidus Chart", styles['NormalText']))
             except Exception as e:
                 print(f"Western Chart PDF Error: {e}")
                 story.append(Paragraph("Western Chart unavailable.", styles['NormalText']))
             story.append(Spacer(1, 0.2*inch))

        if western and 'sun_sign' in western:
            story.append(Paragraph(f"Sun Sign: {western.get('sun_sign')}", styles['SectionHeader']))
            story.append(Paragraph(f"Moon Sign: {western.get('moon_sign')}", styles['NormalText']))
            story.append(Paragraph(f"Ascendant: {western.get('ascendant')}", styles['NormalText']))
            
            if 'ai_summary' in western:
                 story.append(Spacer(1, 0.2*inch))
                 story.append(Paragraph("Personality Analysis", styles['SectionHeader']))
                 story.append(Paragraph(str(western['ai_summary']), styles['NormalText']))
            
            # Western Planetary Positions Table
            if 'planets' in western:
                story.append(Spacer(1, 0.3*inch))
                story.append(Paragraph("Planetary Positions (Tropical)", styles['SectionHeader']))
                w_planet_data = [["Planet", "Sign", "House", "Position"]]
                for p in western.get('planets', [])[:10]:
                    sign_name = p.get('sign', '')
                    if isinstance(sign_name, dict):
                        sign_name = sign_name.get('name', '')
                    w_planet_data.append([
                        p.get('name', ''),
                        sign_name,
                        str(p.get('house', '')),
                        f"{p.get('position', 0):.2f}°"
                    ])
                w_pt = Table(w_planet_data, colWidths=[1.5*inch, 1.5*inch, 1*inch, 1.5*inch])
                w_pt.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.darkblue),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                    ('GRID', (0,0), (-1,-1), 1, colors.black),
                    ('FONTSIZE', (0,0), (-1,-1), 9)
                ]))
                story.append(w_pt)

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
            canvas.drawString(72, 800, "AstroPinch") # Top Left
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.gray)
            canvas.drawRightString(523, 800, "Cosmic Intelligence Report") # Top Right
            
            # Footer
            canvas.setFont('Helvetica', 8)
            canvas.setFillColor(colors.gray)
            canvas.drawString(72, 30, "Generated by AstroPinch AI")
            canvas.drawRightString(523, 30, f"Page {doc.page}")
            canvas.restoreState()

        doc.build(story, onFirstPage=add_branding, onLaterPages=add_branding)
        buffer.seek(0)
        return buffer
