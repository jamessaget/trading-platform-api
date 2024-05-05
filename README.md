# Trading Platform Api

An api to create a user & authentication token which can be used to create and update deals.  Users will only be able to see deals which they have associated to them through the user_deals table. Anytime a new deal is created or an existing deal is updated all users who are authorized to see that sellers deals will get an update sent to any of their registered webhooks.

## Setup

1. Copy env
```
cp .env.example .env
```
2. Build docker container
This will build x3 containers one for the node api, one for redis and one for mysql.
```
docker-compose up -d trading-platform-api
```
3. 
    - Shell into the trading-platform-api contains
    - Run prisma command to migrate (This will run migrations based on the prisma.schea file)
    - Seed database with user_types (buyer & seller)
```
docker exec -it trading-platform-api sh
npx prisma db push
npx prisma db seed
```

## Example requests
### Users
- Create user
```
clear && curl -H 'Content-type: application/json' -X 'POST' 'http://0.0.0.0:3000/v1/users' -d '{"name": "test user", "email": "test@test.com", "password": "plain_text_password", "user_type": ["buyer"]}'
```
### OAuth
- Create oauth token
```
clear && curl -H 'Content-type: application/json' -X 'POST' 'http://0.0.0.0:3000/v1/oauth/token' -d -H 'Authorization: Bearer *insert-token*' '{"username": "myemai@email.com", "password": "plain_text_password", "grant_type": "password"}'
```
### Deals
- Create deal
```
clear && curl -H 'Content-type: application/json' -X 'POST' 'http://0.0.0.0:3000/v1/deals' -H 'Authorization: Bearer *insert-token*' -d '{"name": "deal 2", "total_price": 200, "status": "available", "currency": "gbp", "deal_items": [{"name": "item1", "price": 123}, {"name": "item2", "price": 1200}], "discount": {"amount": 600, "type": "flat"}}' -vvv
```
- Update deal
```
clear && curl -H 'Content-type: application/json' -X 'PATCH' 'http://0.0.0.0:3000/v1/deals/:id' -H 'Authorization: Bearer *insert-token*' -d '{"name": "deal 2", "total_price": 200, "status": "available", "currency": "gbp"}' -vvv
```
- Get deal
```
clear && curl -H 'Content-type: application/json' 'http://0.0.0.0:3000/v1/deal?page=2&per_page=100' -H 'Authorization: Bearer *insert-token*' 
```
### Webhooks
- Create webhook
```
clear && curl -H 'Content-type: application/json' -X 'POST' 'http://0.0.0.0:3000/v1/webhooks' -d -H 'Authorization: Bearer *insert-token*' '{"name": "my webhook", "webhook_url": "https://mywebsite.com"}'
```
- Delete webhook
```
clear && curl -H 'Content-type: application/json' -X 'DELETE' 'http://0.0.0.0:3000/v1/webhooks/:id' -d -H 'Authorization: Bearer *insert-token*'
```