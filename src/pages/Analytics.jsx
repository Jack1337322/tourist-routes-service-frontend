import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../services/api'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './Analytics.css'

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea']

const Analytics = () => {
  const [stats, setStats] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [popularAttractions, setPopularAttractions] = useState([])
  const [categoryPopularity, setCategoryPopularity] = useState([])
  const [attractionsByCategory, setAttractionsByCategory] = useState([])
  const [attractionTrends, setAttractionTrends] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [
        statsData,
        userStatsData,
        popularAttractionsData,
        categoryPopularityData,
        attractionsByCategoryData,
        trendsData,
        distributionData,
      ] = await Promise.all([
        analyticsAPI.routeStats(),
        analyticsAPI.userAnalytics(),
        analyticsAPI.popularAttractions(20),
        analyticsAPI.categoryPopularity(),
        analyticsAPI.popularAttractionsByCategory(5),
        analyticsAPI.attractionUsageTrends(30),
        analyticsAPI.categoryDistributionInRoutes(),
      ])

      setStats(statsData.data)
      setUserStats(userStatsData.data)
      setPopularAttractions(popularAttractionsData.data.attractions || [])
      setCategoryPopularity(categoryPopularityData.data.categories || [])
      setAttractionsByCategory(attractionsByCategoryData.data.by_category || [])
      setAttractionTrends(trendsData.data.trends || [])
      setCategoryDistribution(distributionData.data.distribution || [])
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="analytics">
        <div className="loading">Загрузка аналитики...</div>
      </div>
    )
  }

  return (
    <div className="analytics">
      <h1>Аналитика</h1>

      <div className="analytics-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Обзор
        </button>
        <button
          className={activeTab === 'attractions' ? 'active' : ''}
          onClick={() => setActiveTab('attractions')}
        >
          Популярные места
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Категории
        </button>
        <button
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
        >
          Тренды
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
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
        </>
      )}

      {activeTab === 'attractions' && (
        <div className="analytics-section">
          <h2>Популярные места</h2>
          <p className="section-description">
            Места отсортированы по количеству упоминаний в маршрутах
          </p>
          {popularAttractions.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={popularAttractions}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} упоминаний`, 'Количество']}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="mention_count" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data">Нет данных о популярных местах</p>
          )}

          {attractionsByCategory.length > 0 && (
            <>
              <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
                Популярные места по категориям
              </h3>
              <div className="charts-grid">
                {attractionsByCategory.map((categoryData, idx) => (
                  <div key={idx} className="chart-card">
                    <h4>{categoryData.category}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={categoryData.attractions}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} упоминаний`, 'Количество']}
                        />
                        <Bar dataKey="mention_count" fill={COLORS[idx % COLORS.length]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="analytics-section">
          <h2>Популярность категорий</h2>
          <p className="section-description">
            Категории отсортированы по количеству маршрутов, использующих достопримечательности
            из этой категории
          </p>
          {categoryPopularity.length > 0 ? (
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Распределение по категориям</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryPopularity}
                      dataKey="route_count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {categoryPopularity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} маршрутов`, 'Количество']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Категории в маршрутах</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={categoryPopularity}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} маршрутов`, 'Количество маршрутов']}
                    />
                    <Bar dataKey="route_count" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="no-data">Нет данных о категориях</p>
          )}

          {categoryDistribution.length > 0 && (
            <>
              <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
                Распределение категорий в маршрутах
              </h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={categoryDistribution}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="category"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="route_count" fill="#667eea" name="Количество маршрутов" />
                    <Bar dataKey="total_mentions" fill="#764ba2" name="Всего упоминаний" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="analytics-section">
          <h2>Тренды использования мест</h2>
          <p className="section-description">
            Динамика создания маршрутов и использования достопримечательностей за последние 30 дней
          </p>
          {attractionTrends.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={attractionTrends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="routes_created"
                    stroke="#667eea"
                    strokeWidth={2}
                    name="Создано маршрутов"
                  />
                  <Line
                    type="monotone"
                    dataKey="attraction_mentions"
                    stroke="#764ba2"
                    strokeWidth={2}
                    name="Упоминаний мест"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data">Нет данных о трендах</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Analytics
