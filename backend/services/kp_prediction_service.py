"""
KP Astrology Event Prediction Service
Generates event-based predictions using KP sub-lord theory, ruling planets, and significators.
"""

class KPPredictionService:
    """
    Expert KP Astrology prediction engine following Krishnamurti Paddhati principles.
    Provides clear, event-based, outcome-oriented predictions.
    """
    
    # House signification rules for different events
    HOUSE_SIGNIFICATIONS = {
        # Adult events
        "Marriage": {
            "positive": [2, 7, 11],
            "negative": [1, 6, 10]
        },
        "Job Change": {
            "positive": [6, 10, 11],
            "negative": [1, 5, 8]
        },
        "New Job": {
            "positive": [2, 6, 10, 11],
            "negative": [1, 8]
        },
        "Business": {
            "positive": [7, 10, 11],
            "negative": [1, 6]
        },
        "Love Marriage": {
            "positive": [5, 7, 11],
            "negative": [1, 6, 10]
        },
        "Childbirth": {
            "positive": [2, 5, 11],
            "negative": [1, 6, 10]
        },
        "Property": {
            "positive": [4, 11],
            "negative": [1, 8]
        },
        "Legal Success": {
            "positive": [6, 11],
            "negative": [1, 8, 12]
        },
        "Health Recovery": {
            "positive": [6, 11],
            "negative": [1, 8, 12]
        },
        # Age-appropriate events
        "Education Success": {
            "positive": [4, 5, 9, 11],
            "negative": [3, 8]
        },
        "Higher Studies": {
            "positive": [4, 9, 11],
            "negative": [3, 8]
        },
        "Career Guidance": {
            "positive": [10, 11],
            "negative": [8]
        },
        "Health & Wellness": {
            "positive": [1, 11],
            "negative": [6, 8, 12]
        },
        "Talent Development": {
            "positive": [3, 5, 11],
            "negative": [8]
        }
    }
    
    # Age-appropriate events mapping
    AGE_APPROPRIATE_EVENTS = {
        "child": {  # 0-12 years
            "events": ["Education Success", "Health & Wellness", "Talent Development"],
            "min_age": 0,
            "max_age": 12
        },
        "teenager": {  # 13-17 years
            "events": ["Education Success", "Higher Studies", "Career Guidance", "Health & Wellness"],
            "min_age": 13,
            "max_age": 17
        },
        "young_adult": {  # 18-25 years
            "events": ["Higher Studies", "New Job", "Career Guidance", "Property"],
            "min_age": 18,
            "max_age": 25
        },
        "adult": {  # 26+ years
            "events": ["Marriage", "Job Change", "Business", "Childbirth", "Property"],
            "min_age": 26,
            "max_age": 150
        }
    }
    
    @staticmethod
    def generate_event_predictions(kp_cusps, kp_system_data, dasha_data=None, lang="en", age=None):
        """
        Generate event-based KP predictions with Yes/No/Delayed/Unlikely outcomes.
        Age-aware: Only shows appropriate life events based on person's age.
        
        Args:
            kp_cusps: Dictionary of house cusps with sub-lords
            kp_system_data: KP system calculation data
            dasha_data: Current dasha periods for timing
            lang: Language code
            age: Person's age in years (optional but recommended)
            
        Returns:
            Dictionary with predictions array
        """
        if not kp_cusps:
            return {"predictions": []}
        
        predictions = []
        
        # Determine age-appropriate events
        events_to_analyze = KPPredictionService._get_age_appropriate_events(age)
        
        for event in events_to_analyze:
            prediction = KPPredictionService._analyze_event(
                event, kp_cusps, kp_system_data, dasha_data, lang, age
            )
            if prediction:
                predictions.append(prediction)
        
        return {"predictions": predictions}
    
    @staticmethod
    def _get_age_appropriate_events(age):
        """
        Get list of appropriate events based on person's age.
        """
        if age is None:
            # Default to adult events if age not provided
            return ["Marriage", "Job Change", "Business", "Property"]
        
        # Determine age category
        for category, config in KPPredictionService.AGE_APPROPRIATE_EVENTS.items():
            if config["min_age"] <= age <= config["max_age"]:
                return config["events"]
        
        # Default to adult events if age is very high
        return ["Marriage", "Job Change", "Business", "Childbirth", "Property"]
    
    @staticmethod
    def _analyze_event(event_name, kp_cusps, kp_system_data, dasha_data, lang, age):
        """
        Analyze a specific event using KP logic.
        """
        significations = KPPredictionService.HOUSE_SIGNIFICATIONS.get(event_name)
        if not significations:
            return None
        
        positive_houses = significations["positive"]
        negative_houses = significations["negative"]
        
        # Determine primary cusp for this event
        primary_cusp = positive_houses[0] if positive_houses else 1
        cusp_data = kp_cusps.get(str(primary_cusp), {})
        sub_lord = cusp_data.get("sub_lord", "Unknown")
        
        # Analyze sub-lord connections (simplified for now)
        outcome, confidence, kp_logic = KPPredictionService._determine_outcome(
            sub_lord, positive_houses, negative_houses, event_name
        )
        
        # Determine time window based on dasha (simplified)
        time_window = KPPredictionService._get_time_window(outcome, dasha_data, event_name)
        
        # Generate guidance
        guidance = KPPredictionService._get_guidance(event_name, outcome, lang)
        
        return {
            "event": event_name,
            "outcome": outcome,
            "time_window": time_window,
            "confidence": confidence,
            "kp_logic": kp_logic,
            "guidance": guidance
        }
    
    @staticmethod
    def _determine_outcome(sub_lord, positive_houses, negative_houses, event_name):
        """
        Determine outcome based on sub-lord and house connections.
        This is a simplified implementation - full KP logic would check:
        - Sub-lord's star lord
        - Sub-lord's house lordship
        - Significators
        - Ruling planets
        """
        # Simplified logic based on sub-lord
        benefic_planets = ["Venus", "Jupiter", "Mercury", "Moon"]
        malefic_planets = ["Saturn", "Mars", "Rahu", "Ketu"]
        
        # Default analysis
        supporting = ", ".join(map(str, positive_houses))
        opposing = ", ".join(map(str, negative_houses)) if negative_houses else "None"
        
        if sub_lord in benefic_planets:
            outcome = "Yes"
            confidence = "High"
            sublord_judgment = f"{sub_lord} as sub-lord supports houses {supporting}"
        elif sub_lord in malefic_planets:
            if event_name in ["Job Change", "Business"]:
                outcome = "Delayed"
                confidence = "Medium"
                sublord_judgment = f"{sub_lord} shows obstacles but eventual success"
            else:
                outcome = "Delayed"
                confidence = "Medium"
                sublord_judgment = f"{sub_lord} indicates delays and challenges"
        else:  # Sun
            outcome = "Yes"
            confidence = "High"
            sublord_judgment = f"{sub_lord} powerfully supports the event"
        
        kp_logic = {
            "supporting_houses": supporting,
            "opposing_houses": opposing,
            "sublord_judgment": sublord_judgment
        }
        
        return outcome, confidence, kp_logic
    
    @staticmethod
    def _get_time_window(outcome, dasha_data, event_name):
        """
        Determine time window based on outcome and dasha periods.
        """
        if outcome == "No" or outcome == "Unlikely":
            return "Not indicated currently"
        
        # Simplified timing - in full implementation, would analyze:
        # - Current mahadasha and bhukti
        # - Transit confirmations
        # - Ruling planets
        
        import datetime
        current_year = datetime.datetime.now().year
        
        if outcome == "Yes":
            return f"March {current_year} – August {current_year + 1}"
        elif outcome == "Delayed":
            return f"Late {current_year + 1} – {current_year + 2}"
        else:
            return "Not indicated currently"
    
    @staticmethod
    def _get_guidance(event_name, outcome, lang):
        """
        Generate practical, constructive guidance for the event.
        """
        guidance_templates = {
            "Marriage": {
                "Yes": "Focus on social connections and family introductions during this favorable period. Venus dasha supports marriage prospects.",
                "Delayed": "Current planetary periods suggest patience. Use this time to focus on personal growth and career stability.",
                "No": "Marriage timing is not strongly indicated now. Focus on building strong foundations in other life areas."
            },
            "Job Change": {
                "Yes": "Favorable period for career moves. Update your resume and actively network with industry contacts.",
                "Delayed": "Current dasha doesn't strongly support job change. Wait for next dasha period starting late this year.",
                "No": "Job change is not recommended currently. Focus on skill development and strengthening current position."
            },
            "Business": {
                "Yes": "Excellent time to launch business ventures. Ensure proper planning and seek expert financial advice.",
                "Delayed": "Business prospects exist but require more preparation. Use this time to build resources and partnerships.",
                "No": "Business timing is challenging now. Consider partnership opportunities or wait for better planetary support."
            },
            "Childbirth": {
                "Yes": "Favorable period for family expansion. Ensure proper health checkups and maintain positive environment.",
                "Delayed": "Timing suggests patience. Focus on health and wellness to prepare for future opportunities.",
                "No": "Current indicators are mixed. Consult medical professionals and maintain optimistic outlook."
            },
            "Property": {
                "Yes": "Good time for property investments. Research thoroughly and ensure legal documentation is clear.",
                "Delayed": "Property acquisition may take longer than expected. Be patient and don't rush into decisions.",
                "No": "Property purchase is not strongly indicated now. Continue saving and wait for better opportunities."
            },
            # Age-appropriate event guidance
            "Education Success": {
                "Yes": "Excellent period for academic achievements. Focus on studies with dedication and seek help when needed.",
                "Delayed": "Success will come with consistent effort. Develop good study habits and stay curious about learning.",
                "No": "Academic progress requires extra attention. Consider tutoring or different learning approaches."
            },
            "Higher Studies": {
                "Yes": "Favorable time for pursuing higher education. Research programs thoroughly and prepare applications carefully.",
                "Delayed": "Consider gaining work experience first. Use this time to clarify your academic and career goals.",
                "No": "Timing suggests focusing on current education or work. Revisit higher studies plans in future."
            },
            "Career Guidance": {
                "Yes": "Good period to explore career options. Seek mentorship, internships, and skill development opportunities.",
                "Delayed": "Take time to discover your interests. Try different activities and build diverse skills.",
                "No": "Focus on current education and personal growth. Career clarity will develop naturally over time."
            },
            "Health & Wellness": {
                "Yes": "Excellent vitality indicated. Maintain healthy habits through balanced diet, exercise, and adequate rest.",
                "Delayed": "Pay attention to health routines. Establish good habits now for long-term wellness.",
                "No": "Extra care needed for health. Consult healthcare professionals and prioritize self-care."
            },
            "Talent Development": {
                "Yes": "Perfect time to develop creative talents. Dedicate regular practice time and seek quality instruction.",
                "Delayed": "Talents will flourish with patience. Explore different interests and enjoy the learning process.",
                "No": "Focus on foundational skills first. Every talent develops at its own pace."
            }
        }
        
        templates = guidance_templates.get(event_name, {})
        return templates.get(outcome, "Stay focused on your goals and maintain a positive approach to life's opportunities.")


if __name__ == "__main__":
    print("KP Prediction Service loaded.")
