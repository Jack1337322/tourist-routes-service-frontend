import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Казань Маршруты
        </Link>
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/routes" className="navbar-link">
                Мои маршруты
              </Link>
              <Link to="/routes/create" className="navbar-link">
                Создать маршрут
              </Link>
              <Link to="/analytics" className="navbar-link">
                Аналитика
              </Link>
              <Link to="/profile" className="navbar-link">
                Профиль
              </Link>
              <button onClick={handleLogout} className="navbar-button">
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Вход
              </Link>
              <Link to="/register" className="navbar-link">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
