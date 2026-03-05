# Buy-01 Deployment & Operations Guide

## Local Development Setup

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+
- Git

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/buy-01.git
   cd buy-01
   ```

2. **Start Infrastructure**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Start Backend Services**
   ```bash
   # Terminal 1: User Service
   cd backend/user-service
   mvn spring-boot:run

   # Terminal 2: Product Service
   cd backend/product-service
   mvn spring-boot:run

   # Terminal 3: Media Service
   cd backend/media-service
   mvn spring-boot:run

   # Terminal 4: Gateway
   cd backend/gateway
   mvn spring-boot:run
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm install
   ng serve
   ```

5. **Access Application**
   - Frontend: http://localhost:4200
   - API Gateway: http://localhost:8080
   - Eureka Dashboard: http://localhost:8761

## Docker Deployment

### Build Images

```bash
cd backend

# Build all services
docker-compose build

# Build specific service
docker-compose build user-service
docker-compose build product-service
docker-compose build media-service
docker-compose build gateway
```

### Run Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Scale Services

```bash
# Scale product service to 3 instances
docker-compose up -d --scale product-service=3

# Scale media service to 2 instances
docker-compose up -d --scale media-service=2
```

## Environment Configuration

### User Service (.env)
```bash
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/users-db
JWT_SECRET=your-256-bit-secret-key-change-in-production
JWT_EXPIRATION=86400000
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

### Product Service (.env)
```bash
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/products-db
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

### Media Service (.env)
```bash
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/media-db
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
MINIO_URL=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=product-images
```

### Gateway (.env)
```bash
JWT_SECRET=your-256-bit-secret-key-change-in-production
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
REDIS_HOST=redis
REDIS_PORT=6379
```

## Production Deployment

### AWS ECS Deployment

1. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name buy01-user-service
   aws ecr create-repository --repository-name buy01-product-service
   aws ecr create-repository --repository-name buy01-media-service
   aws ecr create-repository --repository-name buy01-gateway
   ```

2. **Build and Push Images**
   ```bash
   # User Service
   docker build -t buy01-user-service:latest backend/user-service
   docker tag buy01-user-service:latest \
     123456789.dkr.ecr.us-east-1.amazonaws.com/buy01-user-service:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/buy01-user-service:latest
   ```

3. **Create ECS Task Definitions**
   - Configure CPU/Memory allocation
   - Set environment variables
   - Configure logging to CloudWatch

4. **Create ECS Services**
   - Set desired task count
   - Configure load balancer
   - Set auto-scaling policies

### Kubernetes Deployment

1. **Create Deployments**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: user-service
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: user-service
     template:
       metadata:
         labels:
           app: user-service
       spec:
         containers:
         - name: user-service
           image: buy01-user-service:latest
           ports:
           - containerPort: 8081
           env:
           - name: SPRING_DATA_MONGODB_URI
             valueFrom:
               secretKeyRef:
                 name: db-credentials
                 key: mongodb-uri
   ```

2. **Create Services**
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: user-service
   spec:
     selector:
       app: user-service
     ports:
     - protocol: TCP
       port: 8081
       targetPort: 8081
     type: ClusterIP
   ```

3. **Deploy**
   ```bash
   kubectl apply -f deployments/
   kubectl get pods
   kubectl logs -f deployment/user-service
   ```

## Monitoring & Observability

### Health Checks

```bash
# Check all services
for service in 8081 8082 8083 8080; do
  echo "Service on port $service:"
  curl -s http://localhost:$service/actuator/health | jq .
done
```

### Metrics Collection

```bash
# Prometheus scrape config
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    static_configs:
      - targets: ['localhost:8081']
    metrics_path: '/actuator/prometheus'

  - job_name: 'product-service'
    static_configs:
      - targets: ['localhost:8082']
    metrics_path: '/actuator/prometheus'

  - job_name: 'media-service'
    static_configs:
      - targets: ['localhost:8083']
    metrics_path: '/actuator/prometheus'

  - job_name: 'gateway'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/actuator/prometheus'
```

### Logging

All services log to stdout. Configure log aggregation:

```bash
# View logs
docker-compose logs -f user-service
docker-compose logs -f product-service
docker-compose logs -f media-service
docker-compose logs -f gateway
```

### Distributed Tracing (Optional)

Add Zipkin for distributed tracing:

```yaml
zipkin:
  image: openzipkin/zipkin:latest
  ports:
    - "9411:9411"
```

## Backup & Recovery

### MongoDB Backup

```bash
# Backup
docker exec buy01-mongodb mongodump --out /backup

# Restore
docker exec buy01-mongodb mongorestore /backup
```

### Database Snapshots

```bash
# Create snapshot
docker exec buy01-mongodb mongosh --eval "db.fsyncLock()"

# Release lock
docker exec buy01-mongodb mongosh --eval "db.fsyncUnlock()"
```

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS/TLS on all endpoints
- [ ] Configure CORS for production domain
- [ ] Enable authentication on MongoDB
- [ ] Enable authentication on Redis
- [ ] Use environment variables for secrets
- [ ] Implement API key rotation
- [ ] Enable audit logging
- [ ] Configure firewall rules
- [ ] Use VPC for database access
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit

## Troubleshooting

### Service won't start

```bash
# Check logs
docker-compose logs user-service

# Check port availability
lsof -i :8081

# Check MongoDB connection
docker exec buy01-mongodb mongosh --eval "db.adminCommand('ping')"
```

### High memory usage

```bash
# Check container stats
docker stats

# Increase JVM heap
export JAVA_OPTS="-Xmx1024m -Xms512m"
```

### Slow queries

```bash
# Enable query logging
docker exec buy01-mongodb mongosh --eval "db.setProfilingLevel(1)"

# View slow queries
docker exec buy01-mongodb mongosh --eval "db.system.profile.find().limit(5).sort({ts:-1}).pretty()"
```

## Maintenance

### Regular Tasks

- [ ] Monitor disk space
- [ ] Review logs for errors
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Test backup/restore procedures
- [ ] Review security patches
- [ ] Analyze performance metrics
- [ ] Clean up old data

### Upgrade Procedure

1. **Backup data**
   ```bash
   docker exec buy01-mongodb mongodump --out /backup
   ```

2. **Stop services**
   ```bash
   docker-compose down
   ```

3. **Update code**
   ```bash
   git pull origin main
   ```

4. **Rebuild images**
   ```bash
   docker-compose build
   ```

5. **Start services**
   ```bash
   docker-compose up -d
   ```

6. **Verify health**
   ```bash
   curl http://localhost:8080/actuator/health
   ```
