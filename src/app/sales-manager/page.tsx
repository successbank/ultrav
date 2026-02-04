import { redirect } from "next/navigation"

export default function SalesManagerDashboard() {
  // 고객 관리 페이지로 리다이렉트
  redirect("/sales-manager/customers")
}
