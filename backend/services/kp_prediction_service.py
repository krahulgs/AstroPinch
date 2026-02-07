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
        }
    }
    
    @staticmethod
    def generate_event_predictions(kp_cusps, kp_system_data, dasha_data=None, lang="en"):
        """
        Generate event-based KP predictions with Yes/No/Delayed/Unlikely outcomes.
        
        Args:
            kp_cusps: Dictionary of house cusps with sub-lords
            kp_system_data: KP system calculation data
            dasha_data: Current dasha periods for timing
            lang: Language code
            
        Returns:
            Dictionary with predictions array
        """
        if not kp_cusps:
            return {"predictions": []}
        
        predictions = []
        
        # Generate predictions for key life events
        events_to_analyze = ["Marriage", "Job Change", "Business", "Childbirth", "Property"]
        
        for event in events_to_analyze:
            prediction = KPPredictionService._analyze_event(
                event, kp_cusps, kp_system_data, dasha_data, lang
            )
            if prediction:
                predictions.append(prediction)
        
        return {"predictions": predictions}
    
    @staticmethod
    def _analyze_event(event_name, kp_cusps, kp_system_data, dasha_data, lang):
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
            }
        }
        
        templates = guidance_templates.get(event_name, {})
        return templates.get(outcome, "Stay focused on your goals and maintain a positive approach to life's opportunities.")


if __name__ == "__main__":
    print("KP Prediction Service loaded.")
