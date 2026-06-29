import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { PortalSidebar } from '@/components/portal/layout/PortalSidebar'
import { PortalHeader } from '@/components/portal/layout/PortalHeader'
import { SidebarUserInfo, SidebarUserInfoSkeleton } from '@/components/portal/layout/SidebarUserInfo'
import { HeaderAvatar, HeaderAvatarSkeleton } from '@/components/portal/layout/HeaderAvatar'
import { NotificationDropdown } from '@/components/portal/notifications/NotificationDropdown'
import { LivePricesProvider } from '@/lib/context/LivePricesContext'
import { ROUTES } from '@/lib/constants/routes'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.auth.login)
  }

  return (
    <LivePricesProvider>
      <div className="flex h-screen overflow-hidden bg-bg-base">
        <PortalSidebar
          userInfoSlot={
            <Suspense fallback={<SidebarUserInfoSkeleton />}>
              <SidebarUserInfo userId={user.id} />
            </Suspense>
          }
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PortalHeader
            notificationsSlot={<NotificationDropdown />}
            avatarSlot={
              <Suspense fallback={<HeaderAvatarSkeleton />}>
                <HeaderAvatar userId={user.id} />
              </Suspense>
            }
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </LivePricesProvider>
  )
}
