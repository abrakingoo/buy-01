# Buy-01 Quick Reference Guide

## Start Services (30 seconds)

```bash
cd backend && docker-compose up -d
cd frontend && npm install && ng serve
```

**Access:**
- Frontend: http://localhost:4200
- API: http://localhost:8080
- Eureka: http://localhost:8761

---

## Authentication

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@test.com",
    "password": "Test123!",
    "role": "SELLER",
    "name": "Test Seller"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@test.com",
    "password": "Test123!"
  }'
```

**Save token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Products

### Create
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Description",
    "price": 99.99,
    "stock": 10,
    "sellerId": "seller123",
    "imageUrls": []
  }'
```

### List (Public)
```bash
curl http://localhost:8080/api/products
```

### Get One
```bash
curl http://localhost:8080/api/products/{productId}
```

### Update
```bash
curl -X PUT http://localhost:8080/api/products/{productId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 149.99}'
```

### Delete
```bash
curl -X DELETE http://localhost:8080/api/products/{productId} \
  -H "Authorization: Bearer $TOKEN"
```

---

## Images

### Upload
```bash
curl -X POST http://localhost:8080/api/media/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg" \
  -F "productId=product123" \
  -F "sellerId=seller123"
```

### Download
```bash
curl http://localhost:8080/api/media/images/{imageId} -o image.jpg
```

### Delete
```bash
curl -X DELETE http://localhost:8080/api/media/images/{imageId} \
  -H "Authorization: Bearer $TOKEN"
```

---

## Health Checks

```bash
# All services
curl http://localhost:8081/actuator/health  # User
curl http://localhost:8082/actuator/health  # Product
curl http://localhost:8083/actuator/health  # Media
curl http://localhost:8080/actuator/health  # Gateway
```

---

## Monitoring

### Metrics
```bash
curl http://localhost:8081/actuator/metrics
```

### Service Info
```bash
curl http://localhost:8081/actuator/info
```

### Kafka Events
```bash
# USER_REGISTERED
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic USER_REGISTERED --from-beginning

# PRODUCT_CREATED
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic PRODUCT_CREATED --from-beginning

# IMAGE_UPLOADED
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic IMAGE_UPLOADED --from-beginning
```

---

## Debugging

### View Logs
```bash
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f media-service
docker-compose logs -f gateway
```

### Check Services
```bash
docker-compose ps
```

### Restart Service
```bash
docker-compose restart user-service
```

### Stop All
```bash
docker-compose down
```

---

## Common Errors

### 401 Unauthorized
- Missing `Authorization: Bearer $TOKEN` header
- Token expired (24 hours)
- Invalid token signature

### 403 Forbidden
- Not the product owner
- Wrong role (need SELLER)

### 400 Bad Request
- File > 2MB
- Invalid MIME type (not image/*)
- Missing required fields

### 429 Too Many Requests
- Rate limit exceeded
- Wait a few seconds and retry

---

## Configuration

### Environment Variables
```bash
# User Service
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Media Service
MINIO_URL=http://localhost:9010
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Gateway
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## Documentation

- **API_TESTING_GUIDE.md** - Detailed API examples
- **TESTING_GUIDE.md** - Testing procedures
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **IMPLEMENTATION_SUMMARY.md** - Complete overview

---

## Rate Limits

| Endpoint | Limit | Burst |
|----------|-------|-------|
| Auth/User | 10/s | 20 |
| Products | 20/s | 40 |
| Media | 5/s | 10 |

---

## Security

-  JWT authentication
-  BCrypt password hashing
-  CORS enabled
-  Rate limiting
-  Input validation
-  File validation
-  Ownership enforcement

---

## Frontend Routes

| Route | Role | Purpose |
|-------|------|---------|
| `/` | Public | Products listing |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/products/:id` | Public | Product details |
| `/seller/dashboard` | SELLER | Manage products |
| `/seller/media` | SELLER | Manage images |
| `/profile` | Authenticated | User profile |

---

## Database

### Collections
- `users` - User accounts
- `products` - Product catalog
- `media` - Image metadata

### Indexes
- User: email (unique)
- Product: sellerId
- Media: sellerId

---

## Deployment

### Docker
```bash
docker-compose build
docker-compose up -d
```

### Manual
```bash
mvn spring-boot:run  # Each service in separate terminal
ng serve             # Frontend
```

---

## Support

1. Check logs: `docker-compose logs -f <service>`
2. Check health: `curl http://localhost:8080/actuator/health`
3. Review docs: See DEPLOYMENT_GUIDE.md
4. Test API: See API_TESTING_GUIDE.md

---