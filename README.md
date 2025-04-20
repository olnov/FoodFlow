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
## Создание сервисных учетных записей
```console
cd seed
pip install -r requirements.txt
python seed_data.py
```
## Наполнение каталога тестовыми данными (опционально)
```console
cd seed
pip install -r requirements.txt
python seed_catalog_data.py
```