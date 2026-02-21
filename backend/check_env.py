import os
from dotenv import load_dotenv
load_dotenv()
key = os.getenv("GROQ_API_KEY")
print(f"GROQ_API_KEY is {'SET' if key else 'MISSING'}")
if key:
    print(f"Key starts with: {key[:5]}...")
