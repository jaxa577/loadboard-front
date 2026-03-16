# LoadBoard

Минималистичная современная платформа для грузоперевозок в СНГ.

## Технологии

- **Nuxt 3.x** - фреймворк для Vue.js
- **Vue 3** - Composition API
- **Pinia** - state management
- **TailwindCSS** - стилизация
- **TypeScript** - типизация
- **Mock API** - серверные endpoints в `/server/api`

## Установка

```bash
# Установить зависимости
npm install

# Запустить dev сервер
npm run dev

# Собрать для production
npm run build

# Предпросмотр production сборки
npm run preview
```

## Структура проекта

```
├── assets/          # CSS и другие ресурсы
├── components/      # Vue компоненты
│   ├── landing/    # Компоненты лендинга
│   └── ...
├── layouts/         # Layout компоненты
├── pages/          # Страницы приложения
│   ├── admin/      # Админ-панель
│   ├── broker/     # Панель брокера
│   ├── chat/       # Чат
│   ├── loads/      # Грузы
│   └── profile/    # Профиль
├── server/         # Серверные файлы
│   └── api/        # Mock API endpoints
├── stores/         # Pinia stores
└── types/          # TypeScript типы
```

## Роли пользователей

### Водитель
- Просмотр доступных грузов
- Отклик на грузы
- История перевозок
- Документы

### Грузоотправитель
- Создание грузов
- Управление грузами
- Выбор водителей
- Отслеживание доставки

### Брокер
- Управление клиентами
- Назначение водителей
- Контроль сделок
- Статистика

### Администратор
- Модерация пользователей
- Модерация грузов
- Статистика платформы

## Mock API

Все API endpoints находятся в `/server/api` и возвращают mock данные.

### Авторизация
- `POST /api/auth/send-sms` - отправка SMS кода
- `POST /api/auth/login` - вход
- `POST /api/auth/register` - регистрация
- `GET /api/auth/me` - текущий пользователь

### Грузы
- `GET /api/loads` - список грузов
- `GET /api/loads/:id` - детали груза
- `POST /api/loads` - создание груза
- `PUT /api/loads/:id` - обновление груза
- `POST /api/loads/apply` - отклик на груз

### Чат
- `GET /api/chat` - список чатов
- `GET /api/chat/:id` - детали чата
- `GET /api/chat/:id/messages` - сообщения
- `POST /api/chat/:id/messages` - отправка сообщения

### Профиль
- `GET /api/profile` - профиль пользователя
- `PUT /api/profile` - обновление профиля
- `GET /api/profile/loads` - грузы пользователя
- `GET /api/profile/history` - история

### Админ
- `GET /api/admin/users` - список пользователей
- `GET /api/admin/loads` - список грузов
- `GET /api/admin/stats` - статистика
- `PUT /api/admin/users/:id/block` - блокировка пользователя
- `DELETE /api/admin/users/:id` - удаление пользователя

### Брокер
- `GET /api/broker/clients` - клиенты
- `GET /api/broker/loads` - грузы брокера
- `GET /api/broker/drivers` - водители
- `GET /api/broker/deals` - сделки
- `PUT /api/broker/loads/:id/assign` - назначение водителя

## Тестирование

Для тестирования авторизации используйте:
- Телефон: любой (например, `+79001234567`)
- Код SMS: `1234` (для всех номеров)

## Разработка

Проект использует:
- **Composition API** для всех компонентов
- **TypeScript** для типизации
- **TailwindCSS** для стилей
- **Pinia** для управления состоянием

## Лицензия

MIT

