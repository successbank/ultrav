'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // 회원가입 폼 상태
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  })

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: NextAuth 로그인 API 호출
      // 현재는 임시로 localStorage 사용
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (loginForm.email && loginForm.password) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            email: loginForm.email,
            name: '사용자',
          })
        )
        alert('로그인 성공!')
        router.push('/')
      } else {
        setError('이메일과 비밀번호를 입력해주세요.')
      }
    } catch (err) {
      setError('로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 처리
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (registerForm.password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setIsLoading(true)

    try {
      // TODO: 회원가입 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      setIsLogin(true)
      setRegisterForm({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
      })
    } catch (err) {
      setError('회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            Ultra 쇼핑몰
          </Link>
          <p className="mt-2 text-gray-600">
            {isLogin ? '로그인하여 쇼핑을 시작하세요' : '회원가입하고 쇼핑을 시작하세요'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Toggle Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 rounded-md font-semibold transition-colors ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              회원가입
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="이메일"
                type="email"
                placeholder="example@email.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />

              <Input
                label="비밀번호"
                type="password"
                placeholder="8자 이상 입력"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-600">로그인 상태 유지</span>
                </label>
                <Link href="#" className="text-blue-600 hover:underline">
                  비밀번호 찾기
                </Link>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full py-3">
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="이메일"
                type="email"
                placeholder="example@email.com"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                required
              />

              <Input
                label="이름"
                type="text"
                placeholder="홍길동"
                value={registerForm.name}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, name: e.target.value })
                }
                required
              />

              <Input
                label="전화번호"
                type="tel"
                placeholder="010-0000-0000"
                value={registerForm.phone}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, phone: e.target.value })
                }
              />

              <Input
                label="비밀번호"
                type="password"
                placeholder="8자 이상 입력"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                required
              />

              <Input
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호 재입력"
                value={registerForm.confirmPassword}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />

              <Button type="submit" disabled={isLoading} className="w-full py-3">
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Google로 계속하기
            </button>
            <button
              type="button"
              className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Kakao로 계속하기
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
