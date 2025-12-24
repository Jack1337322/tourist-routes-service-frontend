import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { routesAPI } from '../services/api'
import './RouteCreate.css'

const RouteCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration_hours: 4,
    generator_type: 'hybrid',
    use_llm: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await routesAPI.generate(formData)
      navigate(`/routes/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания маршрута')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="route-create">
      <h1>Создать маршрут</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="route-form">
        <div className="form-group">
          <label>Название маршрута</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Например: Исторический центр Казани"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Опишите маршрут или оставьте пустым для автогенерации"
          />
        </div>

        <div className="form-group">
          <label>Длительность (часы)</label>
          <input
            type="number"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleChange}
            min="1"
            max="12"
            required
          />
        </div>

        <div className="form-group">
          <label>Тип генератора</label>
          <select
            name="generator_type"
            value={formData.generator_type}
            onChange={handleChange}
          >
            <option value="hybrid">Гибридный (LLM + алгоритм)</option>
            <option value="llm">Только LLM</option>
            <option value="algorithmic">Только алгоритм</option>
          </select>
        </div>

        {formData.generator_type === 'hybrid' && (
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="use_llm"
                checked={formData.use_llm}
                onChange={handleChange}
              />
              Использовать LLM (если доступно)
            </label>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Создание...' : 'Создать маршрут'}
        </button>
      </form>
    </div>
  )
}

export default RouteCreate
