# new_pipeline/orchestrator.py

import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from new_pipeline.image_ml_model import predict_image_ml
from new_pipeline.logic_ml_model import predict_logic_ml
from logic.logic_engine import analyze
from logic.llm_formatter import generate_llm_response


DOSHA_LABELS = ["Vata", "Pitta", "Kapha"]


def get_prediction_from_probs(probs):
    max_index = probs.index(max(probs))
    return DOSHA_LABELS[max_index]


def combine_outputs(image_probs, logic_probs):
    """
    Combine Image ML + Logic ML inside orchestrator
    """

    combined_probs = []

    for i in range(len(DOSHA_LABELS)):
        avg_prob = (image_probs[i] + logic_probs[i]) / 2
        combined_probs.append(avg_prob)

    final_prediction = get_prediction_from_probs(combined_probs)

    return {
        "prediction": final_prediction,
        "confidence": combined_probs,
        "image_ml_output": {
            "prediction": get_prediction_from_probs(image_probs),
            "confidence": image_probs
        },
        "logic_ml_output": {
            "prediction": get_prediction_from_probs(logic_probs),
            "confidence": logic_probs
        }
    }


def run_pipeline(symptoms, cnn_output=None, user_message=None, is_followup=False):
    """
    FINAL FLOW

    Symptoms → Logic Engine → Logic ML
    Image → CNN → Image ML
    Both → Orchestrator combine
    Final Result → LLM Formatter
    """

    try:
        # 1. Logic engine scores
        logic_scores = analyze(symptoms)

        # 2. Logic ML prediction
        logic_probs = predict_logic_ml(logic_scores)

        # 3. Image ML prediction
        if cnn_output is not None:
            image_probs = predict_image_ml(cnn_output)
        else:
            # if no image uploaded, use logic only
            image_probs = logic_probs

        # 4. Combine both
        final_result = combine_outputs(image_probs, logic_probs)

        # 5. VERY IMPORTANT:
        # First response MUST come from LLM formatter
        llm_response = generate_llm_response(
            symptoms=symptoms,
            final_result=final_result,
            user_message=user_message,
            is_followup=is_followup
        )

        # If LLM fails or returns empty, fallback safely
        if not llm_response or len(llm_response.strip()) < 10:
            llm_response = f"""
Expert System Prediction:
Likely condition: Dosha imbalance detected
Predicted dosha: {final_result['prediction']}

Ayurvedic Interpretation:
Your symptoms indicate an imbalance mainly related to {final_result['prediction']} dosha.

Home Remedies:
- Drink warm water
- Maintain proper sleep
- Avoid heavy oily food

Diet Recommendations:
- Eat light fresh food
- Avoid excess spicy and junk food

When to See a Doctor:
If symptoms continue for several days or become severe
"""

        return {
            "logic_scores": logic_scores,
            "image_ml_output": final_result["image_ml_output"],
            "logic_ml_output": final_result["logic_ml_output"],
            "final_result": final_result,
            "llm_response": llm_response
        }

    except Exception as e:
        # Expo-safe fallback
        return {
            "llm_response": """
Expert System Prediction:
System is temporarily processing your consultation.

Ayurvedic Interpretation:
Please try again in a moment. Your consultation service is active.

Home Remedies:
- Stay hydrated
- Rest properly
- Avoid stress

Diet Recommendations:
- Light warm meals
- Fresh fruits and vegetables

When to See a Doctor:
If symptoms are severe or urgent
"""
        }