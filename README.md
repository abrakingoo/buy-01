# Buy-01 E-Commerce Platform

#backend microserive

https://github.com/user-attachments/assets/889acd8f-80e0-4921-9bf5-6269d474a3b7



A production-ready, microservices-based e-commerce marketplace built with Spring Boot and Angular. Users can register as clients or sellers, with sellers managing products and media while clients browse the catalog.

## Project Overview

Buy-01 is a full-stack e-commerce platform demonstrating modern cloud-native architecture patterns:

- Microservices Architecture: Independently deployable services (User, Product, Media)
- API Gateway Pattern: Centralized routing, authentication, and cross-cutting concerns
- Service Discovery: Netflix Eureka for dynamic service registration
- Event-Driven Communication: Apache Kafka for asynchronous messaging
- JWT Authentication: Secure, stateless authentication with role-based access control
- Angular SPA: Responsive UI with guards, interceptors, and reactive forms

### Key Features

- User Management: Registration, authentication, and profile management
- Role-Based Access: CLIENT (browse) vs SELLER (manage catalog)
- Product Catalog: Full CRUD operations with ownership enforcement
- Media Management: Secure image uploads with validation (2MB limit, image/* only)
- Responsive UI: Angular Material/Bootstrap with mobile-first design
- Security: HTTPS, BCrypt password hashing, CORS, input validation
- Observability: Health checks, actuator endpoints, event logging

---

## Architecture

### System Components

```
Frontend (Angular 4200)
    |
    | HTTPS + JWT
    v
API Gateway (8080)
    | JWT Validation, CORS, Rate Limiting
    |
    +-- User Service (8081)
    +-- Product Service (8082)
    +-- Media Service (8083)
    |
    +-- MongoDB (3 databases)
    +-- Kafka (3 topics)
    +-- MinIO (Object Storage)
    +-- Redis (Rate Limiting)
    +-- Eureka (8761)
```

### Service Discovery

All services register with Eureka Server (Port 8761) for dynamic service resolution.

### Event Bus

Apache Kafka handles asynchronous events:
- PRODUCT_CREATED - Product catalog updates
- IMAGE_UPLOADED - Media processing triggers
- USER_REGISTERED - Welcome emails, analytics

---

## Technology Stack

### Backend
- Java 21 with Spring Boot 3.2
- Spring Cloud Gateway - API routing and filtering
- Spring Security - JWT authentication
- Spring Data MongoDB - Data persistence
- Apache Kafka - Event streaming
- Netflix Eureka - Service discovery
- BCrypt - Password hashing
- Maven - Dependency management

### Frontend
- Angular 18 with TypeScript
- Angular Material / Bootstrap 5 - UI components
- RxJS - Reactive programming
- Angular Router - Navigation and guards
- HttpClient - API communication

### Infrastructure
- MongoDB 6.0+ - NoSQL database
- Apache Kafka 3.x - Message broker
- MinIO - Object storage
- Redis - Rate limiting backend
- Docker & Docker Compose - Containerization

---

## Prerequisites

- Java 21+ (Download: https://adoptium.net/)
- Node.js 18+ and npm (Download: https://nodejs.org/)
- MongoDB 6.0+ (Download: https://www.mongodb.com/try/download/community)
- Docker & Docker Compose (Download: https://www.docker.com/)
- Maven 3.8+ (Download: https://maven.apache.org/download.cgi)

---

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/buy-01.git
cd buy-01

# Start all services
cd backend
docker-compose up -d

# Start frontend
cd ../frontend
npm install
ng serve
```

Access Points:
- Frontend: http://localhost:4200
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

### Option 2: Manual Setup

#### 1. Start Backend Services

```bash
# Terminal 1: Discovery Service
cd backend/discovery-service
mvn spring-boot:run

# Terminal 2: API Gateway
cd backend/gateway
mvn spring-boot:run

# Terminal 3: User Service
cd backend/user-service
mvn spring-boot:run

# Terminal 4: Product Service
cd backend/product-service
mvn spring-boot:run

# Terminal 5: Media Service
cd backend/media-service
mvn spring-boot:run
```

#### 2. Start Frontend

```bash
cd frontend
npm install
ng serve
```

Navigate to http://localhost:4200

---

## Project Structure

```
buy-01/
├── backend/
│   ├── discovery-service/          # Eureka Server (8761)
│   │   ├── src/
│   │   └── pom.xml
│   ├── gateway/                    # API Gateway (8080)
│   │   ├── src/main/java/com/buy01/gateway/
│   │   │   ├── config/
│   │   │   │   ├── GatewayFilter.java
│   │   │   │   ├── RateLimiterConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   └── GatewayApplication.java
│   │   └── pom.xml
│   ├── user-service/               # User Service (8081)
│   │   ├── src/main/java/com/buy01/user/
│   │   │   ├── config/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── LoginUser.java
│   │   │   │   ├── RegisterUser.java
│   │   │   │   ├── LogoutUser.java
│   │   │   │   └── UpdateUser.java
│   │   │   ├── dto/
│   │   │   ├── event/
│   │   │   │   ├── UserEventProducer.java
│   │   │   │   └── UserRegisteredEvent.java
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── utils/
│   │   │   └── UserServiceApplication.java
│   │   └── pom.xml
│   ├── product-service/            # Product Service (8082)
│   │   ├── src/main/java/com/buy01/product/
│   │   │   ├── Config/
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── event/
│   │   │   │   ├── ProductEventProducer.java
│   │   │   │   └── ProductCreatedEvent.java
│   │   │   ├── models/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   ├── utils/
│   │   │   └── ProductServiceApplication.java
│   │   └── pom.xml
│   ├── media-service/              # Media Service (8083)
│   │   ├── src/main/java/com/buy01/media/
│   │   │   ├── config/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── MinioConfig.java
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── event/
│   │   │   │   ├── ImageUploadedEvent.java
│   │   │   │   └── MediaEventProducer.java
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── MediaServiceApplication.java
│   │   └── pom.xml
│   ├── docker-compose.yml
│   ├── PROJECT_STRUCTURE.md
│   └── STARTUP.md
├── frontend/                       # Angular SPA (4200)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── media.model.ts
│   │   │   │   └── product.model.ts
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── products/
│   │   │   │   ├── product-detail/
│   │   │   │   ├── seller-dashboard/
│   │   │   │   ├── media-manager/
│   │   │   │   └── profile/
│   │   │   ├── pipes/
│   │   │   │   └── currency.pipe.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── media.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── toast.service.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── README.md
│   └── SETUP.md
├── docs/                           # Documentation
│   ├── API_TESTING_GUIDE.md
│   ├── TESTING_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── QUICK_REFERENCE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── PROJECT_COMPLETION_REPORT.md
├── .gitignore
├── architecture.md
└── README.md
```

---

## API Routes

### Gateway Routes (Port 8080)

All external traffic goes through the gateway:

```
/api/auth/**      -> user-service (8081)
/api/users/**     -> user-service (8081)
/api/products/**  -> product-service (8082)
/api/media/**     -> media-service (8083)
```

### User Service Endpoints (8081)

Authentication:
- POST /auth/register - Register CLIENT or SELLER (201 Created)
- POST /auth/login - Login with JWT token (200 OK)

Profile:
- GET /me - Get user profile (Authenticated)
- PUT /me - Update profile (Authenticated)

### Product Service Endpoints (8082)

Public:
- GET /products - List all products (paginated)
- GET /products/{id} - Get product details

Seller Only:
- POST /products - Create product (201 Created)
- PUT /products/{id} - Update product (owner only)
- DELETE /products/{id} - Delete product (owner only)

### Media Service Endpoints (8083)

Seller Only:
- POST /media/images - Upload image (multipart/form-data)
- GET /media/images/{id} - Download image (Public)
- DELETE /media/images/{id} - Delete image (owner only)

---

## Frontend Routes

```
/                    -> Products listing (public)
/login               -> Login page (public)
/register            -> Registration page (public)
/products/:id        -> Product details (public)
/seller/dashboard    -> Seller product management (SELLER only)
/seller/media        -> Media manager (SELLER only)
/profile             -> User profile (Authenticated)
```

---

## Authentication & Authorization

### JWT Flow

1. Registration/Login -> User Service issues JWT
2. Token Storage -> Angular stores in localStorage/sessionStorage
3. API Requests -> Interceptor attaches Authorization: Bearer <token>
4. Gateway Validation -> Verifies JWT signature and expiration
5. Header Propagation -> Gateway adds X-User-Id and X-Role headers
6. Service Authorization -> Services enforce ownership and role checks

### JWT Payload

```json
{
  "sub": "user123",
  "role": "SELLER",
  "exp": 1735689600,
  "iat": 1735603200
}
```

### Roles

- CLIENT: Browse products, view details
- SELLER: Manage own products and media
- ADMIN: Moderation and system management (optional)

### Security Measures

- Password Hashing: BCrypt with salt (cost factor 12)
- HTTPS: TLS 1.3 end-to-end encryption
- CORS: Whitelist allowed origins at gateway
- Input Validation: Bean Validation (JSR-380) on all DTOs
- File Validation: MIME type sniffing, size limits (2MB)
- Ownership Enforcement: sellerId verification on mutations
- Rate Limiting: 10/20/5 req/s per endpoint

---

## Database Design

### User Collection (users-db)

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  role: String (enum: CLIENT, SELLER, ADMIN),
  name: String,
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Collection (products-db)

```javascript
{
  _id: ObjectId,
  sellerId: String (indexed),
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  imageUrls: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Media Collection (media-db)

```javascript
{
  _id: ObjectId,
  sellerId: String (indexed),
  filename: String,
  mimeType: String,
  size: Number,
  storageUrl: String,
  uploadedAt: Date
}
```

---

## Error Handling

### HTTP Status Codes

- 200 OK - Successful GET/PUT
- 201 Created - Successful POST
- 204 No Content - Successful DELETE
- 400 Bad Request - Invalid input, file too large, wrong MIME type
- 401 Unauthorized - Missing or invalid JWT
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource doesn't exist or not owned
- 409 Conflict - Duplicate email, constraint violation
- 429 Too Many Requests - Rate limit exceeded
- 500 Internal Server Error - Unhandled exceptions

### Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "File size exceeds 2MB limit",
  "path": "/api/media/images"
}
```

---

## Monitoring & Observability

### Health Checks

All services expose Spring Boot Actuator endpoints:

```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
```

### Kafka Events

Monitor events published to Kafka:

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

## Documentation

For comprehensive guides and documentation, see the docs/ directory:

- API_TESTING_GUIDE.md - API examples and testing
- TESTING_GUIDE.md - Unit, integration, and E2E testing
- DEPLOYMENT_GUIDE.md - Deployment instructions
- QUICK_REFERENCE.md - Quick start and common commands
- IMPLEMENTATION_SUMMARY.md - Complete overview
- PROJECT_COMPLETION_REPORT.md - Detailed completion report

---

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

---

## Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'feat: add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Authors

- Abraham Maiko Kingoo - Initial work - GitHub

---

## Acknowledgments

- Spring Boot and Spring Cloud teams
- Angular team
- Apache Kafka community
- MongoDB team
- Netflix OSS (Eureka)

---

## Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Cloud Gateway: https://spring.io/projects/spring-cloud-gateway
- Angular Documentation: https://angular.io/docs
- MongoDB Manual: https://docs.mongodb.com/
- Apache Kafka Documentation: https://kafka.apache.org/documentation/
- JWT.io: https://jwt.io/
- Microservices Patterns: https://microservices.io/patterns/

---

Built with Spring Boot and Angular
