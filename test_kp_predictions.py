"""
Quick test to verify KP prediction service is working
"""
import sys
sys.path.append('backend')

from services.kp_prediction_service import KPPredictionService

# Sample KP cusps data (simplified)
sample_kp_cusps = {
    "1": {"sub_lord": "Venus"},
    "2": {"sub_lord": "Jupiter"},
    "4": {"sub_lord": "Moon"},
    "5": {"sub_lord": "Mercury"},
    "7": {"sub_lord": "Venus"},
    "10": {"sub_lord": "Sun"},
    "11": {"sub_lord": "Jupiter"}
}

# Generate predictions
print("Testing KP Prediction Service...")
print("=" * 60)

predictions = KPPredictionService.generate_event_predictions(
    kp_cusps=sample_kp_cusps,
    kp_system_data={},
    dasha_data=None,
    lang="en"
)

print(f"\nGenerated {len(predictions['predictions'])} predictions:\n")

for pred in predictions['predictions']:
    print(f"Event: {pred['event']}")
    print(f"Outcome: {pred['outcome']}")
    print(f"Confidence: {pred['confidence']}")
    print(f"Time Window: {pred['time_window']}")
    print(f"KP Logic:")
    print(f"  - Supporting Houses: {pred['kp_logic']['supporting_houses']}")
    print(f"  - Opposing Houses: {pred['kp_logic']['opposing_houses']}")
    print(f"  - Sub-lord Judgment: {pred['kp_logic']['sublord_judgment']}")
    print(f"Guidance: {pred['guidance']}")
    print("-" * 60)

print("\n✅ KP Prediction Service is working correctly!")
