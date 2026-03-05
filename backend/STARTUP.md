# Buy-01 Microservices Startup Guide

## Prerequisites
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- Node.js 18+ (for frontend)

## Quick Start

### 1. Start Infrastructure (MongoDB, Kafka, Zookeeper)
```bash
docker-compose up -d
```

### 2. Start Services in Order

#### Terminal 1: Discovery Service (Eureka)
```bash
cd discovery-service
mvn spring-boot:run
```
Wait for: `Started DiscoveryServiceApplication` (http://localhost:8761)

#### Terminal 2: Gateway
```bash
cd gateway
mvn spring-boot:run
```
Wait for: `Started GatewayApplication` (http://localhost:8080)

#### Terminal 3: User Service
```bash
cd user-service
mvn spring-boot:run
```
Wait for: `Started UserServiceApplication` (http://localhost:8081)

#### Terminal 4: Product Service
```bash
cd product-service
mvn spring-boot:run
```
Wait for: `Started ProductServiceApplication` (http://localhost:8082)

#### Terminal 5: Media Service
```bash
cd media-service
mvn spring-boot:run
```
Wait for: `Started MediaServiceApplication` (http://localhost:8083)

### 3. Verify Services
- Eureka Dashboard: http://localhost:8761
- All services should appear registered within 30 seconds

### 4. Test Gateway
```bash
curl http://localhost:8080/actuator/health
```

## Service Ports
- **Discovery Service**: 8761
- **Gateway**: 8080
- **User Service**: 8081
- **Product Service**: 8082
- **Media Service**: 8083
- **MongoDB**: 27017
- **Kafka**: 9092

## Stop Services
```bash
# Stop infrastructure
docker-compose down

# Stop Spring Boot services: Ctrl+C in each terminal
```

## Build All Services
```bash
# From project root
for service in discovery-service gateway user-service product-service media-service; do
  cd $service && mvn clean install && cd ..
done
```

## Environment Variables
Create `.env` file in project root:
```bash
JWT_SECRET=your-256-bit-secret-key-change-in-production
SPRING_DATA_MONGODB_URI=mongodb://localhost:27017
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
```
