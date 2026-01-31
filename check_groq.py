from groq import Groq
import os

key = os.getenv("GROQ_API_KEY")
try:
    client = Groq(api_key=key)
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": "test"}],
        model="llama3-8b-8192",
    )
    print("Groq Connection OK")
    print(response.choices[0].message.content[:50])
except Exception as e:
    print(f"Groq Error: {e}")
