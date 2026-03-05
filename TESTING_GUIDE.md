# Buy-01 Testing Guide

## Backend Testing

### Unit Tests

Run all unit tests:
```bash
cd backend/user-service
mvn test

cd backend/product-service
mvn test

cd backend/media-service
mvn test
```

### Integration Tests

Run integration tests:
```bash
cd backend/user-service
mvn verify

cd backend/product-service
mvn verify

cd backend/media-service
mvn verify
```

### Test Coverage

Generate coverage reports:
```bash
cd backend/user-service
mvn jacoco:report
# Report: target/site/jacoco/index.html

cd backend/product-service
mvn jacoco:report
# Report: target/site/jacoco/index.html

cd backend/media-service
mvn jacoco:report
# Report: target/site/jacoco/index.html
```

## Frontend Testing

### Unit Tests

Run Angular unit tests:
```bash
cd frontend
ng test
```

### E2E Tests

Run end-to-end tests:
```bash
cd frontend
ng e2e
```

### Code Coverage

Generate coverage report:
```bash
cd frontend
ng test --code-coverage
# Report: coverage/index.html
```

## Manual Testing Scenarios

### Scenario 1: User Registration & Login

1. **Register as SELLER**
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

2. **Login**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "seller@test.com",
       "password": "Test123!"
     }'
   ```

3. **Verify JWT token received**
   - Token should be valid for 24 hours
   - Contains userId and role claims

### Scenario 2: Product Creation & Management

1. **Create Product**
   ```bash
   TOKEN="your_token"
   curl -X POST http://localhost:8080/api/products \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Product",
       "description": "Test Description",
       "price": 99.99,
       "stock": 10,
       "sellerId": "seller123",
       "imageUrls": []
     }'
   ```

2. **Verify PRODUCT_CREATED event published to Kafka**
   ```bash
   docker exec buy01-kafka kafka-console-consumer.sh \
     --bootstrap-server localhost:9092 \
     --topic PRODUCT_CREATED \
     --from-beginning
   ```

3. **Update Product**
   ```bash
   TOKEN="your_token"
   curl -X PUT http://localhost:8080/api/products/{productId} \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"price": 149.99}'
   ```

4. **Delete Product**
   ```bash
   TOKEN="your_token"
   curl -X DELETE http://localhost:8080/api/products/{productId} \
     -H "Authorization: Bearer $TOKEN"
   ```

### Scenario 3: Image Upload & Validation

1. **Upload Valid Image (JPEG, PNG, GIF, WebP)**
   ```bash
   TOKEN="your_token"
   curl -X POST http://localhost:8080/api/media/images \
     -H "Authorization: Bearer $TOKEN" \
     -F "file=@image.jpg" \
     -F "productId=product123" \
     -F "sellerId=seller123"
   ```

2. **Verify IMAGE_UPLOADED event published**
   ```bash
   docker exec buy01-kafka kafka-console-consumer.sh \
     --bootstrap-server localhost:9092 \
     --topic IMAGE_UPLOADED \
     --from-beginning
   ```

3. **Test Invalid File Type (should fail)**
   ```bash
   TOKEN="your_token"
   curl -X POST http://localhost:8080/api/media/images \
     -H "Authorization: Bearer $TOKEN" \
     -F "file=@document.pdf" \
     -F "productId=product123" \
     -F "sellerId=seller123"
   # Expected: 400 Bad Request
   ```

4. **Test File Size Limit (>2MB should fail)**
   ```bash
   # Create 3MB file
   dd if=/dev/zero of=large.jpg bs=1M count=3
   
   TOKEN="your_token"
   curl -X POST http://localhost:8080/api/media/images \
     -H "Authorization: Bearer $TOKEN" \
     -F "file=@large.jpg" \
     -F "productId=product123" \
     -F "sellerId=seller123"
   # Expected: 400 Bad Request
   ```

### Scenario 4: Authorization & Ownership

1. **Seller A creates product**
   ```bash
   TOKEN_A="seller_a_token"
   curl -X POST http://localhost:8080/api/products \
     -H "Authorization: Bearer $TOKEN_A" \
     -H "Content-Type: application/json" \
     -d '{...}'
   ```

2. **Seller B tries to update Seller A's product (should fail)**
   ```bash
   TOKEN_B="seller_b_token"
   curl -X PUT http://localhost:8080/api/products/{productId} \
     -H "Authorization: Bearer $TOKEN_B" \
     -H "Content-Type: application/json" \
     -d '{"price": 999.99}'
   # Expected: 403 Forbidden
   ```

### Scenario 5: Rate Limiting

1. **Test rate limit on auth endpoint (10 req/s)**
   ```bash
   for i in {1..50}; do
     curl -X POST http://localhost:8080/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"email":"test@test.com","password":"test"}' &
   done
   wait
   # Some requests should return 429 Too Many Requests
   ```

### Scenario 6: Error Handling

1. **Test validation errors**
   ```bash
   # Missing required field
   curl -X POST http://localhost:8080/api/products \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name": "Test"}'
   # Expected: 400 Bad Request with validation message
   ```

2. **Test authentication errors**
   ```bash
   # Missing token
   curl http://localhost:8080/api/products/123
   # Expected: 401 Unauthorized
   ```

3. **Test not found errors**
   ```bash
   TOKEN="your_token"
   curl http://localhost:8080/api/products/nonexistent
   # Expected: 404 Not Found
   ```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test product listing (100 requests, 10 concurrent)
ab -n 100 -c 10 http://localhost:8080/api/products

# Test with authentication
ab -n 100 -c 10 -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/products
```

### Load Testing with wrk

```bash
# Install wrk
brew install wrk  # macOS
apt-get install wrk  # Ubuntu

# Test product listing
wrk -t4 -c100 -d30s http://localhost:8080/api/products

# Test with authentication
wrk -t4 -c100 -d30s \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/products
```

## Health Check Verification

```bash
# User Service
curl http://localhost:8081/actuator/health

# Product Service
curl http://localhost:8082/actuator/health

# Media Service
curl http://localhost:8083/actuator/health

# Gateway
curl http://localhost:8080/actuator/health

# All should return:
{
  "status": "UP",
  "components": {
    "db": {"status": "UP"},
    "kafka": {"status": "UP"},
    "redis": {"status": "UP"}
  }
}
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '21'
      - run: cd backend/user-service && mvn test
      - run: cd backend/product-service && mvn test
      - run: cd backend/media-service && mvn test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run test -- --watch=false
```

## Test Checklist

- [ ] User registration with CLIENT role
- [ ] User registration with SELLER role
- [ ] User login returns valid JWT
- [ ] Product creation by SELLER
- [ ] Product listing (public)
- [ ] Product update by owner
- [ ] Product update by non-owner (should fail)
- [ ] Product deletion by owner
- [ ] Image upload with valid MIME type
- [ ] Image upload with invalid MIME type (should fail)
- [ ] Image upload exceeding 2MB (should fail)
- [ ] Rate limiting on auth endpoint
- [ ] Rate limiting on media endpoint
- [ ] Health checks return UP
- [ ] Kafka events published correctly
- [ ] Error responses have correct format
- [ ] JWT validation at gateway
- [ ] CORS headers present
- [ ] Ownership enforcement on mutations
