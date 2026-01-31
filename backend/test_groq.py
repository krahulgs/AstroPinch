import os
import sys

# Add the current directory to sys.path so we can import services
sys.path.append(os.getcwd())

from services.numerology_service import get_numerology_data

def test_gemini_integration():
    print("Testing Gemini Numerology Integration...")
    
    # Test Data: Famous Physicist Albert Einstein
    name = "Albert Einstein"
    # March 14, 1879
    year = 1879
    month = 3
    day = 14
    
    try:
        data = get_numerology_data(name, year, month, day)
        
        print("\n--- RESULTS ---")
        print(f"Name: {data['name']}")
        print(f"Fadic Number: {data['science_of_success']['fadic_number']}")
        
        if 'ai_insights' in data:
            print("\n✅ AI INSIGHTS GENERATED SUCCESSFULLY:")
            print("-" * 40)
            print(data['ai_insights'])
            print("-" * 40)
            print("Source:", data.get('source'))
            print("Model:", data.get('ai_model'))
        else:
            print("\n❌ NO AI INSIGHTS FOUND.")
            if 'science_of_success' in data:
                print("Science of Success data IS present, but AI failed to generate.")
            
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_gemini_integration()
