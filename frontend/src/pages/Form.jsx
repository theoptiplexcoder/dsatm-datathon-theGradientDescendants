import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function App() {
  const [formData, setFormData] = useState({
    gender: "Male",
    SeniorCitizen: "No",
    Partner: "No",
    Dependents: "No",
    tenure: 0,
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "DSL",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
    Contract: "Month-to-month",
    MonthlyCharges: 0,
    TotalCharges: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "PhoneService" && value === "No") {
      updatedData.MultipleLines = "No";
    }

    if (name === "InternetService" && value === "No") {
      updatedData.OnlineSecurity = "No";
      updatedData.OnlineBackup = "No";
      updatedData.DeviceProtection = "No";
      updatedData.TechSupport = "No";
      updatedData.StreamingTV = "No";
      updatedData.StreamingMovies = "No";
    }

    setFormData(updatedData);
  };

  const encodeData = () => {
    return {
      gender: formData.gender === "Male" ? 1 : 0,
      SeniorCitizen: formData.SeniorCitizen === "Yes" ? 1 : 0,
      Partner: formData.Partner === "Yes" ? 1 : 0,
      Dependents: formData.Dependents === "Yes" ? 1 : 0,
      tenure: parseInt(formData.tenure),
      PhoneService: formData.PhoneService === "Yes" ? 1 : 0,
      MultipleLines: formData.MultipleLines === "Yes" ? 1 : 0,
      InternetService_num:
        formData.InternetService === "DSL"
          ? 1
          : formData.InternetService === "Fiber optic"
          ? 2
          : 0,
      OnlineSecurity: formData.OnlineSecurity === "Yes" ? 1 : 0,
      OnlineBackup: formData.OnlineBackup === "Yes" ? 1 : 0,
      DeviceProtection: formData.DeviceProtection === "Yes" ? 1 : 0,
      TechSupport: formData.TechSupport === "Yes" ? 1 : 0,
      StreamingTV: formData.StreamingTV === "Yes" ? 1 : 0,
      StreamingMovies: formData.StreamingMovies === "Yes" ? 1 : 0,
      PaperlessBilling: formData.PaperlessBilling === "Yes" ? 1 : 0,
      PaymentMethodEncoded:
        formData.PaymentMethod === "Electronic check"
          ? 2
          : formData.PaymentMethod === "Mailed check"
          ? 1
          : formData.PaymentMethod === "Bank transfer"
          ? 0
          : 3,
      ContractMonths:
        formData.Contract === "Month-to-month"
          ? 1
          : formData.Contract === "One year"
          ? 12
          : 24,
      MonthlyCharges: parseFloat(formData.MonthlyCharges),
      TotalCharges: parseFloat(formData.TotalCharges),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = encodeData();
      const response = await axios.post("http://127.0.0.1:8000/predict", payload);
      const resultClass = response.data.predicted_class;
      const resultProb = response.data.predicted_probability[1] * 100;

      setPrediction({
        message: resultClass === 1 ? "⚠️ Customer likely to churn" : "✅ Customer will stay",
        probability: resultProb.toFixed(2) + "%",
      });
    } catch (error) {
      console.error(error);
      setPrediction({ message: "Error in prediction", probability: "-" });
    } finally {
      setLoading(false);
    }
  };

  const handleSeeDatasetPrediction = () => {
    // Placeholder action: you can route to a new page or fetch dataset predictions
    alert("Feature coming soon: See predictions on existing dataset!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 p-4">
      <Link to={'/see'}
          onClick={handleSeeDatasetPrediction}
          className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:scale-105 transition-transform"
        >
          See Model Prediction on Existing Dataset
        </Link>
      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Customer Churn Prediction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <fieldset className="border-2 border-purple-500 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <legend className="font-semibold text-purple-700">Customer Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-medium text-gray-700">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Senior Citizen:</label>
                <select
                  name="SeniorCitizen"
                  value={formData.SeniorCitizen}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Partner:</label>
                <select
                  name="Partner"
                  value={formData.Partner}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Dependents:</label>
                <select
                  name="Dependents"
                  value={formData.Dependents}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium text-gray-700">Tenure (months):</label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-lg border-gray-300 p-2"
                />
              </div>
            </div>
          </fieldset>

          {/* Service Info */}
          <fieldset className="border-2 border-blue-500 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <legend className="font-semibold text-blue-700">Service Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-medium text-gray-700">Phone Service:</label>
                <select
                  name="PhoneService"
                  value={formData.PhoneService}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Multiple Lines:</label>
                <select
                  name="MultipleLines"
                  value={formData.MultipleLines}
                  onChange={handleChange}
                  disabled={formData.PhoneService === "No"}
                  className="w-full rounded-lg border-gray-300 p-2 disabled:bg-gray-200"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Internet Service:</label>
                <select
                  name="InternetService"
                  value={formData.InternetService}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>DSL</option>
                  <option>Fiber optic</option>
                  <option>No</option>
                </select>
              </div>
              {["OnlineSecurity", "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies"].map((field) => (
                <div key={field}>
                  <label className="block font-medium text-gray-700">{field.replace(/([A-Z])/g, ' $1').trim()}:</label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={formData.InternetService === "No"}
                    className="w-full rounded-lg border-gray-300 p-2 disabled:bg-gray-200"
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              ))}
            </div>
          </fieldset>

          {/* Billing Info */}
          <fieldset className="border-2 border-green-500 rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100">
            <legend className="font-semibold text-green-700">Billing Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-medium text-gray-700">Paperless Billing:</label>
                <select
                  name="PaperlessBilling"
                  value={formData.PaperlessBilling}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Payment Method:</label>
                <select
                  name="PaymentMethod"
                  value={formData.PaymentMethod}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Electronic check</option>
                  <option>Mailed check</option>
                  <option>Bank transfer</option>
                  <option>Credit card</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Contract:</label>
                <select
                  name="Contract"
                  value={formData.Contract}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 p-2"
                >
                  <option>Month-to-month</option>
                  <option>One year</option>
                  <option>Two year</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700">Monthly Charges:</label>
                <input
                  type="number"
                  name="MonthlyCharges"
                  value={formData.MonthlyCharges}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full rounded-lg border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Total Charges:</label>
                <input
                  type="number"
                  name="TotalCharges"
                  value={formData.TotalCharges}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  className="w-full rounded-lg border-gray-300 p-2"
                />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform"
          >
            🔮 Predict Customer Churn
          </button>
        </form>

        {loading && (
          <p className="text-center text-purple-700 font-semibold mt-4 animate-pulse">Predicting... ⏳</p>
        )}

        {prediction && (
          <div className="mt-6 p-4 bg-yellow-100 rounded-xl shadow-md text-center">
            <h3 className="text-lg font-bold">{prediction.message}</h3>
            <p className="font-medium">Churn Probability: {prediction.probability}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
