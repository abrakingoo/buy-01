# Buy-01 Microservices - Project Structure

##  Successfully Created Services

###  Final Structure
```
buy-01/
├── discovery-service/           Eureka Server (Port 8761)
│   ├── src/main/
│   │   ├── java/com/buy01/discovery/
│   │   │   └── DiscoveryServiceApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── gateway/                     API Gateway (Port 8080)
│   ├── src/main/
│   │   ├── java/com/buy01/gateway/
│   │   │   └── GatewayApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── user-service/                User Service (Port 8081)
│   ├── src/main/
│   │   ├── java/com/buy01/user/
│   │   │   └── UserServiceApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── product-service/             Product Service (Port 8082)
│   ├── src/main/
│   │   ├── java/com/buy01/product/
│   │   │   └── ProductServiceApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── media-service/               Media Service (Port 8083)
│   ├── src/main/
│   │   ├── java/com/buy01/media/
│   │   │   └── MediaServiceApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── docker-compose.yml           Infrastructure (MongoDB, Kafka, Zookeeper)
├── STARTUP.md                   Startup instructions
├── architecture.md              Architecture diagrams
└── README.md                    Project documentation
```

##  Service Configurations

### 1. Discovery Service (Eureka Server)
- **Port**: 8761
- **Dependencies**: Spring Web, Eureka Server
- **Purpose**: Service registry and discovery
- **URL**: http://localhost:8761

### 2. Gateway
- **Port**: 8080
- **Dependencies**: Spring WebFlux, Gateway, Eureka Client, Security, JWT
- **Purpose**: API routing, JWT validation, CORS
- **Routes**:
  - `/api/auth/**` → user-service
  - `/api/users/**` → user-service
  - `/api/products/**` → product-service
  - `/api/media/**` → media-service

### 3. User Service
- **Port**: 8081
- **Dependencies**: Spring Web, Security, MongoDB, Eureka Client, Validation, Lombok, JWT
- **Database**: users-db
- **Purpose**: Authentication, registration, user profiles

### 4. Product Service
- **Port**: 8082
- **Dependencies**: Spring Web, MongoDB, Eureka Client, Validation, Lombok
- **Database**: products-db
- **Purpose**: Product catalog CRUD operations

### 5. Media Service
- **Port**: 8083
- **Dependencies**: Spring Web, MongoDB, Eureka Client, Validation, Lombok
- **Database**: media-db
- **Purpose**: Image upload/download with 2MB limit

##  Quick Start Commands

### Start Infrastructure
```bash
docker-compose up -d
```

### Start Services (in order)
```bash
# Terminal 1
cd discovery-service && mvn spring-boot:run

# Terminal 2 (wait 30s)
cd gateway && mvn spring-boot:run

# Terminal 3
cd user-service && mvn spring-boot:run

# Terminal 4
cd product-service && mvn spring-boot:run

# Terminal 5
cd media-service && mvn spring-boot:run
```

##  Services

1. **User Service**:
   - User model, repository, service
   - JWT utility class
   - Auth controller (register, login)
   - Security configuration

2. **Product Service**:
   - Product model, repository, service
   - Product controller with ownership checks
   - Header extraction for sellerId

3. **Media Service**:
   - Media model, repository, service
   - File upload controller with validation
   - Storage service (filesystem/S3)

4. **Gateway Security**:
   - JWT filter for validation
   - Header propagation (X-User-Id, X-Role)
   - Security configuration

5. **Integration**:
   - Event publishers in services
   - Event listeners for async processing

6. **Angular Frontend**:
   - Auth module with guards
   - Product listing and management
   - Media upload component

##  Key Features Implemented

 Microservices architecture with 5 services
 Service discovery with Eureka
 API Gateway with routing configuration
 MongoDB configuration per service
 JWT dependencies for authentication
 Validation and Lombok support
 Docker Compose for infrastructure
 Proper Maven project structure
 Spring Cloud 2023.0.0 (latest stable)
 Spring Boot 3.2.1
 Java 21 compatibility

##  Configuration Highlights

- **CORS**: Configured for http://localhost:4200
- **JWT Secret**: Configurable via environment variable
- **MongoDB**: Separate databases per service
- **File Upload**: 2MB limit, image/* MIME types only
- **Service Discovery**: All services register with Eureka
- **Load Balancing**: Gateway uses `lb://` for service routing
