import { Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, ProtectedRoute } from "./authProvider";
import Register from "./register";
import Login from "./login";
import Todos from "./todos";

import './App.css'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
