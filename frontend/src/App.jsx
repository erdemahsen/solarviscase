import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppOverview from './pages/AppRoute/AppOverview/AppOverview'
import AppHome from './pages/AppRoute/AppHome/AppHome';
import AdminHome from './pages/AdminRoute/AdminHome/AdminHome';
import AdminApp from './pages/AdminRoute/AdminApp/AdminApp';
import Login from './pages/LoginRoute/Login';



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<h1>This is the home path</h1>}/>
          <Route path="/app" element = {<AppHome/>}></Route>
          <Route path="/app/:appId" element = {<AppOverview/>}/>
          <Route path="/admin" element = {<AdminHome/>}/>
          <Route path="/admin/:appId" element={<AdminApp />} />
          <Route path="/login" element={<Login/>} />
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
