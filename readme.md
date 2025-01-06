# Explainable AI for Retinal Disease Diagnosis

This repository contains code for training and deploying a deep learning model for retinal disease diagnosis using OCT images. The model is based on EfficientNetB7 and trained on a TFRecord dataset.

## Features

- Multi-GPU training using TensorFlow's `MirroredStrategy`.
- Pre-trained EfficientNetB7 as the base model.
- Checkpointing to save the best-performing model.
- TensorFlow SavedModel for easy inference.

## Directory Structure

- `training/`: Code and utilities for training the model.
- `inference/`: Scripts for deploying the trained model.
- `saved_model/`: Directory containing the exported TensorFlow SavedModel.
- `checkpoints/`: Directory to save training checkpoints.

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/msafee72/Explainable-AI_for_Retinal_Disease_Diagnosis.git
    cd Explainable-AI_for_Retinal_Disease_Diagnosis
    ```

2. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Prepare your dataset in TFRecord format.

## Training

To train the model, use the script in `training/train.py`. The dataset should be stored in the specified TFRecord format.

```bash
python training/train.py
