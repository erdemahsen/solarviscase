import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppOverview from './pages/AppRoute/AppOverview/AppOverview'
import AppHome from './pages/AppRoute/AppHome/AppHome';
import AdminHome from './pages/AdminRoute/AdminHome/AdminHome';
import AdminApp from './pages/AdminRoute/AdminApp/AdminApp';
import Login from './pages/LoginRoute/Login';



import { AuthProvider } from './context/AuthContext';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>This is the home path</h1>} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<AppHome />}></Route>
          <Route path="/app/:appId" element={<AppOverview />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/:appId" element={<AdminApp />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
