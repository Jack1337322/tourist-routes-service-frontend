import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { routesAPI } from '../services/api'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './RouteDetail.css'

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const RouteDetail = () => {
  const { id } = useParams()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRoute()
  }, [id])

  const loadRoute = async () => {
    try {
      const response = await routesAPI.get(id)
      setRoute(response.data)
    } catch (error) {
      console.error('Error loading route:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!route) {
    return <div>Маршрут не найден</div>
  }

  const attractions = route.route_attractions || []
  const positions = attractions
    .map((ra) => [
      parseFloat(ra.attraction.latitude),
      parseFloat(ra.attraction.longitude),
    ])
    .filter((pos) => pos[0] && pos[1])

  const center =
    positions.length > 0
      ? [positions[0][0], positions[0][1]]
      : [55.8304, 49.0661] // Kazan center

  return (
    <div className="route-detail">
      <div className="route-header">
        <h1>{route.name}</h1>
        <div className="route-actions">
          <button
            onClick={() => routesAPI.toggleFavorite(id).then(loadRoute)}
            className="btn btn-secondary"
          >
            {route.is_favorite ? '⭐ Убрать из избранного' : '☆ Добавить в избранное'}
          </button>
        </div>
      </div>

      <div className="route-content">
        <div className="route-info">
          <p className="route-description">{route.description}</p>
          <div className="route-stats">
            <div className="stat">
              <span className="stat-label">Длительность:</span>
              <span className="stat-value">{route.duration_hours} часов</span>
            </div>
            <div className="stat">
              <span className="stat-label">Расстояние:</span>
              <span className="stat-value">{route.distance_km} км</span>
            </div>
            <div className="stat">
              <span className="stat-label">Бюджет:</span>
              <span className="stat-value">{route.budget} ₽</span>
            </div>
            <div className="stat">
              <span className="stat-label">Мест:</span>
              <span className="stat-value">{attractions.length}</span>
            </div>
          </div>
        </div>

        {positions.length > 0 && (
          <div className="route-map">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {attractions.map((ra, index) => (
                <Marker
                  key={ra.id}
                  position={[
                    parseFloat(ra.attraction.latitude),
                    parseFloat(ra.attraction.longitude),
                  ]}
                >
                  <Popup>
                    <strong>{ra.order}. {ra.attraction.name}</strong>
                    <br />
                    {ra.attraction.short_description || ra.attraction.description?.substring(0, 100)}
                  </Popup>
                </Marker>
              ))}
              {positions.length > 1 && (
                <Polyline positions={positions} color="blue" />
              )}
            </MapContainer>
          </div>
        )}

        <div className="route-attractions">
          <h2>Достопримечательности</h2>
          <ol className="attractions-list">
            {attractions.map((ra) => (
              <li key={ra.id} className="attraction-item">
                <div className="attraction-info">
                  <h3>
                    {ra.order}. {ra.attraction.name}
                  </h3>
                  <p>{ra.attraction.description || ra.attraction.short_description}</p>
                  <div className="attraction-meta">
                    <span>⏱ {ra.visit_duration} мин</span>
                    {ra.attraction.rating > 0 && (
                      <span>⭐ {ra.attraction.rating}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export default RouteDetail
