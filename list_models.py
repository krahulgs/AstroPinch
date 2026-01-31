from groq import Groq
import os

key = os.getenv("GROQ_API_KEY", "")
try:
    client = Groq(api_key=key)
    models = client.models.list()
    for m in models.data:
        print(m.id)
except Exception as e:
    print(f"Error: {e}")
