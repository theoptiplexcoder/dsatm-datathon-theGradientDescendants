import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Form  from "./pages/Form";
import TestPrediction from "./pages/TextPrediction";

// Create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Form />,
  },
  {
    path: "/see",
    element: <TestPrediction />,
  },
  
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
