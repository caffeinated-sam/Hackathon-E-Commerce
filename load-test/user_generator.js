const http = require('http');

const count = 100;
let success = 0;
let failed = 0;

function registerUser(i) {
    const data = JSON.stringify({
        username: `testuser_${i}`,
        password: `password123`,
        email: `testuser_${i}@example.com`,
        role: "USER"
    });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    success++;
                } else {
                    console.log(`Failed user ${i}: Status ${res.statusCode} - ${body}`);
                    failed++;
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.error(`Error user ${i}: ${error.message}`);
            failed++;
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function run() {
    console.log(`Starting generation of ${count} users...`);
    // Running in small batches to avoid overloading the gateway immediately
    const batchSize = 10;
    for (let i = 1; i <= count; i += batchSize) {
        const batch = [];
        for (let j = i; j < i + batchSize && j <= count; j++) {
            batch.push(registerUser(j));
        }
        await Promise.all(batch);
        console.log(`Progress: ${Math.min(i + batchSize - 1, count)}/${count}`);
    }
    console.log(`\nFinished Generation.`);
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
}

run();
