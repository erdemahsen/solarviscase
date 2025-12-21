import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoute from './pages/AppRoute/AppRoute'
import AdminHome from './pages/AdminRoute/AdminHome/AdminHome';
import AdminApp from './pages/AdminRoute/AdminApp/AdminApp';



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<h1>This is the home path</h1>}/>
          <Route path="/app/1" element = {<AppRoute/>}/>
          <Route path="/admin" element = {<AdminHome/>}/>
          <Route path="/admin/:appId" element={<AdminApp />} />
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
