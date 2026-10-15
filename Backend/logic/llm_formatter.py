import ollama


def build_prompt(symptoms, final_result, user_message=None, is_followup=False):
    final_dosha = final_result.get("prediction", "Unknown")
    confidence_list = final_result.get("confidence", [0, 0, 0])
    confidence = max(confidence_list) if confidence_list else 0.0

    if is_followup:
        return f"""
You are a professional Ayurvedic + modern health assistant.

Original user symptoms:
{symptoms}

Final predicted dosha:
{final_dosha}

Confidence:
{confidence:.2f}

User's latest question:
{user_message}

Instructions:
- Answer ONLY the latest question
- Do NOT repeat Expert System Prediction again
- Do NOT repeat Ayurvedic Interpretation again
- Do NOT repeat all remedies again unless asked
- Give only the relevant direct answer
- Keep it clear, helpful, and natural
- Do not add headings unless useful for clarity

Answer:
"""

    return f"""
You are a professional Ayurvedic + modern health assistant.

User symptoms:
{symptoms}

Final predicted dosha:
{final_dosha}

Confidence:
{confidence:.2f}

Your job:
- Give practical, real advice
- Be specific
- Connect symptoms clearly to the dosha pattern

Rules:
- Do not add any introduction line
- Do not repeat any heading twice
- Write exactly in the format below
- After each heading, write the content on the next line
- Under Expert System Prediction, clearly mention the likely issue and the predicted dosha
- DO NOT break headings into multiple lines
- Always write headings in one single line exactly as give

Format EXACTLY like this:

Expert System Prediction:
Likely condition: <clear condition>
Predicted dosha: {final_dosha}

Ayurvedic Interpretation:
<why this happened>

Home Remedies:
- remedy
- remedy

Diet Recommendations:
- foods to eat
- foods to avoid

When to See a Doctor:
<clear condition>
"""


def generate_llm_response(
    symptoms,
    final_result,
    user_message=None,
    is_followup=False,
    model_name="llama3:8b",
):
    prompt = build_prompt(
        symptoms=symptoms,
        final_result=final_result,
        user_message=user_message,
        is_followup=is_followup,
    )

    response = ollama.chat(
        model=model_name,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]