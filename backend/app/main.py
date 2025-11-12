from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle

app = FastAPI(title="Churn Prediction API")

# -------------------------
# Enable CORS
# -------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow requests from any origin
    allow_credentials=True,
    allow_methods=["*"],   # allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],   # allow all headers
)

# -------------------------
# Step 1: Define Pydantic schema
# -------------------------
class ChurnInput(BaseModel):
    gender: int
    SeniorCitizen: int
    Partner: int
    Dependents: int
    tenure: int
    PhoneService: int
    MultipleLines: int
    OnlineSecurity: int
    OnlineBackup: int
    DeviceProtection: int
    TechSupport: int
    StreamingTV: int
    StreamingMovies: int
    PaperlessBilling: int
    MonthlyCharges: float
    TotalCharges: float
    InternetService_num: int
    ContractMonths: int
    PaymentMethodEncoded: int

# -------------------------
# Step 2: Load the XGBoost model from pickle
# -------------------------
with open('C:\\Users\\Mehaboob\\OneDrive\\Desktop\\Data\\datathon\\app\\xgb_model.pkl', 'rb') as f:
    model = pickle.load(f)

# -------------------------
# Step 3: Create /predict route
# -------------------------
@app.post("/predict")
def predict_churn(data: ChurnInput):
    # Convert incoming Pydantic model to DataFrame
    input_df = pd.DataFrame([data.dict()])  # single row DataFrame

    # Make prediction
    prediction_class = model.predict(input_df)[0]          # 0 or 1
    prediction_proba = model.predict_proba(input_df)[0].tolist()  # probability for each class

    # Return JSON response
    return {
        "predicted_class": int(prediction_class),
        "predicted_probability": prediction_proba
    }

# -------------------------
# Step 4: Create /predict_dataset route for test.csv
# -------------------------
@app.get("/predict_dataset")
def predict_test_dataset():
    try:
        # Load the test dataset
        test_path = 'C:\\Users\\Mehaboob\\OneDrive\\Desktop\\Data\\datathon\\app\\test.csv'
        test_output_path='C:\\Users\\Mehaboob\\OneDrive\\Desktop\\Data\\datathon\\app\\test_output.csv'
        df = pd.read_csv(test_path)
        df_out=pd.read_csv(test_output_path)

        # Check if all required columns exist
        required_columns = [
            'gender','SeniorCitizen','Partner','Dependents','tenure','PhoneService',
            'MultipleLines','OnlineSecurity','OnlineBackup','DeviceProtection','TechSupport',
            'StreamingTV','StreamingMovies','PaperlessBilling','MonthlyCharges','TotalCharges',
            'InternetService_num','ContractMonths','PaymentMethodEncoded'  # assuming 'Churn' is actual value
        ]
        for col in required_columns:
            if col not in df.columns:
                return {"error": f"Missing required column: {col}"}

        # Separate actual labels
        y_actual = df_out['Churn'].tolist()
        X_test = df

        # Make predictions
        y_pred = model.predict(X_test).tolist()
        y_proba = model.predict_proba(X_test).tolist()

        # Add predictions to dataframe
        df['predicted_label'] = y_pred
        df['predicted_probability'] = [prob[1] for prob in y_proba]  # probability of churn

        # Return first 50 rows for preview
        response_data = {
            "dataset_preview": df.head(50).to_dict(orient="records"),
            "actual_values": y_actual[:50],
            "predicted_values": y_pred[:50],
            "predicted_probabilities": [prob[1] for prob in y_proba[:50]]
        }

        return response_data

    except Exception as e:
        return {"error": f"Failed to process dataset: {str(e)}"}
