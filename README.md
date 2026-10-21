# Multimodal Ayurvedic Healthcare Intelligence System using Deep Learning and Generative AI

## 📌 Project Overview

The **Multimodal Ayurvedic Healthcare Intelligence System using Deep Learning and Generative AI** is an AI-based healthcare intelligence project designed to explore how artificial intelligence can support Ayurvedic health assessment through multiple input modalities.

The system combines tongue image analysis, symptom-based assessment, machine learning, deep learning, and Generative AI to provide an integrated health assessment experience. It accepts user information, health-related symptoms, and tongue images to generate expert system predictions and AI-generated explanations.

The project integrates a deep learning-based image classification model with a machine learning-based prediction component and a Generative AI conversational interface.

## 🎯 Objectives

- To explore the application of Artificial Intelligence in Ayurvedic healthcare.
- To analyze tongue images using deep learning techniques.
- To process user-provided symptoms and health-related information for expert system prediction.
- To integrate image-based analysis and logic-based prediction into a multimodal system.
- To use Generative AI to provide conversational explanations of assessment results.
- To develop an interactive web interface for submitting health information and viewing results.
- To demonstrate the integration of machine learning, deep learning, REST APIs, and Large Language Models in a healthcare-oriented application.

## ✨ Key Features

- **User Health Information:** Accepts relevant user details, including date of birth, sex, height, weight, and symptoms.
- **Tongue Image Analysis:** Uses a deep learning model to analyze uploaded tongue images.
- **Symptom-Based Assessment:** Processes symptom-related inputs through a machine learning-based prediction component.
- **Multimodal Integration:** Combines image-based and structured health information within one application.
- **Expert System Prediction:** Presents prediction results based on the implemented models and system logic.
- **Generative AI Assistant:** Integrates Llama 3 through Ollama to support conversational interaction and result explanations.
- **Interactive Web Interface:** Provides a user interface for entering information, uploading images, and viewing results.
- **Backend API Integration:** Uses Flask to connect the frontend with the AI prediction components.
- **Report Generation:** Includes a prescription/report download feature in the user interface.


## 🖥️Application Screenshots

The following screenshots illustrate the application workflow. Replace the image paths below with the screenshots added to the screenshots/ folder.
1. Home Page
   <img width="1280" height="692" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (4)" src="https://github.com/user-attachments/assets/7405aee6-819b-45e2-aae5-2e6b2ed3bc26" />
   <img width="1280" height="688" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (1)" src="https://github.com/user-attachments/assets/dd948788-319d-499a-9553-80daa2c20a54" />


2. Patient Information and Symptom Input
   <img width="1280" height="687" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (2)" src="https://github.com/user-attachments/assets/63476762-da5a-461d-a4ff-a4aa3d73de0c" />
   <img width="1280" height="719" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (5)" src="https://github.com/user-attachments/assets/520878bb-0be0-4ea0-b061-b944dbc1c6e0" />


3. Generative AI Chatbot
    <img width="1280" height="719" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (5)" src="https://github.com/user-attachments/assets/520878bb-0be0-4ea0-b061-b944dbc1c6e0" />


4. Assessment Report
     <img width="1280" height="719" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM (5)" src="https://github.com/user-attachments/assets/35a2d8ae-43f7-4e2e-a56c-da517fb0305d" />
     <img width="1280" height="734" alt="WhatsApp Image 2026-10-20 at 7 00 30 PM" src="https://github.com/user-attachments/assets/32258124-2614-46d0-bda2-4c0a694090a5" />


## 🧠 Technologies Used

### Programming Languages

- Python
- JavaScript

### Artificial Intelligence and Machine Learning

- Machine Learning
- Deep Learning
- Convolutional Neural Networks (CNN)
- MobileNet-based image classification
- Random Forest-based prediction component
- Synthetic data for model development

### Generative AI

- Large Language Models (LLMs)
- Llama 3 (8B)
- Ollama

### Backend

- Flask
- Python-based prediction and processing
- REST API integration

### Frontend

- Next.js
- React
- JavaScript
- HTML
- CSS

### Data Processing and Model Storage

- Pandas
- NumPy
- Scikit-learn
- Joblib
- TensorFlow/Keras

*The exact libraries and versions depend on the implementation and project environment.*

## 🏗️ System Architecture

The system follows a frontend–backend architecture with AI components integrated into the backend.

1. **User Input:** The user enters the required health information and symptoms and uploads a tongue image.
2. **Frontend Processing:** The web interface collects the inputs and sends the relevant information to the backend.
3. **Flask Backend:** The backend receives requests from the frontend and coordinates the prediction workflow.
4. **Tongue Image Analysis:** The image classification model processes the submitted tongue image.
5. **Symptom-Based Prediction:** The machine learning component processes structured inputs using the trained model and implemented logic.
6. **Multimodal Integration:** The outputs from the relevant components are combined within the implemented assessment workflow.
7. **Generative AI Interaction:** Llama 3, accessed through Ollama, supports conversational responses and explanations.
8. **Result Presentation:** The frontend displays the assessment results and provides the available report download functionality.

## 🔬 AI Models and Components

### 1. Tongue Image Classification

The project uses a MobileNet-based deep learning model to analyze tongue images.

The image classification workflow is designed to learn visual patterns from the tongue image dataset and generate a model prediction.

**Model-related files may include:**

- `mobilenet_tongue.h5`
- `image_ml.pkl`

The `.h5` file represents the saved image model, while the `.pkl` file is used for the image prediction component in the existing implementation.

### 2. Symptom-Based Prediction

The system includes a machine learning-based component for processing structured health information and symptoms.

The current project implementation uses a trained prediction model developed with synthetic samples.

**Model-related file:**

- `logic_ml.pkl`

The model and associated processing logic are used to generate predictions from the supported input features.

### 3. Generative AI Integration

The system integrates **Llama 3 (8B)** through Ollama to provide conversational interaction.

The Generative AI component supports natural-language explanations and responses based on the information supplied to it by the application.

The model's responses are intended to complement the implemented prediction components rather than independently establish a medical diagnosis.

## 🔄 Application Workflow

```text
User
 |
 v
Web Interface (Next.js)
 |
 |-- Personal and Health Information
 |-- Symptoms
 |-- Tongue Image
 |
 v
Flask Backend
 |
 |----------------------------|
 |                            |
 v                            v
Tongue Image Model      Symptom-Based Model
(MobileNet-based)       (Machine Learning)
 |                            |
 |----------------------------|
              |
              v
     Assessment Integration
              |
              v
     Generative AI (Llama 3)
        through Ollama
              |
              v
       Results and Explanation
              |
              v
       Web Interface Output
              |
              v
       Report Download
```

*This diagram represents the intended high-level workflow. The exact execution sequence depends on the current backend implementation.*

## 📂 Project Structure

The following is a suggested structure based on the project's components. Adjust folder names to match the files in your actual GitHub repository.

```text
Multimodal-Ayurvedic-Healthcare-Intelligence-System/
│
├── Backend/
│   ├── app.py
│   ├── image_ml.pkl
│   ├── logic_ml.pkl
│   ├── mobilenet_tongue.h5
│   ├── requirements.txt
│   └── ...
│
├── Frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── datasets/
│   └── ...
│
├── .gitignore
└── README.md
```

**Note:** This is an illustrative structure, not a verified listing of your current files. Update it to reflect the folders and filenames actually committed to GitHub.

## ⚙️ Installation and Setup

### Prerequisites

Install or prepare the following:

- Python
- Node.js and npm
- Git
- Ollama
- The required Python packages
- The required frontend packages

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_FOLDER
```

Replace the placeholders with your actual repository URL and project folder name.

### 2. Set Up the Backend

Open a terminal in the backend directory:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask application using the actual Python entry-point filename in your repository. For example, if the entry point is `app.py`:

```bash
python app.py
```

The backend should run on the host and port configured in the Flask application. In the current development setup, the backend uses port `5000`.

### 3. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

In the current development setup, the frontend uses port `3000`, unless its configuration has changed.

### 4. Set Up Ollama and Llama 3

Install Ollama from its official website:

[https://ollama.com/](https://ollama.com/)

Download the Llama 3 model:

```bash
ollama pull llama3:8b
```

Run the model:

```bash
ollama run llama3:8b
```

Ensure Ollama is available to the backend and that the configured model name matches the installed model.

## 🖥️ Using the Application

1. Start the Flask backend.
2. Start the frontend development server.
3. Ensure Ollama is running and the required Llama 3 model is available.
4. Open the frontend in a browser using the configured local URL.
5. Enter the requested user and health information.
6. Provide the symptoms supported by the application.
7. Upload a tongue image or use the camera feature if available in the current implementation.
8. Submit the information for processing.
9. Review the prediction results and AI-generated explanation.
10. Use the report download feature if it is enabled and working in the current version.

## 📊 Dataset and Model Development

The project uses data for developing its machine learning and deep learning components.

The structured prediction component was developed using synthetic samples. The tongue image component uses a separate image classification workflow.

The performance and reliability of these models depend on the quality, diversity, labeling, and representativeness of their training data.

**Important:** Synthetic data and experimental image datasets may not adequately represent real-world patients. Model outputs should not be interpreted as clinically validated results without appropriate external validation.

## 🚀 Future Enhancements

Potential future improvements include:

- Expanding and validating the tongue image dataset.
- Evaluating the image classifier on independent, appropriately labeled data.
- Improving symptom-based prediction using validated datasets.
- Enhancing the integration of image and structured input features.
- Adding model evaluation metrics and visualizations.
- Improving API validation, exception handling, and logging.
- Strengthening user data privacy and secure image handling.
- Enhancing the conversational interface and response grounding.
- Adding multilingual support.
- Conducting clinical and domain-expert evaluation before considering real-world healthcare use.

## 🔐 Privacy and Responsible Use

This project is an educational and experimental AI application.

- Avoid uploading identifiable or sensitive health information to public repositories.
- Do not commit private datasets, credentials, API keys, or personal health records.
- Keep model outputs clearly distinguished from professional medical advice.
- Do not use the system as a substitute for a qualified healthcare professional.
- Any real-world clinical use would require appropriate validation, privacy safeguards, and relevant regulatory and ethical review.

## 🎓 Project Purpose

This project demonstrates the integration of machine learning, deep learning, multimodal input processing, Generative AI, and web application development in an Ayurvedic healthcare-oriented setting.

It explores how multiple AI components can be connected to create an interactive system for experimental health assessment and decision support.

## 👩‍💻 Author

**Anupama Balakrishnan**

MCA — Data Analysis

## 📜 Disclaimer

This project is developed for academic, educational, and research purposes. It is not a clinically validated diagnostic tool and does not replace professional medical consultation, diagnosis, or treatment. Predictions and explanations generated by machine learning models and Generative AI may be inaccurate or incomplete.

Use the system responsibly and seek guidance from a qualified healthcare professional for health-related concerns.
