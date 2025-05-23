# Explainable AI for Retinal Disease Diagnosis

## 📖 Overview

This project presents a web-based AI diagnostic system that classifies retinal diseases using Optical Coherence Tomography (OCT) images. It leverages deep learning (ResNet-50) and Explainable AI techniques (Grad-CAM and SHAP) to provide clinicians with transparent, interpretable visual and textual explanations of predictions.

---

## 🧠 Features

- Upload and classify OCT images
- Visual heatmap explanations using Grad-CAM
- Textual feature explanations using SHAP
- Secure user authentication and role management
- Store and view historical patient diagnosis records
- React.js web interface for real-time diagnosis
- Dockerized for easy deployment

---

## 🔧 Tech Stack

| Category         | Tools/Technologies             |
| ---------------- | ------------------------------ |
| Language         | Python 3.8+, JavaScript (ES6)  |
| Backend          | Django 3.2, Flask 2.2.5        |
| Frontend         | React.js 17.0.2                |
| AI Framework     | TensorFlow 2.12, Keras 2.12    |
| Explainability   | Grad-CAM (custom), SHAP 0.41.0 |
| Database         | SQLite 3.39.0                  |
| Containerization | Docker 24.0.2                  |
| API Interface    | RESTful APIs                   |

---

##⚙️ System Architecture

```plaintext
User (Browser)
   ↓
React Frontend (Upload, Visuals, Auth)
   ↓
Django API (Routing, Logic)
   ↓
Flask Model Server (Inference Engine)
   ↓
ResNet-50 + Grad-CAM + SHAP
   ↓
SQLite (Results + Users + Records)
```

---

## 🚀 Setup Instructions

### 🔗 Clone the Repository

```bash
git clone https://github.com/msafee72/Explainable-AI_for_Retinal_Disease_Diagnosis.git
cd Explainable-AI_for_Retinal_Disease_Diagnosis
```

### 🐍 Backend Setup (Django + Flask)

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### ⚛️ Frontend Setup (React)

```bash
cd oculus-frontend
npm install
npm start
```

### 🐳 Docker Setup (Optional)

```bash
docker-compose up --build
```

---

## 🧪 Usage

1. Sign in or create an account
2. Upload a valid OCT image (`.jpg`, `.png`)
3. Wait for prediction (typically under 10 seconds)
4. View:
   - Disease type and confidence score
   - Grad-CAM heatmap
   - SHAP-based textual explanation
5. Optionally download a report and save to patient record

---

## 📦 Dataset

The model is trained on the **Kermany OCT dataset**.

> Dataset not included due to size and license. You may download it from:  
> [https://www.kaggle.com/datasets/paultimothymooney/kermany2018](https://www.kaggle.com/datasets/paultimothymooney/kermany2018)

---

## 🏋️‍♂️ Model Training

The retinal disease classification model (pre-trained using OCT images) is loaded and used by the backend Flask service. The model file (`retinal_model.h5`) is not included in the repository due to size and licensing.

---

## 🧪 Testing

- Unit, Integration, Functional & Performance tests implemented
- Sample test cases available in `/tests/`
- Uses Django testing framework & custom scripts

---

## 👥 Contributors

- Muhammad Safee – BSEF21M057
- Muhammad Muaz Saleem – BSEF21M036
- Muhammad Usman – BSEF21M046
- Muhammad Naseem – BSEF21M058  
  Supervisor: Dr. Nadeem Akhtar

## 🔐 License

This project is licensed under the MIT License.
