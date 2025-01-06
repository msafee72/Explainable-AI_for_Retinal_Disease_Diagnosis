import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import sys

# Load the pre-trained model from the checkpoint
def load_model(checkpoint_path):
    # Define the model architecture (same as training)
    from tensorflow.keras.applications import EfficientNetB7
    from tensorflow.keras import layers, models

    base_model = EfficientNetB7(
        include_top=False,
        weights=None,  # No pre-trained weights since we're loading our own
        input_shape=(224, 224, 3)
    )

    base_model.trainable = False

    # Add custom head for classification
    head_model = models.Sequential([
        layers.GlobalAveragePooling2D(),
        layers.Dense(4, activation='softmax')  # Output 4 classes
    ])

    # Combine the base and custom head
    model = models.Sequential([
        base_model,
        head_model
    ])

    # Compile the model (necessary to load weights)
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Load weights from the checkpoint
    model.load_weights(checkpoint_path)
    return model

# Preprocess an input image
def preprocess_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize pixel values
    return img_array

# Make predictions
def predict(model, img_path):
    img_array = preprocess_image(img_path)
    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])  # Get the index of the predicted class
    return class_idx, predictions[0]

if __name__ == "__main__":
    # Example usage: python app.py <image_path>
    if len(sys.argv) != 2:
        print("Usage: python app.py <image_path>")
        sys.exit(1)

    checkpoint_path = "ckpt.weights.h5"  # Path to the saved checkpoint
    img_path = sys.argv[1]

    # Load the model and make predictions
    model = load_model(checkpoint_path)
    class_idx, class_probs = predict(model, img_path)
    print(f"Predicted Class: {class_idx}")
    print(f"Class Probabilities: {class_probs}")
