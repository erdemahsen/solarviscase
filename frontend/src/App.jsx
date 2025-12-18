import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppRoute from './pages/AppRoute'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<h1>This is the home path</h1>}/>
          <Route path="/app" element = {<AppRoute/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
