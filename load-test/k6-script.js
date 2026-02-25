import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// ===== Custom Metrics =====
const successRate = new Rate('success_rate');
const productGetTrend = new Trend('product_get_duration');
const orderPostTrend = new Trend('order_post_duration');
const errorCounter = new Counter('errors');

// ===== Load Test Options =====
export const options = {
  stages: [
    { duration: '30s', target: 50 },    // Ramp up to 50 VUs
    { duration: '1m',  target: 200 },   // Ramp up to 200 VUs
    { duration: '2m',  target: 500 },   // Spike to 500 VUs (triggers HPA)
    { duration: '1m',  target: 200 },   // Scale back to 200
    { duration: '30s', target: 0 },     // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95th percentile under 500ms
    http_req_failed: ['rate<0.05'],     // Error rate under 5%
    success_rate: ['rate>0.95'],        // Success rate above 95%
  },
};

// ===== Configuration =====
const BASE_URL = __ENV.GATEWAY_URL || 'http://localhost:8080';
const AUTH_URL = `${BASE_URL}/auth/token`;

// ===== Get JWT Token =====
function getAuthToken() {
  const loginRes = http.post(
    AUTH_URL,
    JSON.stringify({ username: 'testuser', password: 'test123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  if (loginRes.status === 200) {
    return JSON.parse(loginRes.body).token;
  }
  return null;
}

// ===== Test Setup =====
export function setup() {
  // Create test products
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const products = [
    { name: 'Laptop Pro', description: 'High-performance laptop', price: 1299.99, stockQuantity: 500 },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, stockQuantity: 1000 },
    { name: 'USB-C Hub', description: '7-in-1 USB-C Hub', price: 49.99, stockQuantity: 750 },
    { name: 'Gaming Headset', description: 'Pro gaming headset', price: 79.99, stockQuantity: 300 },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', price: 149.99, stockQuantity: 200 },
  ];

  let productIds = [];
  products.forEach(product => {
    const res = http.post(`${BASE_URL}/products`, JSON.stringify(product), { headers });
    if (res.status === 201) {
      productIds.push(JSON.parse(res.body).id);
    }
  });

  return { token, productIds };
}

// ===== Main Test Scenario =====
export default function (data) {
  const { token, productIds } = data;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 80% GET /products, 20% POST /orders
  const rand = Math.random();

  if (rand < 0.60) {
    // GET all products (cache-heavy, tests Redis performance)
    group('GET /products (all)', () => {
      const res = http.get(`${BASE_URL}/products`);
      const success = check(res, {
        'status is 200': (r) => r.status === 200,
        'response has products': (r) => JSON.parse(r.body).length > 0,
        'response time < 300ms': (r) => r.timings.duration < 300,
      });
      successRate.add(success);
      productGetTrend.add(res.timings.duration);
      if (!success) errorCounter.add(1);
    });

  } else if (rand < 0.80) {
    // GET single product by ID
    group('GET /products/:id', () => {
      const productId = productIds[Math.floor(Math.random() * productIds.length)] || 1;
      const res = http.get(`${BASE_URL}/products/${productId}`);
      const success = check(res, {
        'status is 200': (r) => r.status === 200,
        'has product id': (r) => JSON.parse(r.body).id !== undefined,
      });
      successRate.add(success);
      productGetTrend.add(res.timings.duration);
    });

  } else {
    // POST /orders (requires auth, tests DB writes)
    group('POST /orders', () => {
      const productId = productIds[Math.floor(Math.random() * productIds.length)] || 1;
      const payload = JSON.stringify({
        productId: productId,
        quantity: Math.floor(Math.random() * 3) + 1,
        customerName: `LoadTest_VU_${__VU}`,
      });
      const res = http.post(`${BASE_URL}/orders`, payload, { headers: authHeaders });
      const success = check(res, {
        'status is 201': (r) => r.status === 201,
        'order has id': (r) => {
          try { return JSON.parse(r.body).id !== undefined; } catch { return false; }
        },
      });
      successRate.add(success);
      orderPostTrend.add(res.timings.duration);
      if (!success) errorCounter.add(1);
    });
  }

  sleep(0.5 + Math.random() * 0.5); // 0.5-1s think time
}

// ===== Teardown Summary =====
export function teardown(data) {
  console.log('Load test completed. Check HPA scaling behavior in your cluster:');
  console.log('  kubectl get hpa -n ecommerce');
  console.log('  kubectl get pods -n ecommerce');
}
