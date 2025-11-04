export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 인증 관련 페이지는 AdminLayout을 사용하지 않음
  return <>{children}</>
}
