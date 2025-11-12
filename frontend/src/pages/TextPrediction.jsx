import React, { useEffect, useState } from "react";
import axios from "axios";

const TestPrediction = () => {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/predict_dataset") // replace with your backend URL
      .then((res) => {
        setDataset(res.data.dataset_preview);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading predictions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Model Predictions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Gender</th>
              <th className="px-4 py-2 border">SeniorCitizen</th>
              <th className="px-4 py-2 border">Tenure</th>
              <th className="px-4 py-2 border">MonthlyCharges</th>
              <th className="px-4 py-2 border">TotalCharges</th>
              <th className="px-4 py-2 border">Predicted Label</th>
              <th className="px-4 py-2 border">Churn Probability</th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((row, idx) => (
              <tr
                key={idx}
                className={
                  row.predicted_label === 1
                    ? "bg-red-100 hover:bg-red-200"
                    : "bg-green-100 hover:bg-green-200"
                }
              >
                <td className="px-4 py-2 border">{row.gender === 1 ? "Male" : "Female"}</td>
                <td className="px-4 py-2 border">{row.SeniorCitizen}</td>
                <td className="px-4 py-2 border">{row.tenure.toFixed(2)}</td>
                <td className="px-4 py-2 border">{row.MonthlyCharges.toFixed(2)}</td>
                <td className="px-4 py-2 border">{row.TotalCharges.toFixed(2)}</td>
                <td className="px-4 py-2 border font-bold">{row.predicted_label}</td>
                <td className="px-4 py-2 border">{(row.predicted_probability * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestPrediction;
