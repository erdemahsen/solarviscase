import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoute from './pages/AppRoute/AppRoute'
import AdminRoute from './pages/AdminRoute/AdminRoute';
import AdminApp from './pages/AdminRoute/AdminApp';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<h1>This is the home path</h1>}/>
          <Route path="/app" element = {<AppRoute/>}/>
          <Route path="/admin" element = {<AdminRoute/>}/>
          <Route path="/admin/:appId" element={<AdminApp />} />
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
