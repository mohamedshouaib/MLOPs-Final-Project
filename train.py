"""
Train SVM, RandomForest, and LogisticRegression models on pre-processed
gesture-landmark features and log everything to MLflow.
"""
import argparse, os, joblib, mlflow
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Model zoo
MODELS = {
    "svm": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", SVC(probability=True, kernel="rbf", gamma="scale"))
    ]),
    "rf": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42))
    ]),
    "lr": Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(max_iter=1000, solver="lbfgs", random_state=42))
    ]),
}

# 2. Data utilities
def preprocess_data(df: pd.DataFrame):
    """
    • Drops NaNs
    • Anchors all landmarks at the wrist (index 0)
    • Divides x- and y-coordinates by the wrist→mid-finger-tip distance
    """
    df = df.dropna().reset_index(drop=True)

    X = df.iloc[:, :-1].values.astype(np.float32)   # landmark coords
    y = df.iloc[:, -1].values                       # gesture labels

    wrist_idx = 0                    # (x0, y0, z0)
    mid_tip_idx = 12                 # (x12, y12, z12)

    # reshape to [n_samples, n_landmarks, 3]
    X = X.reshape(X.shape[0], -1, 3)

    # anchor at wrist
    X -= X[:, wrist_idx:wrist_idx+1, :]

    # scale by wrist-to-mid-tip Euclidean norm in the xy-plane
    scale = np.linalg.norm(X[:, mid_tip_idx, :2], axis=1, keepdims=True) + 1e-6
    X[:, :, :2] /= scale[:, None]    # leave z as is

    return X.reshape(X.shape[0], -1), y


def load_and_split(csv_path: str):
    """
    Reads CSV → preprocess → stratified 80/10/10 split → returns numpy arrays.
    """
    df = pd.read_csv(csv_path)
    X, y = preprocess_data(df)

    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.50, random_state=42, stratify=y_temp
    )
    return X_train, X_val, X_test, y_train, y_val, y_test

# 3. Training loop
def save_cm_plot(cm, out_dir, tag):
    fp = os.path.join(out_dir, f"cm_{tag}.png")
    plt.figure(figsize=(4, 3))
    sns.heatmap(cm, annot=True, fmt="d", cbar=False)
    plt.title(f"Confusion Matrix • {tag}")
    plt.tight_layout()
    plt.savefig(fp, bbox_inches="tight")
    plt.close()
    return fp


def run(model_key: str, csv_path: str, out_dir: str):
    mlflow.set_experiment("maze-gesture-baseline")

    X_train, X_val, X_test, y_train, y_val, y_test = load_and_split(csv_path)
    clf = MODELS[model_key]

    with mlflow.start_run(run_name=model_key):
        #  Fit 
        clf.fit(X_train, y_train)

        #  Validation metrics 
        y_val_pred = clf.predict(X_val)
        val_acc = accuracy_score(y_val, y_val_pred)
        val_f1  = f1_score(y_val, y_val_pred, average="weighted")

        #  Test metrics 
        y_test_pred = clf.predict(X_test)
        test_acc = accuracy_score(y_test, y_test_pred)
        test_f1  = f1_score(y_test, y_test_pred, average="weighted")

        #  MLflow logging ------        
        mlflow.log_params(clf.named_steps["clf"].get_params())
        mlflow.log_metrics({
            "val_accuracy" : val_acc,   "val_f1" : val_f1,
            "test_accuracy": test_acc,  "test_f1": test_f1
        })

        cm_val  = confusion_matrix(y_val,  y_val_pred)
        cm_test = confusion_matrix(y_test, y_test_pred)
        mlflow.log_artifact(save_cm_plot(cm_val,  out_dir, "val"))
        mlflow.log_artifact(save_cm_plot(cm_test, out_dir, "test"))

        # model + metadata
        model_path = os.path.join(out_dir, f"{model_key}.pkl")
        joblib.dump(clf, model_path)
        mlflow.log_artifact(model_path)

        print(f"{model_key.upper():4s} │ "
              f"val_acc={val_acc:.3f} │ val_f1={val_f1:.3f} │ "
              f"test_acc={test_acc:.3f} │ test_f1={test_f1:.3f}")

# 4. CLI
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--data",     default="data/hand_landmarks_data.csv")
    ap.add_argument("--models",   nargs="*", default=["svm", "rf", "lr"],
                    help="subset of {svm, rf, lr}")
    ap.add_argument("--out_dir",  default="models")
    args = ap.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    for m in args.models:
        run(m, args.data, args.out_dir)
