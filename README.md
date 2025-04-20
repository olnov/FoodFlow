## FoodFlow

FoodFlow — система управления продовольственными запасами, построенная на микросервисной архитектуре. Приложение предназначено для отслеживания, анализа и контроля пищевых продуктов на складах, в учреждениях и организациях.

## Основные возможности:
 - Учёт остатков продуктов по категориям, единицам измерения и срокам годности
 - Управление каталогом продуктов
 - Централизованная аутентификация пользователей
 - Единая точка входа через API Gateway
 - Веб-интерфейс для сотрудников и администраторов

## Технологии:
 - NestJS + TypeScript (бэкенд)
 - MongoDB (база данных)
 - Swagger (документация API)
 - Docker / Docker Compose (развёртывание)
 - Микросервисная архитектура: разделение по доменам (аутентификация, инвентаризация, каталог и др.)

## Выскооуровневоя архитектура

![HL Architecture](./doc-images/hl-architecture.png)

## Пример взаимодействия каталога и инветорки

![C-I UML](./doc-images/catalog-inventory-uml.png)

## Аутентификация/Авторизация
В текущей реализации используется авторизация по JWT токенам для пользователей, а также для микросервисов как часть Passport Strategy.
Для пользователей создаются учетные записи в таблице Users, для микросервисов создаются сервисные учетные записи в таблице
Clients соответсвенно.
Время жизни токено в текущей реализации не меняется и составляет:
 - Пользовательский AccessToken - 15 минут.
 - Сервисный токен - 30 минут.
 - Рефреш токен - 7 дней.

## Пример переменных для установки с помощью docker compose

```dotenv
INVENTORY_SERVICE_URL="http://inventory-service:3011/api/v1"
CATALOG_SERVICE_URL="http://product-catalog-service:3012/api/v1"
AUTH_SERVICE_URL="http://auth-service:3013/api/v1"
JWT_SECRET=my_super_secret
AUTH_DB_URI=mongodb://mongo-service:27017/auth_service
INV_DB_URI=mongodb://mongo-service:27017/inventory_service
CAT_DB_URI=mongodb://mongo-service:27017/product_catalog_service
INV_M2M_ID=inventory_service
INV_M2M_SECRET=password!1
CAT_M2M_ID=product_catalog_service
CAT_M2M_SECRET=password!1
BACKEND_URL=http://caddy
```
## Запуск через docker compose
```console
docker compose -f docker-compose.dev.yml up 
```

## Создание учетной записи администратора
```console
cd seed
pip install -r requirements.txt
python seed_users.py
```
## Создание сервисных учетных записей
```console
cd seed
pip install -r requirements.txt
python seed_service_accounts.py
```
## Наполнение каталога тестовыми данными
```console
cd seed
pip install -r requirements.txt
python seed_catalog.py
```
## Использование SwaggerUI

 - http://localhost/auth/api/v1/docs - Auth Service SwaggerUI
 - http://lolalhost/inventory/api/v1/docs - Inventory Service SwaggerUI
 - http://localhost/catalog/api/v1/docs - Catalog Service SwaggerUI
