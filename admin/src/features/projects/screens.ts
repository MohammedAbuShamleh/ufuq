import { imageSize } from '@/components/upload/files'
import type { ScreenKind } from './types'

/** A phone shot is clearly taller than wide; anything else is a desktop shot. */
export async function detectKind(file: File, url: string): Promise<ScreenKind> {
  if (file.type.startsWith('video/')) return 'video'
  const size = await imageSize(url)
  return size && size.height > size.width * 1.3 ? 'mobile' : 'desktop'
}

/** Where each kind of shot shows in the project's layout in «أعمالنا». */
export const KIND_HINT: Record<ScreenKind, string> = {
  desktop: 'الشاشة الكبيرة ومصغّراتها في «واجهة وشاشات»، ولوحة «لوحة شاشات»، ومسرح «عرض متحرك».',
  mobile: 'تظهر في طريقة «هواتف»: أول ثلاث شاشات جوال بالترتيب.',
  video: 'يُعرض دون صوت على مسرح «عرض متحرك».',
}
