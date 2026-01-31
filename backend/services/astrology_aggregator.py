import random
from services.kerykeion_engine import KerykeionService

from services.kundali_painter import KundaliPainter

class AstrologyAggregator:
    @staticmethod
    def get_aggregated_best_prediction(name, year, month, day, hour, minute, city, lat, lng, timezone, lang="en", context=None, vedic_data=None, numerology_data=None, western_data=None):
        """
        Combines insights from multiple astrological systems with localization.
        """
        if not western_data:
            western_data = KerykeionService.calculate_chart(name, year, month, day, hour, minute, city, lat, lng, timezone)
        
        if not western_data:
            # Fallback for when calculation fails
            western_data = {
                'sun_sign': 'Aries',
                'ascendant': 'Leo'
            }

        # Translation Map for Aggregated Data
        pred_translations = {
            "en": {
                "western": {"system": "Western Placidus", "focus": "Personality & Character", "insight": "As a {sign}, your core identity is shaped by the {asc} rising energy, indicating a strong natural potential for leadership."},
                "vedic": {"system": "Vedic (Sidereal)", "focus": "Karmic Path & Timelines"},
                "technical": {"system": "Advanced Astronomical", "focus": "Mathematical Precision"},
                "summary": "Based on the combined wisdom of Western Tropical and Vedic Sidereal systems: You are at a pivotal crossroads where your internal personality (Western) aligns with your outward karmic path (Vedic). Trust your intuition."
            },
            "hi": {
                "western": {"system": "पश्चिमी प्लैसिडस", "focus": "व्यक्तित्व और चरित्र", "insight": "एक {sign} के रूप में, आपकी मूल पहचान {asc} बढ़ती ऊर्जा द्वारा आकार लेती है, जो नेतृत्व के लिए एक मजबूत प्राकृतिक क्षमता का संकेत देती है।"},
                "vedic": {"system": "वैदिक (नाक्षत्र)", "focus": "कर्म पथ और समयरेखा"},
                "technical": {"system": "उन्नत खगोलीय", "focus": "गणितीय सटीकता"},
                "summary": "पश्चिमी उष्णकटिबंधीय और वैदिक नाक्षत्र प्रणालियों के संयुक्त ज्ञान के आधार पर: आप एक महत्वपूर्ण चौराहे पर हैं जहाँ आपका आंतरिक व्यक्तित्व (पश्चिमी) आपके बाहरी कर्म पथ (वैदिक) के साथ संरेखित होता है। अपने अंतर्ज्ञान पर भरोसा करें।"
            },
            "es": {
                "western": {"system": "Placidus Occidental", "focus": "Personalidad y Carácter", "insight": "Como un {sign}, tu identidad central está formada por la energía ascendente de {asc}, lo que indica un fuerte potencial natural para el liderazgo."},
                "vedic": {"system": "Védico (Sidéreo)", "focus": "Camino Kármico y Líneas de Tiempo"},
                "technical": {"system": "Astronómico Avanzado", "focus": "Precisión Matemática"},
                "summary": "Basado en la sabiduría combinada de los sistemas Tropical Occidental y Sidéreo Védico: Te encuentras en una encrucijada fundamental donde tu personalidad interna (Occidental) se alinea con tu camino kármico externo (Védico). Confía en tu intuición."
            },
            "fr": {
                "western": {"system": "Placidus Occidental", "focus": "Personnalité et Caractère", "insight": "En tant que {sign}, votre identité profonde est façonnée par l'énergie ascendante de {asc}, indiquant un fort potentiel naturel de leadership."},
                "vedic": {"system": "Védique (Sidéral)", "focus": "Chemin Karmique et Chronologies"},
                "technical": {"system": "Astronomique Avancé", "focus": "Précision Mathématique"},
                "summary": "Basé sur la sagesse combinée des systèmes Tropical Occidental et Sidéral Védique : vous êtes à un carrefour charnière où votre personnalité interne (Occidentale) s'aligne sur votre chemin karmique extérieur (Védique). Faites confiance à votre intuition."
            }
        }

        l = pred_translations.get(lang, pred_translations["en"])
        
        vedic_insight = AstrologyAggregator._get_vedic_insight(western_data.get('sun_sign'), lang=lang)
        technical_data = AstrologyAggregator._get_technical_data(lat, lng, lang=lang)
        
        western_insight = l["western"]["insight"].format(sign=western_data.get('sun_sign'), asc=western_data.get('ascendant'))
        
        # New: AI Synthesis for Summary
        ai_summary = None
        if vedic_data and numerology_data:
            try:
                from services.ai_service import generate_executive_summary
                ai_summary = generate_executive_summary(name, western_data, vedic_data, numerology_data, context=context)
            except Exception as e:
                print(f"Executive AI Summary Error: {e}")
        
        return {
            "western": {
                "system": l["western"]["system"],
                "focus": l["western"]["focus"],
                "insight": western_insight
            },
            "vedic": {
                "system": l["vedic"]["system"],
                "focus": l["vedic"]["focus"],
                "insight": vedic_insight
            },
            "technical": {
                "system": l["technical"]["system"],
                "focus": l["technical"]["focus"],
                "data": technical_data
            },
            "best_prediction": ai_summary if ai_summary else l["summary"]
        }

    @staticmethod
    def get_kundali_svg(name, year, month, day, hour, minute, lat, lng, lang="en"):
        from services.vedic_astro_engine import VedicAstroEngine
        sidereal = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng)
        asc_sign = sidereal.get("ascendant", {}).get("sign_id", 1)
        return KundaliPainter.draw_north_indian_chart(sidereal['planets'], f"Vedic Kundli for {name}", lang=lang, ascendant_sign=asc_sign)

    @staticmethod
    def get_kundali_analysis(year, month, day, hour, minute, lat, lng, lang="en"):
        # Use VedicAstroEngine for Sidereal coordinates instead of Kerykeion
        from services.vedic_astro_engine import VedicAstroEngine
        sidereal = VedicAstroEngine.calculate_sidereal_planets(year, month, day, hour, minute, lat, lng)
        planets = sidereal['planets']
        
        # Translation Map for Vedic Houses
        translations = {
            "en": {
                "houses": {
                    1: {"title": "Lagna (Tanu) - The Rising Portal", "meaning": "Self, personality, physical body, and general life temperament."},
                    2: {"title": "Dhana (Artha) - Sustenance", "meaning": "Family, speech, wealth, possessions, and shared values."},
                    3: {"title": "Sahaja (Vikrama) - Initiative", "meaning": "Courage, communication, siblings, hobbies, and short-term efforts."},
                    4: {"title": "Sukh (Bandhu) - Foundations", "meaning": "Internal peace, mother, vehicles, home, and ancestral roots."},
                    5: {"title": "Putra (Mantra) - Expression", "meaning": "Creativity, intelligence, romance, children, and past life merits."},
                    6: {"title": "Ari (Shatru) - Daily Flow", "meaning": "Enemies, obstacles, health, service, details, and debt."},
                    7: {"title": "Yuvati (Kalatra) - Reflection", "meaning": "Marriage, partnerships, public image, and interactions with Others."},
                    8: {"title": "Randhra (Ayur) - Transformation", "meaning": "Longevity, secrets, transformations, sudden events, and intuition."},
                    9: {"title": "Bhagya (Dharma) - Wisdom", "meaning": "Fortune, spirituality, higher education, father, and pilgrimages."},
                    10: {"title": "Karma (Rajya) - Public Path", "meaning": "Career, reputation, social status, authority, and public duty."},
                    11: {"title": "Labha (Aya) - Abundance", "meaning": "Gains, fulfillment of desires, large groups, and elder siblings."},
                    12: {"title": "Vyaya (Moksha) - Liberation", "meaning": "Spirituality, foreign lands, isolation, dreams, and final release."}
                },
                "influenced": "is influenced by",
                "quiet": "is quiet, indicating a stable period"
            },
            "hi": {
                "houses": {
                    1: {"title": "लग्न (Lagna) - स्वयं", "meaning": "व्यक्तित्व, शारीरिक बनावट और सामान्य जीवन पथ।"},
                    2: {"title": "धन (Dhana) - धन", "meaning": "वित्त, वाणी, परिवार और संसाधन।"},
                    3: {"title": "सहज (Sahaja) - साहस", "meaning": "संचार, भाई-बहन, छोटी यात्राएं और स्वयं का प्रयास।"},
                    4: {"title": "बंधु (Bandhu) - सुख", "meaning": "माता, घर, पर्यावरण और आंतरिक शांति।"},
                    5: {"title": "पुत्र (Putra) - बुद्धि", "meaning": "संतान, रचनात्मकता, रोमांस और पिछले जीवन के गुण।"},
                    6: {"title": "अरि (Ari) - बाधाएं", "meaning": "शत्रु, ऋण, रोग और दैनिक सेवा।"},
                    7: {"title": "युवती (Yuvati) - साझेदारी", "meaning": "विवाह, व्यावसायिक भागीदार और बाहरी दुनिया की बातचीत।"},
                    8: {"title": "रंध्र (Randhra) - दीर्घायु", "meaning": "अचानक घटनाएं, गुप्त, विरासत और परिवर्तन।"},
                    9: {"title": "भाग्य (Bhagya) - भाग्य", "meaning": "अध्यात्म, पिता, उच्च शिक्षा और लंबी यात्राएं।"},
                    10: {"title": "कर्म (Karma) - करियर", "meaning": "पेशा, सामाजिक स्थिति और सार्वजनिक छवि।"},
                    11: {"title": "लाभ (Labha) - लाभ", "meaning": "आय, मित्र, उपलब्धियां और सामाजिक नेटवर्क।"},
                    12: {"title": "व्यय (Vyaya) - मुक्ति", "meaning": "अध्यात्म, विदेशी भूमि, नुकसान और अवचेतन मन।"}
                },
                "influenced": "से प्रभावित है",
                "quiet": "शांत है, जो एक स्थिर अवधि का संकेत देता है"
            },
            "es": {
                "houses": {
                    1: {"title": "Lagna (Ascendente) - Sel", "meaning": "Personalidad, apariencia física y trayectoria general de vida."},
                    2: {"title": "Dhana - Riqueza", "meaning": "Finanzas, habla, familia y recursos."},
                    3: {"title": "Sahaja - Coraje", "meaning": "Comunicación, hermanos, viajes cortos y autoesfuerzo."},
                    4: {"title": "Bandhu - Felicidad", "meaning": "Madre, hogar, entorno y paz interior."},
                    5: {"title": "Putra - Inteligencia", "meaning": "Niños, creatividad, romance y méritos de vidas pasadas."},
                    6: {"title": "Ari - Obstáculos", "meaning": "Enemigos, deuda, enfermedad y servicio diario."},
                    7: {"title": "Yuvati - Asociaciones", "meaning": "Matrimonio, socios comerciales e interacciones con el mundo exterior."},
                    8: {"title": "Randhra - Longevidad", "meaning": "Eventos repentinos, ocultismo, herencia y transformación."},
                    9: {"title": "Bhagya - Fortuna", "meaning": "Espiritualidad, padre, educación superior y viajes largos."},
                    10: {"title": "Karma - Carrera", "meaning": "Profesión, estatus social e imagen pública."},
                    11: {"title": "Labha - Ganancias", "meaning": "Ingresos, amigos, logros y redes sociales."},
                    12: {"title": "Vyaya - Liberación", "meaning": "Espiritualidad, tierras extranjeras, pérdida y mente subconsciente."}
                },
                "influenced": "está influenciado por",
                "quiet": "está tranquilo, lo que indica un período estable"
            },
            "fr": {
                "houses": {
                    1: {"title": "Lagna (Ascendant) - Soi", "meaning": "Personnalité, apparence physique et chemin de vie général."},
                    2: {"title": "Dhana - Richesse", "meaning": "Finances, parole, famille et ressources."},
                    3: {"title": "Sahaja - Courage", "meaning": "Communication, frères et sœurs, courts voyages et auto-effort."},
                    4: {"title": "Bandhu - Bonheur", "meaning": "Mère, foyer, environnement et paix intérieure."},
                    5: {"title": "Putra - Intelligence", "meaning": "Enfants, créativivité, romance et mérites des vies antérieures."},
                    6: {"title": "Ari - Obstacles", "meaning": "Ennemis, dettes, maladie et service quotidien."},
                    7: {"title": "Yuvati - Partenariats", "meaning": "Mariage, partenaires commerciaux et interactions avec le monde extérieur."},
                    8: {"title": "Randhra - Longévité", "meaning": "Événements soudains, occulte, héritage et transformation."},
                    9: {"title": "Bhagya - Fortune", "meaning": "Spiritualité, père, enseignement supérieur et longs voyages."},
                    10: {"title": "Karma - Carrière", "meaning": "Profession, statut social et image publique."},
                    11: {"title": "Labha - Gains", "meaning": "Revenu, amis, accomplissements et réseaux sociaux."},
                    12: {"title": "Vyaya - Libération", "meaning": "Spiritualité, pays étrangers, perte et esprit subconscient."}
                },
                "influenced": "est influencé par",
                "quiet": "est calme, indiquant une période stable"
            }
        }

        lang_data = translations.get(lang, translations["en"])
        house_meanings = lang_data["houses"]

        # Planet-House Interpretations (Vedic Context)
        planet_house_insights_en = {
            "Sun": {
                1: "Sun (Surya) in Lagna bestows a royal demeanor, strong self-worth, and a magnetic presence.",
                5: "Strong creative intelligence and progeny potential. You lead through your heart.",
                9: "A natural seeker of Truth. Dharma and guidance from mentors are pivotal for your soul.",
                10: "High social status and professional success. You were born for public authority.",
                "default": "The Sun illuminates this sector with leadership energy and clarity."
            },
            "Moon": {
                1: "Moon (Chandra) in 1st house makes you deeply intuitive, sensitive, and emotionally expressive.",
                4: "Peace at the foundational level is vital. You have a deep bond with your home and ancestors.",
                7: "Partnerships are the mirror to your soul. You seek emotional security through union.",
                12: "Rich subconscious life and spiritual intuition. You find peace in solitary or foreign spaces.",
                "default": "The Moon adds emotional depth and sensitivity to this area of life."
            },
            "Mercury": {
                2: "Eloquence in speech and a sharp mind for resource management. Your words have value.",
                3: "Highly communicative and intellectually agile. You thrive on learning and local connections.",
                6: "Analytical precision in service. You solve obstacles through logic and meticulous detail.",
                "default": "Mercury brings busy, communicative, and intellectual frequency to this house."
            },
            "Venus": {
                2: "Wealth comes through beauty, art, or social grace. You value aesthetic harmony.",
                7: "Harmony in union is essential. You attract partners who bring balance and luxury.",
                11: "Friendships and social gains are sources of great joy and abundance.",
                "default": "Venus brings charm, beauty, and a desire for harmony to this sector."
            },
            "Mars": {
                1: "A warrior's soul (Kshatriya). You approach life with high courage, drive, and passion.",
                3: "Assertive communication and a drive to protect. You are a tireless worker for your goals.",
                10: "Ambitious and competitive in career. You strive for victory and leadership in your field.",
                "default": "Mars injects passion, energy, and a drive to take decisive action here."
            },
            "Jupiter": {
                2: "Expansion in resources through ethical and wise pursuits. Your speech is influential.",
                5: "Vast creative intelligence and joy through progeny. You are a natural teacher.",
                9: "Deeply philosophical and fortunate in higher learning. You find abundance through Dharma.",
                "default": "Jupiter (Guru) brings growth, luck, and wisdom to this sector."
            },
            "Saturn": {
                1: "Saturn (Shani) in 1st house brings a serious, disciplined path and significant early life karmas.",
                10: "Great responsibility and power. Success comes through long-term effort and structure.",
                12: "Spiritual service and settlement of karmic debts through isolation or charity.",
                "default": "Saturn brings discipline, lessons, and structural results through persistence."
            },
            "Rahu": {
                1: "Ambitious and unconventional personality. You seek to breakthrough traditional boundaries.",
                11: "Unusual gains through technology or large networks. You seek sudden abundance.",
                "default": "Rahu adds an obsessive or unconventional drive to achieve in this sector."
            },
            "Ketu": {
                8: "Deep occult interest and transformative experiences. You have detached intuitive powers.",
                12: "Strong desire for Moksha (Liberation). You find peace in spiritual detachment.",
                "default": "Ketu brings a detached, spiritual, or karmic depth to this house's themes."
            }
        }

        planet_house_insights_hi = {
            "Sun": {
                1: "लग्ने में सूर्य शाही व्यवहार, मजबूत आत्म-सम्मान और चुंबकीय उपस्थिति प्रदान करता है।",
                5: "मजबूत रचनात्मक बुद्धि और संतान क्षमता। आप नेतृत्व करते हैं।",
                9: "सत्य का एक स्वाभाविक साधक। धर्म और गुरुजनों का मार्गदर्शन आपकी आत्मा के लिए महत्वपूर्ण है।",
                10: "उच्च सामाजिक स्थिति और पेशेवर सफलता। आप सार्वजनिक अधिकार के लिए पैदा हुए थे।",
                "default": "सूर्य इस क्षेत्र को नेतृत्व ऊर्जा और स्पष्टता के साथ प्रकाशित करता है।"
            },
            "Moon": {
                1: "प्रथम भाव में चंद्रमा आपको अत्यधिक सहज, संवेदनशील और भावनात्मक रूप से अभिव्यंजक बनाता है।",
                4: "बुनियादी स्तर पर शांति महत्वपूर्ण है। आपका अपने घर और पूर्वजों के साथ गहरा बंधन है।",
                7: "साझेदारी आपकी आत्मा का दर्पण है। आप मिलन के माध्यम से भावनात्मक सुरक्षा चाहते हैं।",
                12: "समृद्ध अवचेतन जीवन और आध्यात्मिक अंतर्ज्ञान। आप एकांत या विदेशी स्थानों में शांति पाते हैं।",
                "default": "चंद्रमा जीवन के इस क्षेत्र में भावनात्मक गहराई और संवेदनशीलता जोड़ता है।"
            },
            "Mercury": {
                2: "वाणी में वाक्पटुता और संसाधन प्रबंधन के लिए तेज दिमाग। आपके शब्दों का मूल्य है।",
                3: "अत्यधिक संचारी और बौद्धिक रूप से चुस्त। आप सीखने और स्थानीय संपर्कों पर पनपते हैं।",
                6: "सेवा में विश्लेषणात्मक सटीकता। आप तर्क और सूक्ष्म विवरण के माध्यम से बाधाओं को हल करते हैं।",
                "default": "बुध इस भाव में व्यस्त, संचारी और बौद्धिक आवृत्ति लाता है।"
            },
            "Venus": {
                2: "धन सुंदरता, कला या सामाजिक अनुग्रह के माध्यम से आता है। आप सौंदर्य सामंजस्य को महत्व देते हैं।",
                7: "मिलन में सामंजस्य आवश्यक है। आप उन भागीदारों को आकर्षित करते हैं जो संतुलन और विलासिता लाते हैं।",
                11: "मित्रता और सामाजिक लाभ बहुत खुशी और प्रचुरता के स्रोत हैं।",
                "default": "शुक्र इस क्षेत्र में आकर्षण, सुंदरता और सामंजस्य की इच्छा लाता है।"
            },
            "Mars": {
                1: "एक योद्धा की आत्मा (क्षत्रिय)। आप उच्च साहस, ड्राइव और जुनून के साथ जीवन का सामना करते हैं।",
                3: "दृढ़ संचार और रक्षा करने की अभियान। आप अपने लक्ष्यों के लिए एक अथक कार्यकर्ता हैं।",
                10: "करियर में महत्वाकांक्षी और प्रतिस्पर्धी। आप अपने क्षेत्र में जीत और नेतृत्व के लिए प्रयास करते हैं।",
                "default": "मंगल यहाँ जुनून, ऊर्जा और निर्णायक कार्रवाई करने की अभियान को इंजेक्ट करता है।"
            },
            "Jupiter": {
                2: "नैतिक और बुद्धिमान खोजों के माध्यम से संसाधनों में विस्तार। आपकी वाणी प्रभावशाली है।",
                5: "विशाल रचनात्मक बुद्धि और संतान के माध्यम से खुशी। आप एक स्वाभाविक शिक्षक हैं।",
                9: "दार्शनिक और उच्च शिक्षा में भाग्यशाली। आप धर्म के माध्यम से प्रचुरता पाते हैं।",
                "default": "गुरु (बृहस्पति) इस क्षेत्र में विकास, भाग्य और ज्ञान लाता है।"
            },
            "Saturn": {
                1: "प्रथम भाव में शनि एक गंभीर, अनुशासित मार्ग और महत्वपूर्ण प्रारंभिक जीवन कर्म लाता है।",
                10: "महान जिम्मेदारी और शक्ति। सफलता दीर्घकालिक प्रयास और संरचना के माध्यम से आती है।",
                12: "एकांत या दान के माध्यम से आध्यात्मिक सेवा और कर्म ऋणों का निपटान।",
                "default": "शनि दृढ़ता के माध्यम से अनुशासन, सबक और संरचनात्मक परिणाम लाता है।"
            },
            "Rahu": {
                1: "महत्वाकांक्षी और अपरंपरागत व्यक्तित्व। आप पारंपरिक सीमाओं को तोड़ने की कोशिश करते हैं।",
                11: "प्रौद्योगिकी या बड़े नेटवर्क के माध्यम से असामान्य लाभ। आप अचानक प्रचुरता की तलाश करते हैं।",
                "default": "राहु इस क्षेत्र में प्राप्त करने के लिए एक जुनूनी या अपरंपरागत अभियान जोड़ता है।"
            },
            "Ketu": {
                8: "गहरी गुप्त रुचि और परिवर्तनकारी अनुभव। आपके पास विरक्त सहज शक्तियां हैं।",
                12: "मोक्ष (मुक्ति) के लिए तीव्र इच्छा। आप आध्यात्मिक वैराग्य में शांति पाते हैं।",
                "default": "केतु इस भाव के विषयों में एक विरक्त, आध्यात्मिक या कार्मिक गहराई लाता है।"
            }
        }
        
        planet_house_insights = planet_house_insights_hi if lang == 'hi' else planet_house_insights_en

        detailed_analysis = []
        for i in range(1, 13):
            occupants = [p for p in planets if p['house'] == i]
            names = ", ".join([p['name'] for p in occupants]) if occupants else "Empty"
            
            # Generate specific planetary insights
            planetary_detail = ""
            for p in occupants:
                insight_map = planet_house_insights.get(p['name'], {})
                planetary_detail += insight_map.get(i, insight_map.get("default", f"{p['name']} adds its unique energy here. "))
            
            status = f"{lang_data['influenced']} {names}" if occupants else lang_data['quiet']
            
            # Structured Remedial Solutions per House (Focus on challenging placements)
            remedies = []
            if occupants:
                for p in occupants:
                    if p['name'] in ["Saturn", "Mars", "Rahu", "Ketu"]: # Example "tough" planets
                        remedies.append({
                            "type": "Specific Remedy",
                            "action": f"To balance {p['name']}'s influence in House {i}: {random.choice(['Donate food on Saturdays', 'Chant peace mantras daily', 'Wear light-colored clothing', 'Practice mindfulness in this area'])}."
                        })

            detailed_analysis.append({
                "house": i,
                "title": house_meanings[i]["title"],
                "planets": names,
                "interpretation": f"{house_meanings[i]['title']} {status}. {house_meanings[i]['meaning']}",
                "deep_analysis": planetary_detail if planetary_detail else "A stable period for this house, allowing for steady, unhindered progress.",
                "remedies": remedies
            })
            
        return detailed_analysis

    @staticmethod
    def get_dynamic_horoscope(sign, lang="en", context=None):
        """
        Generates a dynamic horoscope based on advanced planetary transits and aspects.
        """
        import datetime
        now = datetime.datetime.now()
        
        try:
            # Standardize sign input
            sign = sign.capitalize()
            
            # Calculate transits using Kerykeion
            # Use Greenwich as default for universal transits if no user location
            chart_data = KerykeionService.calculate_chart(
                "Transit", now.year, now.month, now.day, now.hour, now.minute,
                "Greenwich", 51.5, 0.0
            )
            planets = chart_data['planets']
            
            # 1. Aspect Engine: Find interactions between major planets
            aspects = AstrologyAggregator._calculate_aspects(planets)
            
            # 2. Sign Analysis
            zodiac_order = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
            
            if sign not in zodiac_order:
                raise ValueError(f"Invalid zodiac sign: {sign}")
                
            sign_idx = zodiac_order.index(sign)
            
            sun_pos = next(p for p in planets if p['name'] == 'Sun')
            
            # Calculate Sun House
            sun_idx = zodiac_order.index(sun_pos['sign'])
            sun_house = (sun_idx - sign_idx) % 12 + 1
            
            # 3. AI Enhancement (Groq/Gemini)
            # We pass the calculated transit data to the AI
            try:
                from services.ai_service import generate_daily_guidance
                ai_data = generate_daily_guidance(sign, planets, context=context, lang=lang)
                
                if ai_data:
                    # Merge AI data with our structure
                    return {
                        "sign": sign,
                        "prediction": ai_data.get("prediction", "Cosmic balance is key today."),
                        "lucky_number": ai_data.get("lucky_number", 7),
                        "lucky_color": ai_data.get("lucky_color", "White"),
                        "energy_level": ai_data.get("energy_level", 3),
                        "mood": ai_data.get("mood", "Neutral"),
                        "aspects": aspects[:3],
                        "categories": ai_data.get("categories", {}),
                        "transits": {p['name']: p['sign'] for p in planets if p['name'] in ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn']},
                        "date": now.strftime("%Y-%m-%d"),
                        "source": "AI-Enhanced (Skyfield + Groq)"
                    }
            except Exception as e:
                print(f"AI Skipped: {e}")
            
            # --- Legacy Fallback (Original Template Logic) ---
            
            # 3. Modular Prediction Generator
            house_themes_en = {
                1: "self-discovery", 2: "financial stability", 3: "active communication",
                4: "emotional roots", 5: "creative sparks", 6: "daily efficiency",
                7: "balanced partnerships", 8: "deep transformation", 9: "expanded horizons",
                10: "career elevation", 11: "social synergy", 12: "inner reflection"
            }
            house_themes_hi = {
                1: "आत्म-खोज", 2: "वित्तीय स्थिरता", 3: "सक्रिय संचार",
                4: "भावनात्मक जड़ें", 5: "रचनात्मक चिंगारी", 6: "दैनिक दक्षता",
                7: "संतुलित साझेदारी", 8: "गहरा परिवर्तन", 9: "विस्तारित क्षितिज",
                10: "करियर उत्थान", 11: "सामाजिक तालमेल", 12: "आंतरिक चिंतन"
            }
            house_themes = house_themes_hi if lang == 'hi' else house_themes_en
            
            major_impact = ""
            if aspects:
                top_aspect = aspects[0]
                aspect_meanings_en = {
                    "Conjunction": "is merging with",
                    "Opposition": "is facing tension from",
                    "Square": "is challenged by",
                    "Trine": "is supported by",
                    "Sextile": "is gaining opportunity from"
                }
                aspect_meanings_hi = {
                    "Conjunction": "के साथ मिल रहा है",
                    "Opposition": "तनाव का सामना कर रहा है",
                    "Square": "चुनौती दे रहा है",
                    "Trine": "का समर्थन प्राप्त है",
                    "Sextile": "से अवसर प्राप्त कर रहा है"
                }
                ams = aspect_meanings_hi if lang == 'hi' else aspect_meanings_en
                
                type_name = top_aspect['type']
                if lang == 'hi':
                    aspect_map = {"Conjunction": "युति", "Opposition": "प्रतियुति", "Square": "केंद्र", "Trine": "त्रिकोण", "Sextile": "लाभ"}
                    type_name = aspect_map.get(type_name, type_name)
                    major_impact = f" {top_aspect['p1']} और {top_aspect['p2']} के बीच एक महत्वपूर्ण {type_name} सुझाव देता है कि {top_aspect['p1']}, {top_aspect['p2']} {ams.get(top_aspect['type'], 'प्रभावित करता है')}।"
                else:
                    major_impact = f" A significant {top_aspect['type']} between {top_aspect['p1']} and {top_aspect['p2']} suggests {top_aspect['p1']} {ams.get(top_aspect['type'], 'impacts')} {top_aspect['p2']}."

            if lang == "hi":
                prediction = f"{sign} के लिए आज का आकाशीय ध्यान {house_themes.get(sun_house, 'व्यक्तिगत विकास')} पर है।{major_impact} अधिकतम सामंजस्य के लिए अपने कार्यों को इस ब्रह्मांडीय प्रवाह के साथ संरेखित करें।"
            else:
                prediction = f"The celestial focus for {sign} today is on {house_themes.get(sun_house, 'personal growth')}. {major_impact} Align your actions with this cosmic current for maximum harmony."
            
            # 5. Life Area Insights (Deepened Analysis)
            # Map planets to areas
            venus_pos = next(p for p in planets if p['name'] == 'Venus')
            saturn_pos = next(p for p in planets if p['name'] == 'Saturn')
            jupiter_pos = next(p for p in planets if p['name'] == 'Jupiter')
            mars_pos = next(p for p in planets if p['name'] == 'Mars')
            moon_pos = next(p for p in planets if p['name'] == 'Moon')
            mercury_pos = next(p for p in planets if p['name'] == 'Mercury')

            # Multilingual Category Titles & Summaries
            cat_text = {
                "en": {
                    "love": {"title": "Love & Relationships", "summary": "Venus in {sign} influences your heart space."},
                    "career": {"title": "Career & Professional", "summary": "Saturn's placement in {sign} tests your resolve."},
                    "finance": {"title": "Finance & Wealth", "summary": "Jupiter in {sign} expands your resourcefulness."},
                    "health": {"title": "Health & Wellness", "summary": "The Moon in {sign} affects your vitality."},
                    "status": ["Harmonious", "Stable", "Intense", "Transformative", "Growth", "Focus", "Build", "Patience", "Prosperous", "Cautious", "Strategic", "Expanding", "Balanced"]
                },
                "hi": {
                    "love": {"title": "प्रेम और संबंध", "summary": "{sign} में शुक्र आपके हृदय स्थान को प्रभावित करता है।"},
                    "career": {"title": "करियर और पेशेवर", "summary": "{sign} में शनि का स्थान आपके संकल्प की परीक्षा लेता है।"},
                    "finance": {"title": "वित्त और धन", "summary": "{sign} में गुरु आपकी साधन संपन्नता का विस्तार करता है।"},
                    "health": {"title": "स्वास्थ्य और कल्याण", "summary": "{sign} में चंद्रमा आपकी जीवन शक्ति को प्रभावित करता है।"},
                    "status": ["सामंजस्यपूर्ण", "स्थिर", "तीव्र", "परिवर्तनकारी", "विकास", "फोकस", "निर्माण", "धैर्य", "समृद्ध", "सतर्क", "रणनीतिक", "विस्तार", "संतुलित"]
                }
            }
            ct = cat_text.get(lang, cat_text["en"])
            
            # Detail Generators (Simplified for brevity regarding translation complexity in random strings)
            # We provide static translated lists for Hindi fallback to ensure quality.

            details_hi = {
                "love": ["भावनात्मक सुरक्षा पर ध्यान दें।", "प्रियजनों के साथ समय बिताएं।", "नए रिश्तों के लिए खुला रहें।"],
                "career": ["कड़ी मेहनत का फल मिलेगा।", "नई जिम्मेदारियों के लिए तैयार रहें।", "धैर्य रखें और योजना पर टिके रहें।"],
                "finance": ["खर्चों पर नियंत्रण रखें।", "दीर्घकालिक निवेश पर विचार करें।", "वित्तीय योजना बनाने का अच्छा समय है।"],
                "health": ["अपने शरीर की सुनें।", "हल्का व्यायाम करें।", "प्रचुर मात्रा में पानी पिएं।"]
            }

            categories = {
                "love": {
                    "title": ct["love"]["title"],
                    "summary": ct["love"]["summary"].format(sign=venus_pos['sign']),
                    "details": details_hi["love"] if lang == "hi" else [
                        f"With Venus transiting {venus_pos['sign']}, your approach to affection is currently colored by {random.choice(['the need for intellectual stimulation', 'deeply rooted emotional security', 'a desire for grand romantic gestures', 'practical acts of service'])}.",
                        f"The alignment suggests that {random.choice(['open communication about long-term goals', 'physical proximity and touch', 'sharing a new experience together', 'expressing gratitude for small things'])} will strengthen your bond significantly.",
                        f"If single, this cosmic frequency attracts {random.choice(['mentally engaging partners', 'someone who feels like home', 'dynamic and adventurous individuals', 'reliable and grounded souls'])}."
                    ],
                    "status": random.choice(ct["status"][:4])
                },
                "career": {
                    "title": ct["career"]["title"],
                    "summary": ct["career"]["summary"].format(sign=saturn_pos['sign']),
                    "details": details_hi["career"] if lang == "hi" else [
                        f"The presence of Saturn in {saturn_pos['sign']} puts a spotlight on your {random.choice(['professional boundaries', 'long-term legacy', 'daily work methodology', 'public reputation'])}.",
                        f"You may feel a slight pressure to {random.choice(['reorganize your workspace', 'revisit a project from the past', 'take on more leadership responsibility', 'refine your technical skills'])}.",
                        f"This is not a time for shortcuts; rather, it's a period where {random.choice(['meticulous attention to detail', 'steady, patient progress', 'networking with industry elders', 'consistency in your routine'])} will yield the greatest rewards."
                    ],
                    "status": random.choice(ct["status"][4:8])
                },
                "finance": {
                    "title": ct["finance"]["title"],
                    "summary": ct["finance"]["summary"].format(sign=jupiter_pos['sign']),
                    "details": details_hi["finance"] if lang == "hi" else [
                        f"Jupiter's current transit through {jupiter_pos['sign']} indicates a potential for {random.choice(['unexpected financial gains', 'a shift in how you value your time', 'opportunities for secondary income', 'better management of shared resources'])}.",
                        f"While the energy is expansive, the square aspect to {random.choice(['Mars', 'Saturn', 'Pluto', 'Sun'])} warns against {random.choice(['impulsive luxury purchases', 'investing without research', 'over-extending your credit', 'ignoring small recurring expenses'])}.",
                        f"Focusing on {random.choice(['long-term asset building', 'diversifying your portfolio', 'education as an investment', 'clear communication with financial partners'])} is highly favored today."
                    ],
                    "status": random.choice(ct["status"][8:12])
                },
                "health": {
                    "title": ct["health"]["title"],
                    "summary": ct["health"]["summary"].format(sign=moon_pos['sign']),
                    "details": details_hi["health"] if lang == "hi" else [
                        f"Listen to your body today.",
                        f"Good time for gentle exercise.",
                        f"Stay hydrated."
                    ],
                    "status": ct["status"][12]
                },
                "remedies": {
                    "solution": {
                        "physical": "योग और प्राणायाम का अभ्यास करें।" if lang == "hi" else "Practice Yoga and Pranayama.",
                        "meditative": "ओम मंत्र का जाप करें।" if lang == "hi" else "Chant 'Om' mantra for inner peace.",
                        "behavioral": "दूसरों के प्रति दयालु रहें।" if lang == "hi" else "Practice kindness towards others."
                    }
                }
            }

            # 6. Final Payload
            random.seed(f"{sign}-{now.date()}")
            
            colors_en = ["Royal Blue", "Crimson", "Emerald", "Gold", "Violet", "Azure", "Saffron"]
            colors_hi = ["शाही नीला", "गहरा लाल", "पन्ना हरा", "सुसहरी", "बैंगनी", "आसमानी", "केसरिया"]
            lucky_color = random.choice(colors_hi if lang == "hi" else colors_en)
            
            moods_en = ["Ambitious", "Reflective", "Radiant", "Grounded", "Inspired", "Resilient"]
            moods_hi = ["महत्वाकांक्षी", "चिंतनशील", "तेजस्वी", "स्थिर", "प्रेरित", "लचीला"]
            mood = random.choice(moods_hi if lang == "hi" else moods_en)

            return {
                "sign": sign,
                "prediction": prediction,
                "lucky_number": random.randint(1, 99),
                "lucky_color": lucky_color,
                "energy_level": random.randint(3, 5),
                "mood": mood,
                "aspects": aspects[:3],
                "categories": categories,
                "transits": {p['name']: p['sign'] for p in planets if p['name'] in ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn']},
                "date": now.strftime("%Y-%m-%d"),
                 "source": "Skyfield Template (Fallback)"
            }
        except Exception as e:
            print(f"Error in dynamic horoscope: {e}")
            import traceback
            traceback.print_exc()
            # Fallback data
            return {
                "sign": sign,
                "prediction": f"The stars are currently recalibrating for {sign}. Focus on intuition and gentle progress today.",
                "lucky_number": 7,
                "lucky_color": "Gold",
                "energy_level": 4,
                "mood": "Peaceful",
                "aspects": [],
                "categories": {},
                "transits": {"Sun": "Current", "Moon": "Current"},
                "date": now.strftime("%Y-%m-%d")
            }

    @staticmethod
    def _calculate_aspects(planets):
        """
        Detects angular relationships between planets.
        """
        aspect_types = [
            {"name": "Conjunction", "angle": 0, "orb": 8, "symbol": "☌"},
            {"name": "Opposition", "angle": 180, "orb": 8, "symbol": "☍"},
            {"name": "Trine", "angle": 120, "orb": 8, "symbol": "△"},
            {"name": "Square", "angle": 90, "orb": 8, "symbol": "□"},
            {"name": "Sextile", "angle": 60, "orb": 6, "symbol": "⚹"}
        ]
        
        results = []
        for i, p1 in enumerate(planets):
            for j, p2 in enumerate(planets):
                if i >= j: continue
                
                # Calculate absolute angular distance
                diff = abs(p1['position'] - p2['position'])
                if diff > 180: diff = 360 - diff
                
                for aspect in aspect_types:
                    if abs(diff - aspect['angle']) <= aspect['orb']:
                        results.append({
                            "p1": p1['name'],
                            "p2": p2['name'],
                            "type": aspect['name'],
                            "symbol": aspect['symbol'],
                            "orb": round(abs(diff - aspect['angle']), 1)
                        })
        
        # Sort by tightest orb
        return sorted(results, key=lambda x: x['orb'])

    @staticmethod
    def get_graha_effects(planets, lang="en"):
        """
        Generates detailed, dignity-aware interpretations for planets in houses.
        Returns a list of Graha Insights.
        """
        effects = []
        
        # English Insights
        insights_en = {
            "Sun": {
                "nature": "Soul & Authority",
                "h1": "You have a natural leadership presence and a strong sense of self-respect.",
                "h4": "You find happiness through internal peace and feel a deep connection to your home and family roots.",
                "h5": "You possess a creative spark and a sharp intellect, often expressing yourself with heart and passion.",
                "h9": "You are a natural seeker of wisdom, valuing ethics, higher learning, and spiritual growth.",
                "h10": "Success comes naturally in your career; you are destined for public recognition and authority.",
                "default": "The Sun brings vitality, clarity, and a sense of 'Self' to this area of life."
            },
            "Moon": {
                "nature": "Mind & Emotions",
                "h1": "You are sensitive, intuitive, and your emotions strongly guide your life choices.",
                "h4": "Emotional security and a peaceful home environment are vital for your well-being.",
                "h7": "You seek emotional depth and a mirror for your soul in your personal relationships.",
                "h12": "You possess a rich inner world and find peace in solitude or spiritual reflection.",
                "default": "The Moon adds emotional depth, sensitivity, and intuition to this house."
            },
            "Mars": {
                "nature": "Drive & Energy",
                "h1": "You are a natural warrior at heart—courageous, energetic, and always ready to take action.",
                "h3": "You are highly driven in your efforts and protective of those you care about.",
                "h10": "You are competitive and ambitious in your field, striving for victory and tangible results.",
                "default": "Mars injects passion, energy, and a drive to protect and achieve here."
            },
            "Mercury": {
                "nature": "Intellect & Speech",
                "h2": "You have a sharp mind for finances and express your values with great eloquence.",
                "h3": "You are intellectually agile and thrive on constant learning and communication.",
                "h6": "You solve problems through logical analysis and show great precision in your daily work.",
                "default": "Mercury brings a busy, intellectual, and communicative energy to this sector."
            },
            "Jupiter": {
                "nature": "Wisdom & Abundance",
                "h2": "Resources flow to you through wise decisions and an ethical approach to life.",
                "h5": "You are a natural teacher with a vast creative intellect and great joy through children.",
                "h9": "You find true abundance through philosophy, higher learning, and spiritual discovery.",
                "default": "Jupiter brings growth, luck, and wisdom, promising expansion in this life area."
            },
            "Venus": {
                "nature": "Harmony & Pleasure",
                "h2": "Wealth often manifest through artistic pursuits, beauty, or social grace.",
                "h7": "Harmony in union is essential for you; you attract partners who bring balance.",
                "h11": "Friendships and social circles are a source of great joy and abundance for you.",
                "default": "Venus brings charm, beauty, and a desire for harmony to this area of life."
            },
            "Saturn": {
                "nature": "Discipline & Karma",
                "h1": "Life follows a serious, disciplined path where success is earned through hard work.",
                "h10": "Success comes through long-term effort, persistence, and building solid structures.",
                "h12": "Settlement of karmic debts through spiritual service or quiet reflection is likely.",
                "default": "Saturn brings structure, lessons, and lasting results through patient effort."
            },
            "Rahu": {
                "nature": "Ambition & Growth",
                "h1": "You seek unconventional ways to define yourself and are driven to break boundaries.",
                "h11": "Sudden gains through technology or large networks can bring significant growth.",
                "default": "Rahu adds an obsessive or unconventional drive to succeed in this area."
            },
            "Ketu": {
                "nature": "Spirituality & Closure",
                "h8": "You have deep intuitive powers and a natural interest in the hidden mysteries of life.",
                "h12": "You have a soul-urge for spiritual liberation and detachment from material ties.",
                "default": "Ketu brings a spiritual, karmic, or detached depth to these life themes."
            }
        }

        # Hindi Insights
        insights_hi = {
            "Sun": {
                "nature": "आत्मा और अधिकार",
                "h1": "आपके पास स्वाभाविक नेतृत्व क्षमता और आत्म-सम्मान की प्रबल भावना है।",
                "h4": "आप आंतरिक शांति के माध्यम से खुशी पाते हैं और अपनी पारिवारिक जड़ों से गहरा जुड़ाव महसूस करते हैं।",
                "h5": "आपके पास रचनात्मक चमक और तीक्ष्ण बुद्धि है, जो अक्सर दिल और जुनून के साथ खुद को व्यक्त करती है।",
                "h9": "आप ज्ञान के स्वाभाविक साधक हैं, नैतिकता, उच्च शिक्षा और आध्यात्मिक विकास को महत्व देते हैं।",
                "h10": "आपके करियर में सफलता स्वाभाविक रूप से आती है; आप सार्वजनिक मान्यता और अधिकार के लिए बने हैं।",
                "default": "सूर्य जीवन के इस क्षेत्र में जीवन शक्ति, स्पष्टता और 'स्व' की भावना लाता है।"
            },
            "Moon": {
                "nature": "मन और भावनाएँ",
                "h1": "आप संवेदनशील, सहज और आपकी भावनाएं आपके जीवन के विकल्पों का दृढ़ता से मार्गदर्शन करती हैं।",
                "h4": "भावनात्मक सुरक्षा और शांतिपूर्ण घर का वातावरण आपकी भलाई के लिए महत्वपूर्ण है।",
                "h7": "आप अपने व्यक्तिगत संबंधों में भावनात्मक गहराई और अपनी आत्मा के लिए एक दर्पण की तलाश करते हैं।",
                "h12": "आपके पास एक समृद्ध आंतरिक दुनिया है और आप एकांत या आध्यात्मिक चिंतन में शांति पाते हैं।",
                "default": "चंद्रमा इस भाव में भावनात्मक गहराई, संवेदनशीलता और अंतर्ज्ञान जोड़ता है।"
            },
            "Mars": {
                "nature": "उत्साह और ऊर्जा",
                "h1": "आप दिल से एक स्वाभाविक योद्धा हैं - साहसी, ऊर्जावान और हमेशा कार्रवाई करने के लिए तैयार।",
                "h3": "आप अपने प्रयासों में अत्यधिक प्रेरित हैं और उन लोगों की सुरक्षा करते हैं जिनकी आप परवाह करते हैं।",
                "h10": "आप अपने क्षेत्र में प्रतिस्पर्धी और महत्वाकांक्षी हैं, जीत और ठोस परिणामों के लिए प्रयासरत हैं।",
                "default": "मंगल यहाँ जुनून, ऊर्जा और रक्षा करने और प्राप्त करने की इच्छा का संचार करता है।"
            },
            "Mercury": {
                "nature": "बुद्धि और वाणी",
                "h2": "आपके पास वित्त के लिए एक तेज दिमाग है और आप अपनी वाक्पटुता के साथ अपने मूल्यों को व्यक्त करते हैं।",
                "h3": "आप बौद्धिक रूप से चुस्त हैं और निरंतर सीखने और संचार पर पनपते हैं।",
                "h6": "आप तार्किक विश्लेषण के माध्यम से समस्याओं को हल करते हैं और अपने दैनिक कार्य में महान सटीकता दिखाते हैं।",
                "default": "बुध इस क्षेत्र में व्यस्त, बौद्धिक और संचार ऊर्जा लाता है।"
            },
            "Jupiter": {
                "nature": "ज्ञान और प्रचुरता",
                "h2": "बुद्धिमान निर्णयों और जीवन के प्रति नैतिक दृष्टिकोण के माध्यम से आपके पास संसाधन प्रवाहित होते हैं।",
                "h5": "आप एक स्वाभाविक शिक्षक हैं, जिनके पास विशाल रचनात्मक बुद्धि है और बच्चों के माध्यम से बहुत खुशी है।",
                "h9": "आप दर्शन, उच्च शिक्षा और आध्यात्मिक खोज के माध्यम से सच्ची प्रचुरता पाते हैं।",
                "default": "गुरु विकास, भाग्य और ज्ञान लाता है, जिससे इस जीवन क्षेत्र में विस्तार का वादा मिलता है।"
            },
            "Venus": {
                "nature": "सद्भाव और आनंद",
                "h2": "धन अक्सर कलात्मक गतिविधियों, सुंदरता या सामाजिक अनुग्रह के माध्यम से प्रकट होता है।",
                "h7": "मिलन में सामंजस्य आपके लिए आवश्यक है; आप उन भागीदारों को आकर्षित करते हैं जो संतुलन लाते हैं।",
                "h11": "मित्रता और सामाजिक दायरे आपके लिए बहुत खुशी और प्रचुरता का स्रोत हैं।",
                "default": "शुक्र जीवन के इस क्षेत्र में आकर्षण, सुंदरता और सामंजस्य की इच्छा लाता है।"
            },
            "Saturn": {
                "nature": "अनुशासन और कर्म",
                "h1": "जीवन एक गंभीर, अनुशासित मार्ग का अनुसरण करता है जहां सफलता कड़ी मेहनत के माध्यम से अर्जित की जाती है।",
                "h10": "सफलता दीर्घकालिक प्रयास, दृढ़ता और ठोस संरचनाओं के निर्माण के माध्यम से आती है।",
                "h12": "आध्यात्मिक सेवा या शांत चिंतन के माध्यम से कर्म ऋणों का निपटान संभव है।",
                "default": "शनि धैर्यपूर्वक प्रयास के माध्यम से संरचना, सबक और स्थायी परिणाम लाता है।"
            },
            "Rahu": {
                "nature": "महत्वाकांक्षा और विकास",
                "h1": "आप खुद को परिभाषित करने के लिए अपरंपरागत तरीकों की तलाश करते हैं और सीमाओं को तोड़ने के लिए प्रेरित होते हैं।",
                "h11": "प्रौद्योगिकी या बड़े नेटवर्क के माध्यम से अचानक लाभ महत्वपूर्ण विकास ला सकता है।",
                "default": "राहु इस क्षेत्र में सफल होने के लिए एक जुनूनी या अपरंपरागत अभियान जोड़ता है।"
            },
            "Ketu": {
                "nature": "अध्यात्म और समापन",
                "h8": "जीवन के छिपे रहस्यों में आपकी गहरी सहज शक्ति और स्वाभाविक रुचि है।",
                "h12": "आपके पास आध्यात्मिक मुक्ति और भौतिक बंधनों से वैराग्य के लिए आत्मा-आग्रह है।",
                "default": "केतु इन जीवन विषयों में आध्यात्मिक, कार्मिक या विरक्त गहराई लाता है।"
            }
        }

        # Select Dictionary
        base_insights = insights_hi if lang == "hi" else insights_en
        
        # Translation Helpers for Dignity notes
        dignity_trans = {
            "en": {
                "exalted": " (Being **Exalted**, this {name} gives exceptionally powerful and positive results.)",
                "debilitated": " (As this planet is **Debilitated**, you may need extra effort to harness its positive qualities here.)",
                "own": " (In its **Own Sign**, this planet feels very comfortable and provides stable, strong results.)"
            },
            "hi": {
                "exalted": " (**उच्च** होने के कारण, यह {name} असाधारण रूप से शक्तिशाली और सकारात्मक परिणाम देता है।)",
                "debilitated": " (चूंकि यह ग्रह **नीच** का है, इसलिए आपको यहां इसके सकारात्मक गुणों का दोहन करने के लिए अतिरिक्त प्रयास की आवश्यकता हो सकती है।)",
                "own": " (अपनी **स्वराशि** में, यह ग्रह बहुत सहज महूसस करता है और स्थिर, मजबूत परिणाम प्रदान करता है।)"
            }
        }
        dt = dignity_trans.get(lang, dignity_trans["en"])
        
        for p in planets:
            p_name = p['name']
            p_house = p.get('house', 1)
            p_dignity = p.get('dignity', {}).get('status', 'Neutral')
            p_sanskrit = p.get('sanskrit_name', '')
            
            if p_name in base_insights:
                insight_data = base_insights[p_name]
                house_key = f"h{p_house}"
                core_effect = insight_data.get(house_key, insight_data["default"])
                
                # Dignity Refinement
                dignity_note = ""
                if p_dignity == "Exalted":
                    dignity_note = dt["exalted"].format(name=p_name)
                elif p_dignity == "Debilitated":
                    dignity_note = dt["debilitated"].format(name=p_name)
                elif p_dignity == "Own Sign":
                    dignity_note = dt["own"].format(name=p_name)
                
                effects.append({
                    "planet": p_name,
                    "sanskrit": p_sanskrit,
                    "house": p_house,
                    "nature": insight_data["nature"],
                    "effect": f"{core_effect}{dignity_note}",
                    "dignity": p_dignity
                })
        
        return effects

    @staticmethod
    def get_kp_interpretations(kp_data, lang="en"):
        """
        Converts raw KP data into AI-generated simple English predictions.
        """
        try:
            from services.ai_service import call_groq_api
            
            # Build context for AI
            kp_summary = []
            for item in kp_data[:9]:
                kp_summary.append(f"{item['planet']} in {item['sign']}, Star Lord: {item['star_lord']}, Sub Lord: {item['sub_lord']}")
            
            kp_text = "\n".join(kp_summary)
            
            prompt = f"""You are an expert KP (Krishnamurti Paddhati) astrologer trained in the authentic methodology developed by Prof. K.S. Krishnamurti. Use the following classical KP principles to generate predictions:

**Core KP Principles (Based on KP Reader Series & Stellar Astrology):**
1. **Sub Lord Theory**: The Sub Lord is the ULTIMATE deciding factor for any event. A planet may be well-placed, but if the Sub Lord is unfavorable, the result will be negative.
2. **Ruling Planets**: Consider the significators of houses through Star Lords and Sub Lords, not just sign placement.
3. **Cuspal Sub Lord**: The Sub Lord of a house cusp determines whether that house will give results or not.
4. **Significator Theory**: A planet becomes a significator if it occupies the constellation of a house lord, or is posited in a house, or owns a house.

**KP Data for Analysis:**
{kp_text}

**Your Task:**
Generate 7-9 practical, evidence-based predictions using authentic KP methodology. Each prediction should:

- **Apply Sub Lord Analysis**: Explicitly state how the Sub Lord influences the outcome
- **Reference House Significations**: Use classical house meanings (1st=Self, 2nd=Wealth, 5th=Education/Children, 7th=Marriage, 10th=Career, etc.)
- **Be Specific**: Mention timing indicators when possible (e.g., "during periods ruled by...")
- **Use KP Terminology**: Include terms like "significator," "cuspal sub lord," "stellar influence"
- **Focus on Practical Areas**: Career prospects, relationship compatibility, financial gains, health vulnerabilities, education success
- **Language**: {"Hindi (Devanagari script)" if lang == "hi" else "English"}

**Format Guidelines:**
- Each prediction: 2-3 sentences maximum
- Use bold (**text**) for planet names, house numbers, and key terms
- Start with the life area, then explain the KP logic
- Example: "**Career Advancement**: The 10th cusp Sub Lord **Venus** is well-placed, indicating professional growth through creative or diplomatic fields. The Star Lord **Jupiter** amplifies success potential during its periods."

Generate predictions now based on authentic KP principles:"""

            response = call_groq_api(prompt, model="llama-3.3-70b-versatile")
            
            if response:
                # Parse AI response into structured format
                lines = [line.strip() for line in response.split('\n') if line.strip() and not line.strip().startswith('#')]
                interpretations = []
                
                for idx, line in enumerate(lines[:9]):
                    # Clean up numbering if present
                    clean_line = line
                    if clean_line and clean_line[0].isdigit():
                        clean_line = '. '.join(clean_line.split('. ')[1:]) if '. ' in clean_line else clean_line
                    
                    interpretations.append({
                        "planet": kp_data[idx]['planet'] if idx < len(kp_data) else "General",
                        "meaning": clean_line,
                        "star_lord": kp_data[idx]['star_lord'] if idx < len(kp_data) else "",
                        "sub_lord": kp_data[idx]['sub_lord'] if idx < len(kp_data) else ""
                    })
                
                return interpretations if interpretations else AstrologyAggregator._fallback_kp_interpretations(kp_data)
            else:
                return AstrologyAggregator._fallback_kp_interpretations(kp_data)
                
        except Exception as e:
            print(f"KP AI Analysis Error: {e}")
            return AstrologyAggregator._fallback_kp_interpretations(kp_data)
    
    @staticmethod
    def _fallback_kp_interpretations(kp_data):
        """Fallback static interpretations if AI fails"""
        interpretations = []
        
        planet_qualities = {
            "Sun": "authoritative, radiant, and steady",
            "Moon": "emotional, fluctuating, and sensitive",
            "Mars": "energetic, aggressive, and decisive",
            "Mercury": "intellectual, communicative, and adaptable",
            "Jupiter": "expansive, wise, and optimistic",
            "Venus": "harmonious, artistic, and pleasure-seeking",
            "Saturn": "disciplined, slow, and structured",
            "Rahu": "ambitious, unconventional, and amplification",
            "Ketu": "spiritual, detached, and mystical"
        }
        
        for item in kp_data[:9]:
            planet = item['planet']
            sign = item['sign']
            star = item['star_lord']
            sub = item['sub_lord']
            
            star_quality = planet_qualities.get(star, "mysterious")
            sub_quality = planet_qualities.get(sub, "intense")
            
            sentence = (
                f"**{planet}** (in {sign}) is channeled through the star of **{star}**, adding a layer of {star_quality} energy. "
                f"The final outcome is decided by **{sub}**, suggesting results will be {sub_quality}."
            )
            
            interpretations.append({
                "planet": planet,
                "meaning": sentence,
                "star_lord": star,
                "sub_lord": sub
            })
            
        return interpretations

    @staticmethod
    def get_vedic_full_report(name, year, month, day, hour, minute, lat, lng, lang="en", timezone="UTC", context=None):
        from services.vedic_astro_engine import VedicAstroEngine
        
        # Get Sidereal Planets
        sidereal_data = VedicAstroEngine.calculate_sidereal_planets(
            year, month, day, hour, minute, lat, lng, timezone_str=timezone
        )
        
        # Get Panchang
        panchang = VedicAstroEngine.calculate_panchang(year, month, day, hour, minute, lat, lng)
        
        # Get Dasha
        dasha = VedicAstroEngine.calculate_vimshottari_dasha(year, month, day, hour, minute, lat, lng)
        
        # Get Divisional Charts (D9)
        divisional = VedicAstroEngine.calculate_divisional_charts(sidereal_data)
        
        # Get Remedies
        remedies = VedicAstroEngine.calculate_remedies(sidereal_data, lang=lang)
        
        # New: Get KP System Data
        kp = VedicAstroEngine.calculate_kp_system(sidereal_data)
        
        # New: Calculate KP Cusps (CSL) using Angles from Kerykeion/Skyfield
        # We need the Tropical Angles to convert to Sidereal Cusps
        angles_tropical = KerykeionService.calculate_chart(
             name, year, month, day, hour, minute, "", lat, lng
        ).get('angles', {})
        
        # Map Angles to Houses (Approximate KP Cusps for Angles)
        # 1 = Ascendant, 4 = IC, 7 = Descendant, 10 = Midheaven
        tropical_cusps_map = {
            "1": angles_tropical.get('Ascendant', 0),
            "4": angles_tropical.get('IC', 0),
            "7": angles_tropical.get('Descendant', 0),
            "10": angles_tropical.get('Midheaven', 0)
        }
        
        kp_cusps = VedicAstroEngine.calculate_kp_cusps(tropical_cusps_map, sidereal_data['ayanamsa'])
        
        # New: KP Interpretations (PDF Rules + AI)
        from services.kp_analysis_service import KPAnalysisService
        # Get Rule-based analysis
        kp_rule_analysis = KPAnalysisService.generate_analysis(kp, kp_cusps, lang=lang)
        
        # Combine with AI interpretations if needed, or replace
        # For now, we prepend the Rule-based analysis to the AI ones
        kp_ai_analysis = AstrologyAggregator.get_kp_interpretations(kp, lang=lang)
        
        # Merge: Priority to Rule-based for 1, 10, 7.
        kp_final_analysis = kp_rule_analysis + kp_ai_analysis

        # New: Get Planet-in-House 'Graha Effects' (Simple English)
        graha_effects = AstrologyAggregator.get_graha_effects(sidereal_data['planets'], lang=lang)

        # New: Detect Doshas (Manglik, Kaal Sarp, Pitru)
        doshas = VedicAstroEngine.calculate_doshas(sidereal_data)
        
        # New: Calculate Avakhada Chakra
        avakhada = VedicAstroEngine.calculate_avakhada(sidereal_data)
        
        # New: Calculate Current Transits (using current time and birth location)
        try:
            now = datetime.now()
            current_transits_data = VedicAstroEngine.calculate_sidereal_planets(
                now.year, now.month, now.day, now.hour, now.minute, lat, lng, timezone_str=timezone
            )
            current_transits = current_transits_data.get('planets', [])
        except Exception as te:
            print(f"Transit Calculation Error: {te}")
            current_transits = []

        # New: Groq-Powered AI Summary (Simplifying the engine data)
        try:
            from services.ai_service import generate_vedic_ai_summary
            ai_summary = generate_vedic_ai_summary(
                name, sidereal_data['planets'], panchang, dasha, 
                lang=lang, context=context, doshas=doshas, transits=current_transits
            )
        except Exception as e:
            print(f"AI Summary Error: {e}")
            ai_summary = None

        return {
            "ayanamsa": sidereal_data["ayanamsa"],
            "planets": sidereal_data["planets"],
            "panchang": panchang,
            "dasha": dasha,
            "divisional_charts": divisional,
            "remedies": remedies,
            "kp_system": kp,
            "kp_cusps": kp_cusps, # Add this to output
            "kp_analysis": kp_final_analysis,
            "graha_effects": graha_effects,
            "doshas": doshas, # Exposed doshas to frontend
            "avakhada": avakhada, # New section
            "ai_summary": ai_summary
        }
    
    @staticmethod
    def get_current_transits(lat, lng):
        import datetime
        now = datetime.datetime.now()
        # Calculate current sidereal positions
        from services.vedic_astro_engine import VedicAstroEngine
        
        transit_data = VedicAstroEngine.calculate_sidereal_planets(
            now.year, now.month, now.day, now.hour, now.minute, lat, lng
        )
        return transit_data['planets']

    @staticmethod
    def _get_vedic_insight(sun_sign, lang="en", vedic_data=None):
        # Improved insight generator using real data if available
        if vedic_data:
            tithi = vedic_data.get('panchang', {}).get('tithi', {}).get('name', 'Unknown')
            nak = vedic_data.get('panchang', {}).get('nakshatra', {}).get('name', 'Unknown')
            return f"Born under {nak} Nakshatra and {tithi}, your Vedic path emphasizes spiritual alignment."
            
        insights = {
            "en": [
                "You are currently in a pivotal dasha period. Focus on discipline.",
                "The placement of Shani suggests significant karmic clearing regarding family.",
                "Your Moon's Nakshatra indicates deep spiritual sensitivity.",
                "The current yoga formed by Mars and Venus suggests a surge in passions."
            ]
        }
        l = insights.get(lang, insights["en"])
        return random.choice(l)

    @staticmethod
    def _get_technical_data(lat, lng, lang="en"):
        names = {
            "en": {"system": "Placidus", "correction": "Lahiri (Sidereal Correction)", "precision": "High (Swiss Ephemeris)", "lm": "Adjusted for"},
            "hi": {"system": "प्लैसिडस", "correction": "लाहिरी (नाक्षत्र सुधार)", "precision": "उच्च (स्विस पंचांग)", "lm": "समायोजित के लिए"},
            "es": {"system": "Placidus", "correction": "Lahiri (Corrección Sidérea)", "precision": "Alta (Efemérides Suizas)", "lm": "Ajustado para"},
            "fr": {"system": "Placidus", "correction": "Lahiri (Correction Sidérale)", "precision": "Haute (Éphémérides Suisses)", "lm": "Ajusté pour"}
        }
        n = names.get(lang, names["en"])
        return {
            "house_system": n["system"],
            "ayanamsa": n["correction"],
            "precision": n["precision"],
            "local_mean_time": f"{n['lm']} {lat}, {lng}"
        }

    @staticmethod
    def get_cosmic_alerts(lang="en"):
        """
        Checks for major cosmic events: Retrogrades, Eclipses, etc.
        """
        import datetime
        now = datetime.datetime.now()
        
        alerts = []
        
        # Localization Maps
        msgs_en = {
            "Mercury": "Communication delays likely. Double check data.",
            "Mars": "Energy might be inward. Avoid aggression.",
            "Venus": "Reflect on relationships. Re-evaluate values.",
            "Jupiter": "Internal growth favored over external expansion.",
            "Saturn": "Review long term structures. Patience required.",
            "Retrograde": "Retrograde motion detected.",
            "Business": "Business Green Light",
            "BusinessMsg": "Stars adhere to growth today. Good for launching."
        }
        
        msgs_hi = {
            "Mercury": "संचार में देरी संभव। डेटा की दोबारा जाँच करें।",
            "Mars": "ऊर्जा अंतर्मुखी हो सकती है। आक्रामकता से बचें।",
            "Venus": "रिश्तों पर विचार करें। मूल्यों का पुनर्मूल्यांकन करें।",
            "Jupiter": "बाहरी विस्तार की तुलना में आंतरिक विकास को प्राथमिकता दी जाती है।",
            "Saturn": "दीर्घकालिक संरचनाओं की समीक्षा करें। धैर्य की आवश्यकता है।",
            "Retrograde": "वक्री गति का पता चला।",
            "Business": "व्यवसाय शुभ संकेत",
            "BusinessMsg": "सितारे आज विकास के पक्ष में हैं। शुरुआत के लिए अच्छा है।"
        }
        
        msgs = msgs_hi if lang == "hi" else msgs_en
        retro_suffix = " वक्री" if lang == "hi" else " Retrograde"
        
        planet_trans = {
            "Mercury": "बुध", "Mars": "मंगल", "Venus": "शुक्र", "Jupiter": "गुरु", "Saturn": "शनि"
        } if lang == "hi" else {}

        # 1. Retrograde Check (Using Current Transits)
        # We assume Greenwich for global transits
        try:
            transits = KerykeionService.calculate_chart(
                "Transit", now.year, now.month, now.day, now.hour, now.minute,
                "Greenwich", 51.5, 0.0
            )
            
            for p in transits['planets']:
                # Dynamic Retrograde Check using Skyfield Data
                if p.get('retrograde'):
                     # Filter for major planets usually relevant for daily horoscopes
                     if p['name'] in ['Mercury', 'Mars', 'Venus', 'Saturn', 'Jupiter']:
                        p_name = planet_trans.get(p['name'], p['name'])
                        alerts.append({
                            "title": f"{p_name}{retro_suffix}",
                            "severity": "medium",
                            "message": msgs.get(p['name'], msgs["Retrograde"])
                        })

            # Static Database for 2026 (Reliable Fallback for Eclipses & specific ranges)
            retrogrades = [] # Clear static retrogrades as we use dynamic checks now for planets
            
            today_str = now.strftime("%Y-%m-%d")
            
            for r in retrogrades:
                if r['start'] <= today_str <= r['end']:
                    p_name = r['planet'] # Assume English for this fallback
                    alerts.append({
                        "title": f"{p_name}{retro_suffix}",
                        "severity": "medium",
                        "message": f"From {r['start']} to {r['end']}. {r['msg']}"
                    })

            # Check Eclipses 2026
            eclipses = [
                {"date": "2026-02-17", "type": "Annular Solar Eclipse", "type_hi": "कंकन सूर्य ग्रहण", "msg": "A time for new beginnings, but energies are volatile.", "msg_hi": "नई शुरुआत का समय, लेकिन ऊर्जाएं अस्थिर हैं।"},
                {"date": "2026-08-12", "type": "Total Solar Eclipse", "type_hi": "पूर्ण सूर्य ग्रहण", "msg": "Major transformations possible. Keep a low profile.", "msg_hi": "बड़े बदलाव संभव हैं। कम प्रोफ़ाइल रखें।"}
            ]
            
            for e in eclipses:
                # Alert if within 3 days
                e_date = datetime.datetime.strptime(e['date'], "%Y-%m-%d")
                delta = abs((e_date - now).days)
                if delta <= 3:
                     e_type = e['type_hi'] if lang == 'hi' else e['type']
                     e_msg = e['msg_hi'] if lang == 'hi' else e['msg']
                     upcoming_prefix = "आगामी: " if lang == 'hi' else "Upcoming: "
                     
                     alerts.append({
                        "title": f"{upcoming_prefix}{e_type}",
                        "severity": "high",
                        "message": f"{e['date']}. {e_msg} (+/- 3 days)"
                    })
            
            # General "Good Business" check (Waxing Moon + Thursday/Friday)
            # Simple logic
            year_check = any(a['title'].startswith('Mercury') or a['title'].startswith('बुध') for a in alerts)
            if not year_check:
                # If no mercury retrograde
                if now.weekday() in [3, 4]: # Thu, Fri
                    alerts.append({
                        "title": msgs["Business"],
                        "severity": "low",
                        "message": msgs["BusinessMsg"]
                    })

        except Exception as e:
            print(f"Alert calc error: {e}")
            
        return alerts
