import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { authAPI } from '../services/api'
import './Profile.css'

const Profile = () => {
  const { user, loadUser } = useAuth()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        bio: user.bio || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await authAPI.updateProfile(formData)
      await loadUser()
      setMessage('Профиль обновлен')
    } catch (error) {
      setMessage('Ошибка обновления профиля')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="profile">
      <h1>Профиль</h1>
      <div className="profile-card">
        <div className="profile-info">
          <h2>{user.email}</h2>
          <p>Имя пользователя: {user.username}</p>
          {user.created_at && (
            <p>Дата регистрации: {new Date(user.created_at).toLocaleDateString('ru-RU')}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {message && (
            <div className={message.includes('Ошибка') ? 'error-message' : 'success-message'}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Фамилия</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>О себе</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
