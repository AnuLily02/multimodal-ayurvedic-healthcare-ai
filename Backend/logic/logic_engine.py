# logic_engine.py
# ---------------------------------------------------------
# Improved Ayurvedic Logic Engine
# Inspired by Charaka-style diagnostic thinking:
# symptom -> qualities (gunas) -> inferred qualities -> dosha scoring
# + severity + context + multi-dosha output + explainable reasoning
# ---------------------------------------------------------

from collections import defaultdict
import re


# ---------------------------------------------------------
# 1. Symptom -> Quality Mapping
# ---------------------------------------------------------
# A symptom may express multiple qualities.
SYMPTOM_QUALITY_MAP = {
    # -------------------------
    # Vata-like symptoms
    # -------------------------
    "dry": ["dryness", "roughness"],
    "dry skin": ["dryness", "roughness"],
    "dry mouth": ["dryness"],
    "cracked lips": ["dryness", "roughness"],
    "constipation": ["dryness", "roughness", "obstruction"],
    "gas": ["mobility", "lightness"],
    "bloating": ["mobility", "distension"],
    "anxiety": ["restlessness", "mobility", "lightness"],
    "fear": ["restlessness", "mobility"],
    "insomnia": ["restlessness", "mobility", "lightness"],
    "tremors": ["mobility", "instability"],
    "twitching": ["mobility", "instability"],
    "stiffness": ["roughness", "hardness", "obstruction"],
    "joint pain": ["sharpness", "dryness", "roughness"],
    "stabbing pain": ["sharpness"],
    "throbbing": ["mobility", "sharpness"],
    "variable appetite": ["irregularity", "lightness"],
    "weight loss": ["lightness", "dryness"],
    "fatigue": ["lightness", "weakness"],
    "palpitations": ["mobility", "instability"],

    # -------------------------
    # Pitta-like symptoms
    # -------------------------
    "burning": ["heat", "sharpness"],
    "burning sensation": ["heat", "sharpness"],
    "hot": ["heat"],
    "fever": ["heat"],
    "acidity": ["heat", "sharpness", "sourness"],
    "acid reflux": ["heat", "sharpness", "sourness"],
    "ulcer": ["heat", "sharpness"],
    "anger": ["heat", "sharpness"],
    "irritability": ["heat", "sharpness"],
    "inflammation": ["heat", "sharpness"],
    "redness": ["heat"],
    "rashes": ["heat", "sharpness"],
    "loose stools": ["liquidity", "heat"],
    "diarrhea": ["liquidity", "heat", "sharpness"],
    "excessive hunger": ["sharpness", "heat"],
    "thirst": ["heat", "dryness"],
    "sour belching": ["sourness", "heat"],
    "foul smell": ["heat", "sharpness"],

    # -------------------------
    # Kapha-like symptoms
    # -------------------------
    "mucus": ["sliminess", "heaviness", "congestion"],
    "phlegm": ["sliminess", "heaviness", "congestion"],
    "blocked nose": ["congestion", "obstruction", "heaviness"],
    "blocked": ["congestion", "obstruction"],
    "cold": ["coldness", "heaviness"],
    "cough": ["congestion", "sliminess"],
    "wheezing": ["congestion", "obstruction"],
    "heaviness": ["heaviness"],
    "swelling": ["heaviness", "stability", "fluidity"],
    "lethargy": ["heaviness", "slowness", "stability"],
    "drowsiness": ["heaviness", "slowness"],
    "sleepiness": ["heaviness", "slowness"],
    "slow digestion": ["heaviness", "slowness"],
    "indigestion": ["heaviness", "slowness"],
    "nausea": ["heaviness", "sliminess"],
    "water retention": ["fluidity", "heaviness"],
    "weight gain": ["heaviness", "stability"],
    "lazy": ["heaviness", "slowness"],
    "sticky stools": ["sliminess", "heaviness"],
    "white coating": ["sliminess", "heaviness"],

    # -------------------------
    # General / overlapping
    # -------------------------
    "pain": ["discomfort"],
    "loss of appetite": ["slowness", "heaviness"],
    "weakness": ["weakness"],
    "body ache": ["heaviness", "discomfort"],
    "sharp pain": ["sharpness"],
    "dull pain": ["heaviness", "slowness"],
    "chills": ["coldness"],
    "restless": ["restlessness", "mobility"],
    "agitated": ["restlessness", "heat"],
}


# ---------------------------------------------------------
# 2. Quality -> Dosha Mapping
# ---------------------------------------------------------
DOSHA_QUALITIES = {
    "Vata": {
        "dryness", "roughness", "lightness", "mobility", "restlessness",
        "instability", "irregularity", "hardness", "obstruction", "distension",
        "weakness", "sharpness"
    },
    "Pitta": {
        "heat", "sharpness", "liquidity", "sourness"
    },
    "Kapha": {
        "heaviness", "coldness", "sliminess", "stability", "slowness",
        "congestion", "fluidity", "obstruction"
    }
}


# ---------------------------------------------------------
# 3. Severity Words
# ---------------------------------------------------------
SEVERITY_MAP = {
    "mild": 1,
    "moderate": 2,
    "severe": 3,
    "extreme": 4,
    "intense": 4,
    "unbearable": 5,
    "chronic": 3,
    "persistent": 3,
    "constant": 3,
    "acute": 2,
    "sudden": 2,
}


# ---------------------------------------------------------
# 4. Context Biases
# ---------------------------------------------------------
TIME_OF_DAY_BIAS = {
    "morning": {"Kapha": 1.5},
    "afternoon": {"Pitta": 1.5},
    "evening": {"Vata": 1.0},
    "night": {"Vata": 1.5},
}

AGE_BIAS = {
    "child": {"Kapha": 1.5},
    "young": {},
    "adult": {"Pitta": 0.5},
    "middle": {"Pitta": 1.0},
    "old": {"Vata": 1.5},
    "elderly": {"Vata": 1.5},
}

SEASON_BIAS = {
    "summer": {"Pitta": 1.5},
    "rainy": {"Vata": 1.0, "Pitta": 0.5},
    "monsoon": {"Vata": 1.0, "Pitta": 0.5},
    "winter": {"Kapha": 1.0, "Vata": 0.5},
    "spring": {"Kapha": 1.5},
    "autumn": {"Pitta": 1.5},
}


# ---------------------------------------------------------
# 5. Utility
# ---------------------------------------------------------
def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


# ---------------------------------------------------------
# 6. Extract matched symptom phrases
# ---------------------------------------------------------
def extract_matched_symptoms(user_input: str):
    text = clean_text(user_input)
    matched = []

    # Sort by length so longer phrases match first
    phrases = sorted(SYMPTOM_QUALITY_MAP.keys(), key=len, reverse=True)

    for phrase in phrases:
        if phrase in text:
            matched.append(phrase)

    return matched


# ---------------------------------------------------------
# 7. Map symptoms to qualities
# ---------------------------------------------------------
def extract_base_qualities(matched_symptoms):
    qualities = []
    quality_reasons = defaultdict(list)

    for symptom in matched_symptoms:
        for q in SYMPTOM_QUALITY_MAP[symptom]:
            qualities.append(q)
            quality_reasons[q].append(f"'{symptom}'")

    return qualities, dict(quality_reasons)


# ---------------------------------------------------------
# 8. Inference Layer
# ---------------------------------------------------------
def infer_hidden_qualities(base_qualities):
    inferred = []
    inference_reasons = defaultdict(list)
    qset = set(base_qualities)

    # Vata inferences
    if "restlessness" in qset:
        inferred.append("mobility")
        inference_reasons["mobility"].append("inferred from restlessness")

    if "mobility" in qset and "lightness" not in qset:
        inferred.append("lightness")
        inference_reasons["lightness"].append("inferred from mobility")

    if "dryness" in qset and "roughness" not in qset:
        inferred.append("roughness")
        inference_reasons["roughness"].append("inferred from dryness")

    if "irregularity" in qset:
        inferred.append("mobility")
        inference_reasons["mobility"].append("inferred from irregularity")

    # Pitta inferences
    if "heat" in qset and "sharpness" not in qset:
        inferred.append("sharpness")
        inference_reasons["sharpness"].append("inferred from heat")

    if "sourness" in qset and "heat" not in qset:
        inferred.append("heat")
        inference_reasons["heat"].append("inferred from sourness")

    if "liquidity" in qset and "heat" in qset:
        inferred.append("sharpness")
        inference_reasons["sharpness"].append("inferred from liquidity + heat")

    # Kapha inferences
    if "heaviness" in qset and "slowness" not in qset:
        inferred.append("slowness")
        inference_reasons["slowness"].append("inferred from heaviness")

    if "sliminess" in qset and "heaviness" not in qset:
        inferred.append("heaviness")
        inference_reasons["heaviness"].append("inferred from sliminess")

    if "congestion" in qset and "obstruction" not in qset:
        inferred.append("obstruction")
        inference_reasons["obstruction"].append("inferred from congestion")

    # De-duplicate but preserve explanations
    inferred_unique = []
    seen = set(base_qualities)

    for q in inferred:
        if q not in seen and q not in inferred_unique:
            inferred_unique.append(q)

    return inferred_unique, dict(inference_reasons)


# ---------------------------------------------------------
# 9. Severity Extraction
# ---------------------------------------------------------
def detect_severity(user_input: str):
    text = clean_text(user_input)
    severity_score = 0
    found = []

    for word, score in SEVERITY_MAP.items():
        if word in text:
            severity_score += score
            found.append(word)

    return severity_score, found


# ---------------------------------------------------------
# 10. Context Extraction
# ---------------------------------------------------------
def extract_context(user_input: str, context=None):
    """
    context example:
    {
        "time_of_day": "morning",
        "age_group": "adult",
        "season": "summer"
    }
    """
    text = clean_text(user_input)
    extracted = {
        "time_of_day": None,
        "age_group": None,
        "season": None
    }

    if context:
        extracted.update(context)

    # Light text-based inference if context not explicitly passed
    if extracted["time_of_day"] is None:
        for key in TIME_OF_DAY_BIAS:
            if key in text:
                extracted["time_of_day"] = key
                break

    if extracted["age_group"] is None:
        age_keywords = {
            "child": "child",
            "kid": "child",
            "young": "young",
            "adult": "adult",
            "middle age": "middle",
            "old age": "old",
            "old": "old",
            "elderly": "elderly",
        }
        for phrase, mapped in age_keywords.items():
            if phrase in text:
                extracted["age_group"] = mapped
                break

    if extracted["season"] is None:
        for key in SEASON_BIAS:
            if key in text:
                extracted["season"] = key
                break

    return extracted


# ---------------------------------------------------------
# 11. Score Doshas
# ---------------------------------------------------------
def score_doshas(all_qualities, user_input, context=None):
    scores = {"Vata": 0.0, "Pitta": 0.0, "Kapha": 0.0}
    score_reasons = {
        "Vata": [],
        "Pitta": [],
        "Kapha": []
    }

    # Base quality scoring
    for q in all_qualities:
        for dosha, traits in DOSHA_QUALITIES.items():
            if q in traits:
                scores[dosha] += 2.0
                score_reasons[dosha].append(f"+2 from quality '{q}'")

    # Severity boost
    severity_score, severity_words = detect_severity(user_input)
    if severity_score > 0:
        current_dominant = max(scores, key=scores.get)
        scores[current_dominant] += severity_score
        score_reasons[current_dominant].append(
            f"+{severity_score} severity boost from {severity_words}"
        )

    # Context biases
    extracted_context = extract_context(user_input, context=context)

    if extracted_context["time_of_day"] in TIME_OF_DAY_BIAS:
        for dosha, bonus in TIME_OF_DAY_BIAS[extracted_context["time_of_day"]].items():
            scores[dosha] += bonus
            score_reasons[dosha].append(
                f"+{bonus} time-of-day bias ({extracted_context['time_of_day']})"
            )

    if extracted_context["age_group"] in AGE_BIAS:
        for dosha, bonus in AGE_BIAS[extracted_context["age_group"]].items():
            scores[dosha] += bonus
            score_reasons[dosha].append(
                f"+{bonus} age-group bias ({extracted_context['age_group']})"
            )

    if extracted_context["season"] in SEASON_BIAS:
        for dosha, bonus in SEASON_BIAS[extracted_context["season"]].items():
            scores[dosha] += bonus
            score_reasons[dosha].append(
                f"+{bonus} seasonal bias ({extracted_context['season']})"
            )

    return scores, score_reasons, extracted_context


# ---------------------------------------------------------
# 12. Normalize Scores
# ---------------------------------------------------------
def normalize_scores(scores):
    total = sum(scores.values())

    if total == 0:
        return {k: 0.0 for k in scores}

    return {
        dosha: round((score / total) * 100, 1)
        for dosha, score in scores.items()
    }


# ---------------------------------------------------------
# 13. Multi-Dosha Classification
# ---------------------------------------------------------
def classify_dosha(normalized_scores, threshold=10.0):
    ranked = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)

    if ranked[0][1] == 0:
        return "Undetermined"

    # Dual-dosha if top two are close
    if abs(ranked[0][1] - ranked[1][1]) <= threshold:
        return f"{ranked[0][0]}-{ranked[1][0]}"

    return ranked[0][0]


# ---------------------------------------------------------
# 14. Build Explainable Output
# ---------------------------------------------------------
def build_explanation(matched_symptoms, quality_reasons, inferred_reasons, score_reasons):
    return {
        "matched_symptoms": matched_symptoms,
        "quality_reasons": quality_reasons,
        "inferred_quality_reasons": inferred_reasons,
        "dosha_score_reasons": score_reasons
    }


# ---------------------------------------------------------
# 15. Main Analyze Function
# ---------------------------------------------------------
def analyze(user_input: str, context=None):
    """
    Analyze symptom text and return dosha interpretation.

    Parameters
    ----------
    user_input : str
        Symptom description from user.
    context : dict, optional
        Example:
        {
            "time_of_day": "morning",
            "age_group": "adult",
            "season": "summer"
        }

    Returns
    -------
    dict
    """
    if not user_input or not user_input.strip():
        return {
            "qualities_detected": [],
            "inferred_qualities": [],
            "dosha_scores": {"Vata": 0.0, "Pitta": 0.0, "Kapha": 0.0},
            "dominant_dosha": "Undetermined",
            "context_used": {},
            "explanation": {
                "matched_symptoms": [],
                "quality_reasons": {},
                "inferred_quality_reasons": {},
                "dosha_score_reasons": {}
            }
        }

    matched_symptoms = extract_matched_symptoms(user_input)
    base_qualities, quality_reasons = extract_base_qualities(matched_symptoms)
    inferred_qualities, inferred_reasons = infer_hidden_qualities(base_qualities)

    all_qualities = base_qualities + inferred_qualities

    raw_scores, score_reasons, extracted_context = score_doshas(
        all_qualities, user_input, context=context
    )
    normalized_scores = normalize_scores(raw_scores)
    dominant = classify_dosha(normalized_scores)

    explanation = build_explanation(
        matched_symptoms=matched_symptoms,
        quality_reasons=quality_reasons,
        inferred_reasons=inferred_reasons,
        score_reasons=score_reasons
    )

    return {
        "qualities_detected": base_qualities,
        "inferred_qualities": inferred_qualities,
        "all_qualities": all_qualities,
        "dosha_scores": normalized_scores,
        "dominant_dosha": dominant,
        "context_used": extracted_context,
        "explanation": explanation
    }


# ---------------------------------------------------------
# 16. Optional Pretty Printer
# ---------------------------------------------------------
def pretty_print_result(result):
    print("\n===== Ayurvedic Logic Engine Result =====")
    print(f"Dominant Dosha: {result['dominant_dosha']}")
    print(f"Scores: {result['dosha_scores']}")
    print(f"Base Qualities: {result['qualities_detected']}")
    print(f"Inferred Qualities: {result['inferred_qualities']}")
    print(f"Context Used: {result['context_used']}")
    print("\n--- Explanation ---")
    print("Matched Symptoms:", result["explanation"]["matched_symptoms"])
    print("Quality Reasons:", result["explanation"]["quality_reasons"])
    print("Inferred Quality Reasons:", result["explanation"]["inferred_quality_reasons"])
    print("Dosha Score Reasons:", result["explanation"]["dosha_score_reasons"])
    print("========================================\n")


# ---------------------------------------------------------
# 17. Test Examples
# ---------------------------------------------------------
if __name__ == "__main__":
    test_inputs = [
        "I have dry skin, constipation, gas, anxiety and insomnia. It feels severe and chronic.",
        "I feel burning sensation, acidity, anger, redness and loose stools in summer afternoon.",
        "I have mucus, cough, heaviness, lethargy and blocked nose in the morning.",
        "I feel both acidity and anxiety with poor sleep and bloating.",
        "There is swelling, cold, drowsiness and indigestion."
    ]

    test_contexts = [
        {"time_of_day": "night", "age_group": "old", "season": "winter"},
        {"time_of_day": "afternoon", "age_group": "adult", "season": "summer"},
        {"time_of_day": "morning", "age_group": "child", "season": "spring"},
        {"time_of_day": "night", "age_group": "adult", "season": "autumn"},
        {"time_of_day": "morning", "age_group": "adult", "season": "winter"},
    ]

    for text, ctx in zip(test_inputs, test_contexts):
        print(f"INPUT: {text}")
        result = analyze(text, context=ctx)
        pretty_print_result(result)