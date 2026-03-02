# Buy-01 E-Commerce System Architecture

## Microservices Architecture with Centralized Authentication

```mermaid
graph TB
    subgraph CLIENT["CLIENT LAYER"]
        A["Angular SPA<br/>Route Guards<br/>HTTP Interceptor<br/>Reactive Forms"]
    end
    
    subgraph EDGE["EDGE LAYER"]
        B["API Gateway<br/>JWT Validation<br/>CORS Enforcement<br/>Rate Limiting<br/>Auth Propagation"]
        SD["Service Discovery<br/>Netflix Eureka"]
        JWT["JWT Provider<br/>Token Verification"]
    end
    
    subgraph SERVICE["SERVICE LAYER"]
        C["User Service<br/>Registration<br/>Login<br/>Profile<br/>Trusts Gateway"]
        D["Product Service<br/>CRUD Products<br/>Ownership Check<br/>sellerId validation"]
        E["Media Service<br/>Image Upload<br/>MIME Validation<br/>Ownership Check"]
    end
    
    subgraph EVENT["EVENT LAYER"]
        J["Kafka Event Bus<br/>PRODUCT_CREATED<br/>IMAGE_UPLOADED<br/>USER_REGISTERED"]
    end
    
    subgraph DATA["DATA LAYER"]
        F[("MongoDB<br/>users-db")]
        G[("MongoDB<br/>products-db")]
        H[("MongoDB<br/>media-db")]
        I["Object Storage<br/>Images/Files"]
        K[("Redis Cache<br/>Shared")]
    end
    
    A -->|HTTPS + JWT| B
    B -->|Validates| JWT
    B -->|Discovers Services| SD
    
    SD -->|Routes to| C
    SD -->|Routes to| D
    SD -->|Routes to| E
    
    C -->|Registers| SD
    D -->|Registers| SD
    E -->|Registers| SD
    
    C --> F
    D --> G
    E --> H
    E --> I
    
    C --> K
    D --> K
    E --> K
    
    C -->|Events| J
    D -->|Events| J
    E -->|Events| J
```

## Authentication Flow

1. **User Login** → User Service
2. **JWT Returned** → Angular stores token
3. **Request with Token** → API Gateway
4. **Gateway Validates JWT** → Extracts userId & role
5. **Headers Forwarded** → X-User-Id, X-Role to services
6. **Services Enforce Ownership** → sellerId == X-User-Id

**JWT Contains:**
- `sub` (userId)
- `role` (SELLER/CLIENT)
- `exp` (expiration)

## Architecture Characteristics

 **Centralized Authentication** - JWT validation at Gateway only  
 **Decoupled Services** - No direct service-to-service calls  
 **Independent Databases** - Zero shared database  
 **Shared Redis Cache** - Product catalog, sessions, rate limiting  
 **Gateway as Single Entry Point** - Client never talks to services directly  
 **Event-Driven Capability** - Kafka for async communication  
 **Stateless Services** - Horizontal scaling ready  
 **Production-Ready Layering** - Clear separation of concerns
