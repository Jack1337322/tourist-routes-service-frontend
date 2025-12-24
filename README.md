# Tourist Routes Service - Frontend

React frontend для веб-сервиса планирования туристических маршрутов в Казани.

## Технологии

- React 18+
- React Router
- Vite
- Axios
- Leaflet (карты)
- Recharts (графики)

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

3. Запустите dev-сервер:
```bash
npm run dev
```

4. Соберите для production:
```bash
npm run build
```

## Структура проекта

```
frontend/
├── src/
│   ├── components/     # Компоненты (Navbar, ProtectedRoute)
│   ├── contexts/       # React Context (AuthContext)
│   ├── pages/          # Страницы приложения
│   ├── services/       # API сервисы
│   └── App.jsx         # Главный компонент
├── index.html
├── vite.config.js
└── package.json
```
