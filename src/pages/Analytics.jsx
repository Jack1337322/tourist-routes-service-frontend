import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import './Analytics.css'

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [charts, setCharts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [statsData, userStatsData, popularityChart, categoryChart, ratingChart] =
        await Promise.all([
          analyticsAPI.routeStats(),
          analyticsAPI.userAnalytics(),
          analyticsAPI.popularityChart(10),
          analyticsAPI.categoryChart(),
          analyticsAPI.ratingChart(),
        ])

      setStats(statsData.data)
      setUserStats(userStatsData.data)
      setCharts({
        popularity: popularityChart.data.image,
        category: categoryChart.data.image,
        rating: ratingChart.data.image,
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Загрузка аналитики...</div>
  }

  return (
    <div className="analytics">
      <h1>Аналитика</h1>

      {userStats && (
        <div className="analytics-section">
          <h2>Ваша статистика</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Всего маршрутов</h3>
              <p className="stat-value">{userStats.total_routes}</p>
            </div>
            <div className="stat-card">
              <h3>Всего просмотров</h3>
              <p className="stat-value">{userStats.total_views}</p>
            </div>
            <div className="stat-card">
              <h3>Избранных</h3>
              <p className="stat-value">{userStats.favorite_routes}</p>
            </div>
            <div className="stat-card">
              <h3>За последние 30 дней</h3>
              <p className="stat-value">{userStats.routes_last_30_days}</p>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className="analytics-section">
          <h2>Общая статистика</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Всего маршрутов</h3>
              <p className="stat-value">{stats.total_routes}</p>
            </div>
            <div className="stat-card">
              <h3>Публичных</h3>
              <p className="stat-value">{stats.public_routes}</p>
            </div>
            <div className="stat-card">
              <h3>Всего просмотров</h3>
              <p className="stat-value">{stats.total_views}</p>
            </div>
            <div className="stat-card">
              <h3>Средняя длительность</h3>
              <p className="stat-value">{stats.avg_duration} ч</p>
            </div>
          </div>
        </div>
      )}

      <div className="analytics-section">
        <h2>Визуализации</h2>
        <div className="charts-grid">
          {charts.popularity && (
            <div className="chart-card">
              <h3>Популярные маршруты</h3>
              <img src={charts.popularity} alt="Popularity chart" />
            </div>
          )}
          {charts.category && (
            <div className="chart-card">
              <h3>Распределение по категориям</h3>
              <img src={charts.category} alt="Category chart" />
            </div>
          )}
          {charts.rating && (
            <div className="chart-card">
              <h3>Распределение рейтингов</h3>
              <img src={charts.rating} alt="Rating chart" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
