import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { routesAPI } from '../services/api'
import './RoutesList.css'

const RoutesList = () => {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoutes()
  }, [])

  const loadRoutes = async () => {
    try {
      const response = await routesAPI.list()
      setRoutes(response.data.results || response.data)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="routes-list">
      <div className="routes-header">
        <h1>Мои маршруты</h1>
        <Link to="/routes/create" className="btn btn-primary">
          Создать маршрут
        </Link>
      </div>

      {routes.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет маршрутов</p>
          <Link to="/routes/create" className="btn btn-primary">
            Создать первый маршрут
          </Link>
        </div>
      ) : (
        <div className="routes-grid">
          {routes.map((route) => (
            <Link
              key={route.id}
              to={`/routes/${route.id}`}
              className="route-card"
            >
              <h3>{route.name}</h3>
              <p>{route.description?.substring(0, 100)}...</p>
              <div className="route-meta">
                <span>⏱ {route.duration_hours} ч</span>
                <span>📍 {route.attractions_count || 0} мест</span>
                {route.is_favorite && <span>⭐ Избранное</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoutesList
