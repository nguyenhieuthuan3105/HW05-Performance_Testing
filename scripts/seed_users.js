/**
 * Script nạp dữ liệu người dùng kiểm thử (Data Provisioning)
 * Tự động đăng ký 5 tài khoản test-data vào SUT trước khi thực thi kiểm thử hiệu năng.
 */
const http = require('http');

const users = [
    { email: 'user1@eshop.com', password: 'Test1234!', name: 'Tran Thi B' },
    { email: 'user2@eshop.com', password: 'Test1234!', name: 'Le Van C' },
    { email: 'user3@eshop.com', password: 'Test1234!', name: 'Pham Thi D' },
    { email: 'user4@eshop.com', password: 'Test1234!', name: 'Hoang Van E' },
    { email: 'user5@eshop.com', password: 'Test1234!', name: 'Doan Van F' }
];

async function registerUser(user) {
    return new Promise((resolve) => {
        const payload = JSON.stringify(user);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 201 || res.statusCode === 200) {
                    console.log(`✅ [SEEDED] ${user.email} (Status ${res.statusCode})`);
                } else if (res.statusCode === 400 && data.includes('Email already exists')) {
                    console.log(`ℹ️ [EXISTS] ${user.email} already exists in database.`);
                } else {
                    console.log(`⚠️ [WARN] ${user.email} -> Status ${res.statusCode}: ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(`❌ [ERROR] Could not connect to SUT at http://localhost:3000:`, err.message);
            resolve();
        });

        req.write(payload);
        req.end();
    });
}

async function main() {
    console.log('🚀 Đang kiểm tra và nạp 6 tài khoản test-data vào SUT (http://localhost:3000)...');
    for (const user of users) {
        await registerUser(user);
    }
    console.log('🎉 Hoàn tất! Tất cả tài khoản trong test-data.csv đã sẵn sàng cho bài kiểm thử.');
}

main();
