import { createClient } from 'redis'

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://:zWh4S1PkIo3WQlkV@redis:6379',
})

redisClient.on('error', (err) => console.error('Redis Client Error:', err))

// 연결 초기화
if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error)
}

export default redisClient

/**
 * Redis 세션 키 생성
 */
export function getCartSessionKey(sessionId: string): string {
  return `cart:session:${sessionId}`
}

/**
 * Redis에서 장바구니 데이터 가져오기
 */
export async function getCartFromRedis(sessionId: string) {
  try {
    const key = getCartSessionKey(sessionId)
    const data = await redisClient.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting cart from Redis:', error)
    return null
  }
}

/**
 * Redis에 장바구니 데이터 저장
 */
export async function saveCartToRedis(sessionId: string, cartData: any) {
  try {
    const key = getCartSessionKey(sessionId)
    // 7일간 유지
    await redisClient.setEx(key, 60 * 60 * 24 * 7, JSON.stringify(cartData))
    return true
  } catch (error) {
    console.error('Error saving cart to Redis:', error)
    return false
  }
}

/**
 * Redis에서 장바구니 삭제
 */
export async function deleteCartFromRedis(sessionId: string) {
  try {
    const key = getCartSessionKey(sessionId)
    await redisClient.del(key)
    return true
  } catch (error) {
    console.error('Error deleting cart from Redis:', error)
    return false
  }
}
