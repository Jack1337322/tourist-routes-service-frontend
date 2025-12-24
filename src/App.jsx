import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import RoutesList from './pages/RoutesList'
import RouteDetail from './pages/RouteDetail'
import RouteCreate from './pages/RouteCreate'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/routes"
                element={
                  <ProtectedRoute>
                    <RoutesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routes/:id"
                element={
                  <ProtectedRoute>
                    <RouteDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/routes/create"
                element={
                  <ProtectedRoute>
                    <RouteCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
