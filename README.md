# 🛒 Cloud-Native Auto-Scaling E-Commerce Backend

A production-style microservices backend with **auto-scaling**, **Redis caching**, and **Kubernetes orchestration** — built entirely with free, open-source tools.

---

## 🏗 Architecture

```
Client (Postman/K6)
        │
        ▼
┌──────────────────┐
│   API Gateway    │  :8080 / NodePort 30080
│  (JWT Issue/Val) │
└────────┬─────────┘
         │         │               │
         ▼         ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Product Service│  │ Order Service│  │ User Service │
│   :8081      │  │   :8082      │  │   :8083      │
│ Redis Cache  │  │ → calls      │  │ PostgreSQL   │
│ PostgreSQL   │  │   Product    │  │ (Auth data)  │
└──────────────┘  └──────────────┘  └──────────────┘
         │                │                │
         ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │  │  Monitoring  │
│  :5432       │  │   :6379      │  │  (Actuator)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## 📁 Project Structure

```
ecommerce-cloud-native/
├── api-gateway/            # Spring Cloud Gateway + JWT
│   ├── src/main/java/...
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── product-service/        # Product CRUD + Redis caching
│   ├── src/main/java/...
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── order-service/          # Order management
│   ├── src/main/java/...
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── gateway/            # Deployment, NodePort, HPA
│   ├── product/            # Deployment, ClusterIP, HPA
│   ├── order/              # Deployment, ClusterIP, HPA
│   ├── postgres/           # Deployment, ClusterIP, PVC
│   └── redis/              # Deployment, ClusterIP
├── load-test/
│   └── k6-script.js        # K6 load test (500 VUs)
├── docker-compose.yml      # Local development
└── init-db.sql             # PostgreSQL init script
```

---

## 🚀 Quick Start — Local Development (Docker Compose)

### Prerequisites
- Docker Desktop
- Java 17
- Maven 3.9+

### 1. Start Infrastructure + All Services

```bash
# Start PostgreSQL and Redis only (for local Maven run)
docker-compose up postgres redis -d

# OR start everything (requires Docker images to be built)
docker-compose up --build -d
```

### 2. Run Services Locally (without Docker)

```bash
# Terminal 1 — Product Service
cd product-service
mvn spring-boot:run

# Terminal 2 — Order Service
cd order-service
mvn spring-boot:run

# Terminal 3 — API Gateway
cd api-gateway
mvn spring-boot:run
```

### 3. Get a JWT Token

```bash
curl -X POST http://localhost:8080/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### 4. Test the APIs

```bash
# Create a product
curl -X POST http://localhost:8081/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"Gaming Laptop","price":999.99,"stockQuantity":100}'

# Get all products (try twice - 2nd call is served from Redis cache)
curl http://localhost:8080/products

# Create an order (requires JWT)
TOKEN="<your-jwt-token>"
curl -X POST http://localhost:8080/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":2,"customerName":"John Doe"}'
```

### 5. Swagger UI
- Product Service: http://localhost:8081/swagger-ui.html
- Order Service: http://localhost:8082/swagger-ui.html

---

## ☸️ Kubernetes Deployment (Minikube)

### Prerequisites
- [Minikube](https://minikube.sigs.k8s.io/docs/start/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- Docker

### Step 1: Start Minikube

```bash
minikube start --memory=4096 --cpus=4
```

### Step 2: Enable Metrics Server (required for HPA)

```bash
minikube addons enable metrics-server
kubectl get deployment metrics-server -n kube-system  # Wait until Ready
```

### Step 3: Build Docker Images Inside Minikube

```bash
# Point Docker to Minikube's daemon
eval $(minikube docker-env)       # Linux/Mac
# OR on Windows PowerShell:
# minikube docker-env | Invoke-Expression

# Build all service images
docker build -t api-gateway:1.0.0 ./api-gateway
docker build -t product-service:1.0.0 ./product-service
docker build -t order-service:1.0.0 ./order-service
```

### Step 4: Deploy to Kubernetes

```bash
# Create namespace, secrets, and configmap first
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# Deploy infrastructure
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/redis/

# Wait for DB to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n ecommerce --timeout=120s

# Deploy microservices
kubectl apply -f k8s/gateway/
kubectl apply -f k8s/product/
kubectl apply -f k8s/order/
```

### Step 5: Verify Deployment

```bash
# Check all pods
kubectl get pods -n ecommerce

# Check services
kubectl get services -n ecommerce

# Check HPAs
kubectl get hpa -n ecommerce

# Get gateway URL
minikube service api-gateway -n ecommerce --url
```

---

## 📈 Load Testing & HPA Verification

### Install K6

```bash
# Windows (Chocolatey)
choco install k6

# Or download from https://k6.io/docs/get-started/installation/
```

### Run Load Test

```bash
# Against local Docker Compose
k6 run load-test/k6-script.js

# Against Kubernetes (get URL first)
MINIKUBE_URL=$(minikube service api-gateway -n ecommerce --url)
k6 run -e GATEWAY_URL=$MINIKUBE_URL load-test/k6-script.js
```

### Watch HPA Scaling in Real Time

```bash
# Terminal 1: Watch HPA
kubectl get hpa -n ecommerce -w

# Terminal 2: Watch pods
kubectl get pods -n ecommerce -w

# Terminal 3: Run load test
k6 run load-test/k6-script.js
```

**Expected behavior:**
- Pod count stays at 1 initially
- After CPU > 60%, new pods are created (up to 5)
- After load ends, pods scale back down after ~2 minutes

---

## 🔐 Authentication

| User | Password | Role |
|------|----------|------|
| admin | admin | ADMIN |
| user | user | USER |
| testuser | test123 | USER |

**Protected routes** (require JWT): `POST /products`, `PUT /products`, `DELETE /products`, all `/orders/**`

**Public routes**: `GET /products/**`, `GET /auth/**`

---

## 🧩 API Endpoints

### Via API Gateway (port 8080)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/token | ❌ | Get JWT token |
| GET | /products | ❌ | List all products |
| GET | /products/{id} | ❌ | Get product by ID |
| POST | /products | ✅ | Create product |
| PUT | /products/{id} | ✅ | Update product |
| DELETE | /products/{id} | ✅ | Delete product |
| POST | /orders | ✅ | Create order |
| GET | /orders | ✅ | List all orders |
| GET | /orders/{id} | ✅ | Get order by ID |

---

## ⚙️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.2 |
| Gateway | Spring Cloud Gateway |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Containerization | Docker |
| Orchestration | Kubernetes (Minikube) |
| Auto-Scaling | HPA + Metrics Server |
| Load Testing | K6 |
| API Docs | Swagger UI (SpringDoc) |

---

## 🎯 Key Engineering Features

✅ **Microservices Architecture** — 3 independent services  
✅ **Redis Caching** — `@Cacheable` + `@CacheEvict` with 10-min TTL  
✅ **Java Serialization** — Products implement `Serializable` for Redis  
✅ **Multi-Stage Docker Builds** — Minimal JRE 17 runtime images  
✅ **Kubernetes HPA** — Scales 1→5 pods at 60% CPU  
✅ **Health Probes** — Readiness/liveness on all services  
✅ **Resource Limits** — Prevents CPU/memory abuse  
✅ **Global Exception Handling** — Structured error responses  
✅ **JWT Security** — Token validation at gateway, user headers forwarded
