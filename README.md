# Trading Platform Api

# Example requests
- Create deal
```
clear && curl -H 'Content-type: application/json' -X 'POST' 'http://0.0.0.0:3000/v1/deals' -H 'Authorization: Bearer *insert-token*' -d '{"name": "deal 2", "total_price": 200, "status": "available", "currency": "gbp"}' -vvv
```