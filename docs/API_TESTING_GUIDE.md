# Buy-01 API Testing Guide

## Quick Start

### 1. Start Services
```bash
cd backend
docker-compose up -d
```

### 2. Test Health Checks
```bash
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Product Service
curl http://localhost:8083/actuator/health  # Media Service
curl http://localhost:8080/actuator/health  # Gateway
```

## Authentication Flow

### Register User (CLIENT)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "SecurePass123!",
    "role": "CLIENT",
    "name": "John Client"
  }'
```

### Register User (SELLER)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "SecurePass123!",
    "role": "SELLER",
    "name": "Jane Seller"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@example.com",
    "password": "SecurePass123!"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user123",
  "role": "SELLER"
}
```

## Product Management (SELLER)

### Create Product
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Premium noise-cancelling headphones",
    "price": 199.99,
    "stock": 50,
    "sellerId": "seller123",
    "imageUrls": []
  }'
```

### Get All Products (PUBLIC)
```bash
curl http://localhost:8080/api/products
```

### Get Product by ID (PUBLIC)
```bash
curl http://localhost:8080/api/products/{productId}
```

### Update Product (SELLER, owner only)
```bash
TOKEN="your_jwt_token_here"

curl -X PUT http://localhost:8080/api/products/{productId} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "price": 249.99
  }'
```

### Delete Product (SELLER, owner only)
```bash
TOKEN="your_jwt_token_here"

curl -X DELETE http://localhost:8080/api/products/{productId} \
  -H "Authorization: Bearer $TOKEN"
```

## Media Management (SELLER)

### Upload Image
```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/media/images \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "productId=product123" \
  -F "sellerId=seller123"
```

Response:
```json
{
  "url": "http://localhost:9010/product-images/image123.jpg",
  "message": "Image uploaded successfully"
}
```

### Get Image (PUBLIC)
```bash
curl http://localhost:8080/api/media/images/{imageId}
```

### Delete Image (SELLER, owner only)
```bash
TOKEN="your_jwt_token_here"

curl -X DELETE http://localhost:8080/api/media/images/{imageId} \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limiting

Rate limits are enforced per endpoint:
- **Auth/User**: 10 req/s, burst 20
- **Products**: 20 req/s, burst 40
- **Media**: 5 req/s, burst 10

When limit exceeded: `429 Too Many Requests`

```bash
# Test rate limiting
for i in {1..50}; do
  curl http://localhost:8080/api/products
done
```

## Error Responses

### 400 Bad Request
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "File size exceeds 2MB limit",
  "path": "/api/media/images"
}
```

### 401 Unauthorized
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid JWT token",
  "path": "/api/products"
}
```

### 403 Forbidden
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 403,
  "error": "Forbidden",
  "message": "You don't have permission to modify this product",
  "path": "/api/products/123"
}
```

### 429 Too Many Requests
```json
{
  "status": 429,
  "message": "Rate limit exceeded"
}
```

## Kafka Events

Monitor events published to Kafka:

```bash
# List topics
docker exec buy01-kafka kafka-topics.sh --list --bootstrap-server localhost:9092

# Consume USER_REGISTERED events
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic USER_REGISTERED \
  --from-beginning

# Consume PRODUCT_CREATED events
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic PRODUCT_CREATED \
  --from-beginning

# Consume IMAGE_UPLOADED events
docker exec buy01-kafka kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic IMAGE_UPLOADED \
  --from-beginning
```

## Monitoring

### Health Checks
```bash
curl http://localhost:8081/actuator/health  # User Service
curl http://localhost:8082/actuator/health  # Product Service
curl http://localhost:8083/actuator/health  # Media Service
curl http://localhost:8080/actuator/health  # Gateway
```

### Metrics
```bash
curl http://localhost:8081/actuator/metrics
curl http://localhost:8082/actuator/metrics
curl http://localhost:8083/actuator/metrics
curl http://localhost:8080/actuator/metrics
```

### Service Info
```bash
curl http://localhost:8081/actuator/info
curl http://localhost:8082/actuator/info
curl http://localhost:8083/actuator/info
curl http://localhost:8080/actuator/info
```

## Troubleshooting

### Services won't start
```bash
# Check if ports are in use
lsof -i :8080
lsof -i :8081
lsof -i :8082
lsof -i :8083

# Check Eureka registration
curl http://localhost:8761/eureka/apps
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker exec buy01-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Kafka issues
```bash
# Check Kafka broker
docker exec buy01-kafka kafka-broker-api-versions.sh --bootstrap-server localhost:9092
```

### Redis connection issues
```bash
# Test Redis connection
docker exec buy01-redis redis-cli ping
```
