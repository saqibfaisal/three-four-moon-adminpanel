import { DesktopHeader } from "@/components/layout/desktop-header"
import { MobileHeader } from "@/components/layout/mobile-header"
import { LoginForm } from "@/components/auth/login-form"
import { Footer } from "@/components/layout/footer"
import { MobileNavigation } from "@/components/layout/mobile-navigation"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">


      <main className="pb-16 lg:pb-8">
        <div className="max-w-md mx-auto px-4 py-12">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
