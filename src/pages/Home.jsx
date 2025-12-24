import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home">
      <div className="hero">
        <h1>Планирование туристических маршрутов в Казани</h1>
        <p>Откройте для себя лучшие достопримечательности столицы Татарстана</p>
        {user ? (
          <div className="hero-actions">
            <Link to="/routes/create" className="btn btn-primary">
              Создать маршрут
            </Link>
            <Link to="/routes" className="btn btn-secondary">
              Мои маршруты
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Начать
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Войти
            </Link>
          </div>
        )}
      </div>

      <div className="features">
        <div className="feature">
          <h3>Умная генерация маршрутов</h3>
          <p>Используйте ИИ для создания идеальных маршрутов на основе ваших предпочтений</p>
        </div>
        <div className="feature">
          <h3>Интерактивные карты</h3>
          <p>Визуализируйте маршруты на карте и оптимизируйте порядок посещения</p>
        </div>
        <div className="feature">
          <h3>Аналитика и статистика</h3>
          <p>Отслеживайте популярность маршрутов и получайте персональные рекомендации</p>
        </div>
      </div>
    </div>
  )
}

export default Home
