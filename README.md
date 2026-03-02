# Buy-01 E-Commerce Platform

A production-ready, microservices-based e-commerce marketplace built with **Spring Boot** and **Angular**. Users can register as clients or sellers, with sellers managing products and media while clients browse the catalog.

##  Project Overview

Buy-01 is a full-stack e-commerce platform demonstrating modern cloud-native architecture patterns:

- **Microservices Architecture**: Independently deployable services (User, Product, Media)
- **API Gateway Pattern**: Centralized routing, authentication, and cross-cutting concerns
- **Service Discovery**: Netflix Eureka for dynamic service registration
- **Event-Driven Communication**: Apache Kafka for asynchronous messaging
- **JWT Authentication**: Secure, stateless authentication with role-based access control
- **Angular SPA**: Responsive UI with guards, interceptors, and reactive forms

### Key Features

 **User Management**: Registration, authentication, and profile management  
 **Role-Based Access**: CLIENT (browse) vs SELLER (manage catalog)  
 **Product Catalog**: Full CRUD operations with ownership enforcement  
 **Media Management**: Secure image uploads with validation (2MB limit, image/* only)  
 **Responsive UI**: Angular Material/Bootstrap with mobile-first design  
 **Security**: HTTPS, BCrypt password hashing, CORS, input validation  
 **Observability**: Health checks, actuator endpoints, event logging

---

##  Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Angular SPA (Port 4200)                 │
│  Route Guards • HTTP Interceptors • Reactive Forms           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + JWT
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              API Gateway (Port 8080)                         │
│  JWT Validation • CORS • Rate Limiting • Routing             │
└─────┬──────────────────┬──────────────────┬─────────────────┘
      │                  │                  │
      ▼                  ▼                  ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │      │ Product  │      │  Media   │
│ Service  │      │ Service  │      │ Service  │
│ (8081)   │      │ (8082)   │      │ (8083)   │
└────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │
     ▼                 ▼                  ▼
┌─────────┐      ┌─────────┐      ┌─────────┐
│MongoDB  │      │MongoDB  │      │MongoDB  │
│users-db │      │products │      │media-db │
└─────────┘      └─────────┘      └────┬────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ Object   │
                                  │ Storage  │
                                  └──────────┘
```

### Service Discovery

All services register with **Eureka Server** (Port 8761) for dynamic service resolution.

### Event Bus

**Apache Kafka** handles asynchronous events:
- `PRODUCT_CREATED` - Product catalog updates
- `IMAGE_UPLOADED` - Media processing triggers
- `USER_REGISTERED` - Welcome emails, analytics

---

##  Technology Stack

### Backend
- **Java 17+** with Spring Boot 3.x
- **Spring Cloud Gateway** - API routing and filtering
- **Spring Security** - JWT authentication
- **Spring Data MongoDB** - Data persistence
- **Apache Kafka** - Event streaming
- **Netflix Eureka** - Service discovery
- **BCrypt** - Password hashing
- **Maven** - Dependency management

### Frontend
- **Angular 16+** with TypeScript
- **Angular Material** / **Bootstrap 5** - UI components
- **RxJS** - Reactive programming
- **Angular Router** - Navigation and guards
- **HttpClient** - API communication

### Infrastructure
- **MongoDB 6.0+** - NoSQL database
- **Apache Kafka 3.x** - Message broker
- **Docker & Docker Compose** - Containerization
- **Nginx** (optional) - Reverse proxy

---

##  Prerequisites

- **Java 17+** ([Download](https://adoptium.net/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **MongoDB 6.0+** ([Download](https://www.mongodb.com/try/download/community))
- **Apache Kafka 3.x** ([Download](https://kafka.apache.org/downloads))
- **Docker & Docker Compose** (optional, recommended) ([Download](https://www.docker.com/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))

---

##  Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/buy-01.git
cd buy-01

# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f
```

**Access Points:**
- Angular UI: http://localhost:4200
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

### Option 2: Manual Setup

#### 1. Start Infrastructure

```bash
# Start MongoDB
mongod --dbpath /path/to/data --port 27017

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka
bin/kafka-server-start.sh config/server.properties
```

#### 2. Start Backend Services

```bash
# Terminal 1: Eureka Server
cd eureka-server
mvn spring-boot:run

# Terminal 2: API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 3: User Service
cd user-service
mvn spring-boot:run

# Terminal 4: Product Service
cd product-service
mvn spring-boot:run

# Terminal 5: Media Service
cd media-service
mvn spring-boot:run
```

#### 3. Start Frontend

```bash
cd angular-frontend
npm install
ng serve
```

Navigate to http://localhost:4200

---

##  Project Structure

```
buy-01/
├── eureka-server/              # Service discovery
│   ├── src/
│   └── pom.xml
├── api-gateway/                # Edge service
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
├── user-service/               # Authentication & profiles
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   ├── repository/
│   │       │   ├── model/
│   │       │   ├── dto/
│   │       │   ├── security/
│   │       │   └── config/
│   │       └── resources/
│   └── pom.xml
├── product-service/            # Product catalog
│   ├── src/
│   └── pom.xml
├── media-service/              # Image management
│   ├── src/
│   └── pom.xml
├── angular-frontend/           # SPA client
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   ├── seller/
│   │   │   ├── products/
│   │   │   ├── media/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── services/
│   │   │   └── models/
│   │   ├── assets/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
├── docker-compose.yml          # Container orchestration
├── architecture.md             # Architecture diagrams
└── README.md                   # This file
```

---

##  Authentication & Authorization

### JWT Flow

1. **Registration/Login** → User Service issues JWT
2. **Token Storage** → Angular stores in localStorage/sessionStorage
3. **API Requests** → Interceptor attaches `Authorization: Bearer <token>`
4. **Gateway Validation** → Verifies JWT signature and expiration
5. **Header Propagation** → Gateway adds `X-User-Id` and `X-Role` headers
6. **Service Authorization** → Services enforce ownership and role checks

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

- **CLIENT**: Browse products, view details
- **SELLER**: Manage own products and media
- **ADMIN** (optional): Moderation and system management

### Security Measures

 **Password Hashing**: BCrypt with salt (cost factor 12)  
 **HTTPS**: TLS 1.3 end-to-end encryption  
 **CORS**: Whitelist allowed origins at gateway  
 **Input Validation**: Bean Validation (JSR-380) on all DTOs  
 **File Validation**: MIME type sniffing, size limits (2MB)  
 **Ownership Enforcement**: sellerId verification on mutations  
 **Rate Limiting**: Token bucket at gateway (optional)

---

##  API Documentation

### User Service (Port 8081)

#### Authentication

**POST** `/auth/register`
```json
{
  "email": "seller@example.com",
  "password": "SecurePass123!",
  "role": "SELLER",
  "name": "John Doe"
}
```
Response: `201 Created` with JWT token

**POST** `/auth/login`
```json
{
  "email": "seller@example.com",
  "password": "SecurePass123!"
}
```
Response: `200 OK` with JWT token

#### Profile

**GET** `/me` (Authenticated)  
Response: User profile

**PUT** `/me` (Authenticated)
```json
{
  "name": "Jane Doe",
  "avatarUrl": "https://storage/avatar.jpg"
}
```
Response: `200 OK` with updated profile

---

### Product Service (Port 8082)

#### Public Endpoints

**GET** `/products`  
Query params: `?page=0&size=20&sort=createdAt,desc`  
Response: Paginated product list

**GET** `/products/{id}`  
Response: Product details with image URLs

#### Seller Endpoints (Authenticated)

**POST** `/products` (SELLER only)
```json
{
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 199.99,
  "category": "Electronics",
  "stock": 50,
  "imageUrls": ["https://storage/img1.jpg"]
}
```
Response: `201 Created`

**PUT** `/products/{id}` (SELLER, owner only)  
**DELETE** `/products/{id}` (SELLER, owner only)

---

### Media Service (Port 8083)

**POST** `/media/images` (SELLER only)  
Content-Type: `multipart/form-data`
```
file: [binary image data]
```
Constraints:
- MIME type: `image/*` (jpeg, png, gif, webp)
- Max size: 2 MB
- Filename sanitization

Response:
```json
{
  "id": "img123",
  "url": "https://storage/img123.jpg",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

**GET** `/media/images/{id}`  
Response: Image binary with caching headers

**DELETE** `/media/images/{id}` (SELLER, owner only)  
Response: `204 No Content`

---

### API Gateway Routes (Port 8080)

All external traffic goes through the gateway:

```
/api/auth/**      → user-service
/api/users/**     → user-service
/api/products/**  → product-service
/api/media/**     → media-service
```

---

##  Frontend Features

### Pages

1. **Landing Page** - Product showcase, search
2. **Sign In / Sign Up** - Role selection (CLIENT/SELLER)
3. **Product Listing** - Grid view with filters
4. **Product Details** - Images, description, price
5. **Seller Dashboard** - Product management
6. **Media Manager** - Upload/delete images
7. **Profile** - User settings, avatar upload

### Angular Architecture

#### Guards

- **AuthGuard**: Redirects unauthenticated users to login
- **RoleGuard**: Restricts routes by role (SELLER-only pages)

#### Interceptors

- **AuthInterceptor**: Attaches JWT to outgoing requests
- **ErrorInterceptor**: Handles 401/403, shows user-friendly messages

#### Services

- **AuthService**: Login, register, token management
- **ProductService**: Product CRUD operations
- **MediaService**: Image upload/download
- **UserService**: Profile management

#### Forms

- **Reactive Forms** with validators
- Real-time validation feedback
- File upload with preview
- Size/type validation before API call

---

##  Database Design

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

##  Docker Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092

  eureka-server:
    build: ./eureka-server
    ports:
      - "8761:8761"

  api-gateway:
    build: ./api-gateway
    depends_on:
      - eureka-server
    ports:
      - "8080:8080"
    environment:
      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka

  user-service:
    build: ./user-service
    depends_on:
      - mongodb
      - kafka
      - eureka-server
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/users-db
      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092

  product-service:
    build: ./product-service
    depends_on:
      - mongodb
      - kafka
      - eureka-server
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/products-db

  media-service:
    build: ./media-service
    depends_on:
      - mongodb
      - kafka
      - eureka-server
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/media-db

  angular-frontend:
    build: ./angular-frontend
    ports:
      - "4200:80"
    depends_on:
      - api-gateway

volumes:
  mongo-data:
```

### Build & Deploy

```bash
# Build all images
docker-compose build

# Start services
docker-compose up -d

# Scale services
docker-compose up -d --scale product-service=3

# Stop services
docker-compose down

# Clean volumes
docker-compose down -v
```

---

##  Testing

### Backend Tests

```bash
# Unit tests
mvn test

# Integration tests
mvn verify

# Test coverage
mvn jacoco:report
```

### Frontend Tests

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Coverage
ng test --code-coverage
```

---

##  Monitoring & Observability

### Health Checks

All services expose Spring Boot Actuator endpoints:

```
GET /actuator/health
GET /actuator/info
GET /actuator/metrics
```

### Logging

Structured JSON logging with correlation IDs for request tracing.

### Metrics (Optional)

- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Zipkin/Jaeger** for distributed tracing

---

##  Configuration

### Environment Variables

#### User Service
```bash
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/users-db
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=86400000
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

#### Product Service
```bash
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/products-db
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```

#### Media Service
```bash
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017/media-db
MEDIA_UPLOAD_DIR=/var/media/uploads
MEDIA_MAX_FILE_SIZE=2097152
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp
```

#### API Gateway
```bash
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

---

##  Error Handling

### HTTP Status Codes

- **200 OK** - Successful GET/PUT
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Invalid input, file too large, wrong MIME type
- **401 Unauthorized** - Missing or invalid JWT
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist or not owned
- **409 Conflict** - Duplicate email, constraint violation
- **500 Internal Server Error** - Unhandled exceptions (should be rare)

### Global Exception Handler

All services implement `@ControllerAdvice` to return consistent error responses:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "File size exceeds 2MB limit",
  "path": "/api/media/images"
}
```

---

##  Learning Objectives Achieved

 **Microservices Design** - Clean service boundaries with single responsibilities  
 **Asynchronous Communication** - Kafka events for decoupled services  
 **Security** - JWT authentication, BCrypt hashing, CORS, input validation  
 **File Upload Security** - MIME validation, size limits, ownership checks  
 **Polyglot Persistence** - MongoDB with separate databases per service  
 **Angular SPA** - Guards, interceptors, reactive forms, Material UI  
 **Service Discovery** - Eureka for dynamic service registration  
 **API Gateway Pattern** - Centralized routing and cross-cutting concerns

---

##  Development Guidelines

### Code Style

- **Java**: Google Java Style Guide
- **TypeScript**: Angular style guide
- **Formatting**: Prettier (frontend), Spotless (backend)

### Git Workflow

```bash
# Feature branch
git checkout -b feature/product-search

# Commit with conventional commits
git commit -m "feat(product): add search by category"

# Push and create PR
git push origin feature/product-search
```

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/config changes

---

##  Troubleshooting

### Services won't start

```bash
# Check if ports are in use
lsof -i :8080
lsof -i :8761

# Check Eureka registration
curl http://localhost:8761/eureka/apps
```

### MongoDB connection issues

```bash
# Verify MongoDB is running
mongosh --eval "db.adminCommand('ping')"

# Check connection string
echo $SPRING_DATA_MONGODB_URI
```

### Kafka issues

```bash
# List topics
kafka-topics.sh --list --bootstrap-server localhost:9092

# Check consumer groups
kafka-consumer-groups.sh --list --bootstrap-server localhost:9092
```

### Angular build errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

---

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

##  Authors

- **Your Name** - *Initial work* - [GitHub](https://github.com/yourusername)

---

##  Acknowledgments

- Spring Boot and Spring Cloud teams
- Angular team
- Apache Kafka community
- MongoDB team
- Netflix OSS (Eureka)

---

##  Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Gateway](https://spring.io/projects/spring-cloud-gateway)
- [Angular Documentation](https://angular.io/docs)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [JWT.io](https://jwt.io/)
- [Microservices Patterns](https://microservices.io/patterns/)

---

##  Support

For questions or issues:
- Open an issue on GitHub
- Email: support@buy-01.com
- Documentation: https://docs.buy-01.com

---

**Built with  using Spring Boot and Angular**
