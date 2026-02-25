@echo off
echo ========================================
echo  E-Commerce K8s Deployment Script
echo ========================================

echo.
echo [1/6] Starting Minikube...
minikube start --memory=4096 --cpus=4

echo.
echo [2/6] Enabling Metrics Server (required for HPA)...
minikube addons enable metrics-server

echo.
echo [3/6] Pointing Docker to Minikube daemon...
@FOR /F "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i

echo.
echo [4/6] Building Docker images...
docker build -t api-gateway:1.0.0 ./api-gateway
docker build -t product-service:1.0.0 ./product-service
docker build -t order-service:1.0.0 ./order-service

echo.
echo [5/6] Applying Kubernetes manifests...
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/redis/

echo Waiting for PostgreSQL to be ready...
kubectl wait --for=condition=ready pod -l app=postgres -n ecommerce --timeout=120s

kubectl apply -f k8s/gateway/
kubectl apply -f k8s/product/
kubectl apply -f k8s/order/

echo.
echo [6/6] Deployment complete!
echo.
echo Checking status:
kubectl get pods -n ecommerce
kubectl get hpa -n ecommerce
echo.
echo To access the API Gateway:
minikube service api-gateway -n ecommerce --url
