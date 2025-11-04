import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader user={session.user} />

      <main className="ml-64 mt-16 p-8">
        {children}
      </main>
    </div>
  )
}
