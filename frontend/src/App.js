import styles from './App.css';
import React from 'react';
import Base from './components/Base';
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Task from './components/Task';
import { TaskProvider } from './context/TaskContext';
import Register from './components/Register';

function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Base /></ProtectedRoute>}>
          <Route path="/" element={<TaskProvider><Task /></TaskProvider>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}

export default App;

