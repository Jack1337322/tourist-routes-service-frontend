import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { routesAPI } from '../services/api'
import './RouteDetail.css'

const RouteDetail = () => {
  const { id } = useParams()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const placemarksRef = useRef([])

  useEffect(() => {
    loadRoute()
  }, [id])

  // Инициализация карты через нативный API Яндекс карт
  useEffect(() => {
    if (!route || !mapRef.current || typeof window === 'undefined' || !window.ymaps) {
      return
    }

    const attractions = route.route_attractions || []
    const positions = attractions
      .map((ra) => [
        parseFloat(ra.attraction.latitude),
        parseFloat(ra.attraction.longitude),
      ])
      .filter((pos) => pos[0] && pos[1])

    if (positions.length === 0) {
      return
    }

    const center = positions.length > 0
      ? [positions[0][0], positions[0][1]]
      : [55.8304, 49.0661] // Kazan center

    // Инициализируем карту
    window.ymaps.ready(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
      }

      const map = new window.ymaps.Map(mapRef.current, {
        center: center,
        zoom: 13,
      })

      mapInstanceRef.current = map
      placemarksRef.current = []

      // Создаем маркеры
      attractions.forEach((ra) => {
        const lat = parseFloat(ra.attraction.latitude)
        const lon = parseFloat(ra.attraction.longitude)
        
        if (!lat || !lon) return

        const description = ra.attraction.short_description || ra.attraction.description?.substring(0, 100) || 'Описание отсутствует'
        const balloonContent = `
          <div style="padding: 10px;">
            <strong style="font-size: 16px; display: block; margin-bottom: 8px;">
              ${ra.order}. ${ra.attraction.name}
            </strong>
            <p style="margin: 0; color: #666;">
              ${description}
            </p>
            ${ra.visit_duration ? `<p style="margin: 8px 0 0 0; color: #888; font-size: 14px;">⏱ Время посещения: ${ra.visit_duration} мин</p>` : ''}
            ${ra.attraction.rating > 0 ? `<p style="margin: 4px 0 0 0; color: #888; font-size: 14px;">⭐ Рейтинг: ${ra.attraction.rating}</p>` : ''}
          </div>
        `

        const placemark = new window.ymaps.Placemark(
          [lat, lon],
          {
            balloonContent: balloonContent,
            hintContent: `${ra.order}. ${ra.attraction.name}`,
          },
          {
            preset: 'islands#blueCircleDotIcon',
            openBalloonOnClick: true,
            openHintOnHover: true,
          }
        )

        map.geoObjects.add(placemark)
        placemarksRef.current.push(placemark)
      })

      // Добавляем линию маршрута
      if (positions.length > 1) {
        const polyline = new window.ymaps.Polyline(
          positions,
          {},
          {
            strokeColor: '#0000FF',
            strokeWidth: 4,
            strokeOpacity: 0.7,
          }
        )
        map.geoObjects.add(polyline)
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
      placemarksRef.current = []
    }
  }, [route])

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
            <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
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
