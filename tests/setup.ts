// Set required env vars before any module loads config
process.env.BIZNEO_API_TOKEN = 'test-token-123';
process.env.BIZNEO_API_BASE_URL = 'https://connect.bizneo.com/hcm';
process.env.BIZNEO_RATE_LIMIT_RPS = '100';
process.env.BIZNEO_RATE_LIMIT_CONCURRENT = '10';
