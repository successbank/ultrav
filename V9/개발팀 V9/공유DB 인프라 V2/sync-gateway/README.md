# Sync Gateway
- WebSocket 서버 (Hono + ws)
- 디바이스 인증 → oplog push → fan-out
- 백프레셔: 큐 1000 초과 시 batch + zstd 압축
