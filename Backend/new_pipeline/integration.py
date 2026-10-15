# new_pipeline/integration.py

from new_pipeline.orchestrator import run_pipeline
from new_pipeline.cnn_model import predict_cnn


def handle_user_request(symptoms, image_bytes=None):
    """
    Final correct flow:

    Image bytes
        ↓
    CNN Model (MobileNet)
        ↓
    CNN output probabilities
        ↓
    Image ML model
        ↓
    Orchestrator combines with Logic ML
        ↓
    LLM final response
    """

    cnn_output = None

    if image_bytes:
        cnn_output = predict_cnn(image_bytes)

    return run_pipeline(
        symptoms=symptoms,
        cnn_output=cnn_output
    )