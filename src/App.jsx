import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import router from "./routes/index";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
