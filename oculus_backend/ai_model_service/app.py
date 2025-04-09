import tensorflow as tf
import numpy as np
import cv2
from flask import Flask, request, jsonify
import base64
import io
from PIL import Image
import os
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

model_path = "../backend/api/models/retinal_model.h5"
logger.debug(f"Loading model from: {os.path.abspath(model_path)}")
model = tf.keras.models.load_model(model_path)

def find_last_conv_layer(model):
    for layer in reversed(model.layers):
        if isinstance(layer, tf.keras.layers.Conv2D):
            logger.debug(f"Found last Conv2D layer: {layer.name}")
            return layer.name
    raise ValueError("No Conv2D layer found in the model.")

def grad_cam(model, img_array, layer_name):
    try:
        grad_model = tf.keras.models.Model([model.inputs], [model.get_layer(layer_name).output, model.output])
        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(img_array)
            predicted_class = tf.argmax(predictions[0])
            loss = predictions[:, predicted_class]

        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            raise ValueError("Gradient computation failed: grads is None")

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        max_val = tf.reduce_max(heatmap)
        heatmap = heatmap / max_val if max_val > 0 else heatmap
        heatmap = heatmap.numpy()

        logger.debug(f"Grad-CAM generated successfully")
        return heatmap, predicted_class.numpy(), predictions.numpy()
    except Exception as e:
        logger.error(f"Grad-CAM failed: {str(e)}", exc_info=True)
        raise

def overlay_heatmap(img_array, heatmap, alpha=0.4):
    heatmap = cv2.resize(heatmap, (img_array.shape[2], img_array.shape[1]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    img = np.uint8(img_array[0] * 255)
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    overlayed_img = cv2.addWeighted(img_bgr, 1 - alpha, heatmap, alpha, 0)
    overlayed_img = cv2.cvtColor(overlayed_img, cv2.COLOR_BGR2RGB)
    return overlayed_img

def encode_image_to_base64(image_array):
    pil_img = Image.fromarray(image_array)
    buffered = io.BytesIO()
    pil_img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

# Label mapping
idx_to_class = {
    0: "CNV (Choroidal Neovascularization)",
    1: "DME (Diabetic Macular Edema)",
    2: "Drusen",
    3: "Normal"
}

# Extended explanations for each class
extended_explanations = {
    "CNV (Choroidal Neovascularization)": (
        "The AI highlighted abnormal vascular regions, often associated with excessive blood vessel growth. "
        "These regions may indicate leakage or neovascularization, commonly seen in wet AMD. "
        "The heatmap shows the AI's focus on irregular patterns in the retina, which aligns with CNV characteristics."
        "\n\nNext Step: Confirm with Fluorescein Angiography or OCT Angiography to assess neovascularization."
    ),
    "DME (Diabetic Macular Edema)": (
        "The AI detected fluid accumulation in the macula, emphasizing regions with potential swelling. "
        "The highlighted areas suggest changes in retinal thickness, which are key indicators of macular edema. "
        "The intensity of the heatmap in the central macular zone supports this diagnosis."
        "\n\nNext Step: Confirm with Fundus Photography or Additional OCT scans to evaluate macular thickness."
    ),
    "Drusen": (
        "The AI focused on bright, distinct deposits beneath the retina, which are characteristic of Drusen. "
        "These deposits, often found near the macula, can contribute to vision impairment if they grow larger. "
        "The heatmap highlights these abnormal deposits, reinforcing the likelihood of this condition."
        "\n\nNext Step: Regular OCT scans are advised to monitor Drusen size and density."
    ),
    "Normal": (
        "The AI did not find significant abnormalities in the retinal structure, leading to a normal classification. "
        "The absence of heatmap intensity in critical regions suggests no concerning signs of disease. "
        "A well-defined and evenly structured retina supports this assessment."
        "\n\nNext Step: Routine eye exams are still recommended for continued eye health."
    )
}

# General heatmap explanation
heatmap_explanation = (
    "\nRed areas indicate the most critical regions influencing the AI's decision, suggesting high abnormality. "
    "\nOrange and yellow areas represent moderate attention, possibly indicating early signs of disease. "
    "\nBlue and green areas contribute the least to the decision, implying normal or less concerning regions."
)

@app.route('/predict', methods=['POST'])
def predict():
    logger.debug("Received predict request")
    data = request.get_json()
    img_data = data.get('image_data')
    if not img_data:
        logger.error("No image data received")
        return jsonify({"category": "error", "text": "No image data received", "analyzed_image": None}), 400

    try:
        img_bytes = base64.b64decode(img_data)
        with open("debug_received.jpg", "wb") as f:
            f.write(img_bytes)

        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((224, 224), Image.Resampling.LANCZOS)
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        logger.debug(f"Image shape: {img_array.shape}, dtype: {img_array.dtype}")

        last_conv_layer_name = find_last_conv_layer(model)
        heatmap, predicted_class_idx, predictions = grad_cam(model, img_array, last_conv_layer_name)
        predicted_class_name = idx_to_class[predicted_class_idx]
        confidence_score = float(np.max(predictions) * 100)

        overlayed_img = overlay_heatmap(img_array, heatmap, alpha=0.4)
        cv2.imwrite("debug_gradcam.png", cv2.cvtColor(overlayed_img, cv2.COLOR_RGB2BGR))

        analyzed_img_base64 = encode_image_to_base64(overlayed_img)

        # ✅ Compose full findings text
        explanation = extended_explanations[predicted_class_name]
        full_findings = (
            f"Predicted Condition: {predicted_class_name} (Confidence: {confidence_score:.2f}%)\n\n"
            f"Explanation:\n{explanation}\n\n"
            f"Heatmap Interpretation:\n{heatmap_explanation}"
        )

        result = {
            "category": predicted_class_name,
            "text": full_findings,
            "analyzed_image": analyzed_img_base64
        }
        return jsonify(result)

    except Exception as e:
        logger.error("Prediction failed", exc_info=True)
        return jsonify({
            "category": "error",
            "text": f"Exception during processing: {str(e)}",
            "analyzed_image": None
        }), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
