# Возьми с собой - API Backend

Node.js API бэкенд для интернет-магазина "Возьми с собой"

## Технологический стек

- Node.js + Express
- PostgreSQL
- JWT авторизация
- Plusofon Flash Call для авторизации
- Multer для загрузки файлов

## Установка и запуск на VPS Ubuntu 24.04

### 1. Установка необходимых пакетов

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Установка nginx
sudo apt install -y nginx

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

### 2. Настройка PostgreSQL

```bash
# Вход в PostgreSQL
sudo -u postgres psql

# Создание базы данных и пользователя
CREATE DATABASE vozmi_s_soboj;
CREATE USER vozmi_admin WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE vozmi_s_soboj TO vozmi_admin;
\q
```

### 3. Развертывание backend

```bash
# Создание директории для проекта
sudo mkdir -p /var/www/vozmi-s-soboj
cd /var/www/vozmi-s-soboj

# Клонирование/копирование файлов backend
# (скопируйте папку backend в эту директорию)

cd backend

# Установка зависимостей
npm install

# Создание .env файла
cp .env.example .env
nano .env
```

Отредактируйте `.env`:
```
NODE_ENV=production
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=vozmi_s_soboj
DB_USER=vozmi_admin
DB_PASSWORD=your_strong_password

JWT_SECRET=your_very_secure_random_jwt_secret_key
JWT_EXPIRE=7d

PLUSOFON_API_KEY=your_plusofon_api_key
PLUSOFON_API_URL=https://api.plusofon.ru

UPLOAD_PATH=/var/www/vozmi-s-soboj/backend/uploads
MAX_FILE_SIZE=5242880

CORS_ORIGIN=https://vozmi-s-soboj.ru
```

### 4. Миграция базы данных

```bash
npm run migrate
```

### 5. Создание первого администратора

После первого входа через Flash Call, первый пользователь автоматически получит роль администратора.

### 6. Запуск с PM2

```bash
pm2 start server.js --name vozmi-api
pm2 save
pm2 startup
```

### 7. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/vozmi-s-soboj
```

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name vozmi-s-soboj.ru www.vozmi-s-soboj.ru;

    # API backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Загруженные файлы
    location /uploads {
        alias /var/www/vozmi-s-soboj/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (React)
    location / {
        root /var/www/vozmi-s-soboj/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/vozmi-s-soboj /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Установка SSL сертификата (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d vozmi-s-soboj.ru -d www.vozmi-s-soboj.ru
```

### 9. Настройка автообновления SSL

```bash
sudo certbot renew --dry-run
```

## API Endpoints

### Авторизация
- `POST /api/auth/flash-call` - Инициация Flash Call
- `POST /api/auth/verify-flash-call` - Верификация Flash Call
- `POST /api/auth/register-name` - Регистрация имени
- `GET /api/auth/me` - Получить текущего пользователя
- `POST /api/auth/logout` - Выход

### Товары
- `GET /api/products` - Получить все товары
- `GET /api/products/:id` - Получить товар по ID
- `GET /api/products/category/:categoryId` - Товары по категории
- `POST /api/products` - Создать товар (admin, manager)
- `PUT /api/products/:id` - Обновить товар (admin, manager)
- `DELETE /api/products/:id` - Удалить товар (admin, manager)

### Категории
- `GET /api/categories` - Все категории
- `GET /api/categories/:id` - Категория по ID
- `POST /api/categories` - Создать категорию (admin, manager)
- `PUT /api/categories/:id` - Обновить категорию (admin, manager)
- `DELETE /api/categories/:id` - Удалить категорию (admin, manager)

### Заказы
- `GET /api/orders/my-orders` - Мои заказы (client)
- `POST /api/orders` - Создать заказ (client)
- `GET /api/orders` - Все заказы (admin, manager, courier)
- `GET /api/orders/:id` - Заказ по ID
- `PUT /api/orders/:id/status` - Обновить статус (admin, manager)
- `PUT /api/orders/:id/assign-courier` - Назначить курьера (admin, manager)
- `GET /api/orders/courier/my-deliveries` - Мои доставки (courier)
- `PUT /api/orders/:id/mark-delivered` - Отметить доставленным (courier)

### Пользователи
- `GET /api/users` - Все пользователи (admin)
- `POST /api/users` - Создать пользователя (admin)
- `PUT /api/users/:id` - Обновить пользователя (admin)
- `DELETE /api/users/:id` - Удалить пользователя (admin)
- `GET /api/users/couriers` - Список курьеров (admin, manager)

### Корзина
- `GET /api/cart` - Получить корзину
- `POST /api/cart/add` - Добавить в корзину
- `PUT /api/cart/update` - Обновить количество
- `DELETE /api/cart/remove/:productId` - Удалить из корзины
- `DELETE /api/cart/clear` - Очистить корзину

### Избранное
- `GET /api/favorites` - Получить избранное
- `POST /api/favorites/add` - Добавить в избранное
- `DELETE /api/favorites/remove/:productId` - Удалить из избранного

## Безопасность

- JWT токены для авторизации
- Валидация всех входных данных
- Rate limiting (100 запросов за 15 минут)
- Helmet для защиты HTTP заголовков
- CORS настроен на конкретный домен
- Параметризованные SQL запросы (защита от SQL injection)
- Мягкое удаление записей
- Ограничение размера загружаемых файлов

## Мониторинг и логи

```bash
# Просмотр логов
pm2 logs vozmi-api

# Статус приложения
pm2 status

# Перезапуск
pm2 restart vozmi-api

# Остановка
pm2 stop vozmi-api
```

## Резервное копирование базы данных

```bash
# Создание бэкапа
pg_dump -U vozmi_admin -d vozmi_s_soboj > backup_$(date +%Y%m%d).sql

# Восстановление из бэкапа
psql -U vozmi_admin -d vozmi_s_soboj < backup_20250101.sql
```

## Поддержка

При возникновении проблем проверьте:
1. Логи приложения: `pm2 logs vozmi-api`
2. Логи nginx: `sudo tail -f /var/log/nginx/error.log`
3. Статус PostgreSQL: `sudo systemctl status postgresql`
4. Подключение к БД: проверьте `.env` файл
