from services.astrology_aggregator import AstrologyAggregator
import inspect

print("Checking AstrologyAggregator...")
if hasattr(AstrologyAggregator, 'get_vedic_full_report'):
    print("Method 'get_vedic_full_report' EXISTS.")
    sig = inspect.signature(AstrologyAggregator.get_vedic_full_report)
    print(f"Signature: {sig}")
else:
    print("Method 'get_vedic_full_report' is MISSING!")
