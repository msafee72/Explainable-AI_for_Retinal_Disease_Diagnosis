# Explainable AI for Retinal Disease Diagnosis

This repository contains code for training and deploying a deep learning model for retinal disease diagnosis using OCT images. The model is based on EfficientNetB7 and trained on a TFRecord dataset.

## Features

- Multi-GPU training using TensorFlow's `MirroredStrategy`.
- Pre-trained EfficientNetB7 as the base model.
- Checkpointing to save the best-performing model.

## Directory Structure

- `training.ipynb`: Code for training the model.
- `pre-processing.ipynb`: Dataset preprocessing utilities.
- `app.py`: script for deploying the trained model.

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

To train the model, use the script in `training.ipynb`. The dataset should be stored in the specified TFRecord format.
