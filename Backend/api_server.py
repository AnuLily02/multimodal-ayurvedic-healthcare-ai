from flask import Flask, request, jsonify
from flask_cors import CORS
import base64

from new_pipeline.integration import handle_user_request
from logic.llm_formatter import generate_llm_response

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        message = data.get("message", "").strip()
        patient = data.get("patient", {}) or {}
        chat_history = data.get("chat_history", []) or []

        symptoms = patient.get("symptoms", "").strip()
        image_url = patient.get("imageUrl")

        image_bytes = None
        if image_url and image_url.startswith("data:image"):
            _, encoded = image_url.split(",", 1)
            image_bytes = base64.b64decode(encoded)

        # Run your existing pipeline exactly as before
        result = handle_user_request(symptoms, image_bytes)

        # First actual user interaction after welcome -> full formatted response
        # Later interactions -> follow-up direct answer only
        #
        # chat_history should contain previous user/assistant messages from frontend.
        # If there has already been one assistant analysis reply, treat current message as follow-up.
        is_followup = len(chat_history) >= 2

        llm_text = generate_llm_response(
            symptoms=symptoms,
            final_result=result,
            user_message=message,
            is_followup=is_followup,
            model_name="llama3:8b"
        )

        return jsonify({
            "reply": llm_text,
            "prediction": result.get("prediction"),
            "confidence": result.get("confidence"),
        })

    except Exception as e:
        return jsonify({
            "reply": f"Backend error: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)