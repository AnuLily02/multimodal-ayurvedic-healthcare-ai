import ollama

response = ollama.chat(
    model="phi",
    messages=[
        {
            "role": "user",
            "content": "I feel dryness, anxiety, and irregular sleep. Explain this in Ayurvedic terms."
        }
    ],
)

print("\nLLM Response:\n")
print(response["message"]["content"])
