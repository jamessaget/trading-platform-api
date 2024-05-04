# Trading Platform Api

*insert brief description*

## Setup

*insert setup instructions*

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