import { DesktopHeader } from "@/components/layout/desktop-header"
import { MobileHeader } from "@/components/layout/mobile-header"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Footer } from "@/components/layout/footer"
import { MobileNavigation } from "@/components/layout/mobile-navigation"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <DesktopHeader />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileHeader />
      </div>

      <main className="pb-16 lg:pb-8">
        <div className="max-w-md mx-auto px-4 py-12">
          <ResetPasswordForm />
        </div>
      </main>

      <Footer />

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}
