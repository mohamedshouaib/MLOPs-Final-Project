# MLflow Experiments: Maze Gesture Baseline

This project tracks baseline experiments for classifying maze gestures using traditional machine learning models with `MLflow`.

## 🧪 MLflow Tracking

We used MLflow to track and compare the performance of the following models:

- **Logistic Regression (lr)**
- **Random Forest (rf)**
- **Support Vector Machine (svm)**

Tracked metrics:
- `test_accuracy`
- `test_f1`
- `val_accuracy`
- `val_f1`

These metrics were logged automatically using MLflow’s `log_metric()` function. Models were also tagged with their hyperparameters for reproducibility.

## ✅ Model Choice Justification

Although **Random Forest** achieved the highest performance (0.98 test accuracy and 0.98 F1 score), we decided to use **SVM** as the final baseline model for the following reason:

> 🛑 The serialized Random Forest model exceeded GitHub's file size limit (100 MB), which made it impractical for version control and sharing via GitHub.

✅ On the other hand, **SVM** offers a good balance between performance and file size, with:
- **Test Accuracy:** 0.91  
- **Test F1 Score:** 0.91  
- **Val Accuracy:** 0.92  
- **Val F1 Score:** 0.92

This makes SVM a reasonable and reproducible choice for deployment and future experimentation.

## 📊 Model Comparison Table

| Model | Test Accuracy | Test F1 | Val Accuracy | Val F1 |
|-------|----------------|---------|---------------|--------|
| Support Vector Machine (svm) | 0.93 | 0.94 | 0.94 | 0.94 |
| Random Forest (rf)       | **0.98** | **0.98** | **0.98** | **0.98** |
| Logistic Regression (lr) | 0.91 | 0.91 | 0.92 | 0.92 |

> 🔍 **Selected Model:** SVM (for optimal balance between accuracy and storage limits)