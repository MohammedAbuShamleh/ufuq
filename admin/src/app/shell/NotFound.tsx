import { EmptyState } from '@/components/Page'
import { LinkButton } from '@/components/ui/Button'

export function NotFound() {
  return <EmptyState title="الصفحة غير موجودة" body="ربما تغيّر الرابط أو حُذف العنصر." action={<LinkButton to="/projects">إلى المشاريع</LinkButton>} />
}
