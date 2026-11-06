import Link from 'next/link'
import { Button } from '@/components/Button'
import { Kicker } from '@/components/Kicker'
import { LogoStory } from '@/features/about/LogoStory'
import { STATS } from '@/features/about/stats'
import { TeamCards } from '@/features/about/TeamCards'
import { SupportStrip } from '@/features/contact/SupportStrip'
import { getSettings, getTeam } from '@/lib/api'
import { isPending, isShown } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'
import { PageCta } from '../_shell/PageCta'
import { PageHero } from '../_shell/PageHero'
import '@/features/about/about-page.css'

export const metadata = pageMetadata({
  title: 'من نحن',
  description:
    'شركة برمجيات من غزة منذ ٢٠٢٢، تبني أنظمة للجمعيات والمدارس والجهات الحكومية والشركات في فلسطين ومصر والإمارات وتركيا. تعرّف على الفريق الذي سيبني نظامك.',
  path: '/about',
})

const WHERE = [
  { country: 'فلسطين', note: 'غزة', clients: 'ساعد · دار الإتقان · جمعية ابن باز · مدرسة شعاع الخاصة · وزارة الأوقاف والشؤون الدينية' },
  { country: 'مصر', note: 'صناعة', clients: 'رصرص للبلاستيك' },
  { country: 'الإمارات', note: 'دبي', clients: 'NexaBridge' },
  { country: 'تركيا', note: 'دعوة', clients: 'الرابطة العالمية لدعاة فلسطين' },
]

export default async function AboutPage() {
  const [team, settings] = await Promise.all([getTeam(), getSettings()])

  return (
    <>
      <main id="top" className="inner about-page">
        <PageHero kicker="من نحن" title="شركة برمجيات من غزة،" accent="تبني أنظمة للمؤسسات التي تخدم الناس.">
          <p className="apg-lead">
            بدأنا عام ٢٠٢٢ ببناء أنظمة للجمعيات التي نعمل معها من الداخل، فعرفنا كيف تُدار المؤسسة قبل أن نكتب أول سطر. اليوم تعمل أنظمتنا في
            جمعيات ومدارس ومراكز تحفيظ وجهات حكومية وشركات، في فلسطين ومصر والإمارات وتركيا.
          </p>
          <div className="apg-stats">
            {STATS.map((s) => (
              <div key={s.label}>
                <b dir={s.ltr ? 'ltr' : undefined}>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </PageHero>

        <section className="apg-team" aria-labelledby="team-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>المؤسسان والفريق</Kicker>
              <h2 id="team-title">من سيبني نظامك.</h2>
              <p className="muted">تتعامل مع من يكتب الكود مباشرة، لا مع وسيط بينكما. اضغط على الصورة للتعرّف.</p>
            </div>
            <TeamCards team={team} />
          </div>
        </section>

        <section className="apg-story" aria-labelledby="story-title">
          <div className="wrap apg-story-grid">
            <div>
              <Kicker>قصتنا</Kicker>
              <h2 id="story-title">لماذا بدأنا.</h2>
              <Pending
                className="apg-why"
                text={settings.why_we_started}
                placeholder="[لماذا بدأنا: جملة أو جملتان بكلامكما. مثلاً ما الذي رأيتماه في الجمعيات والمدارس جعلكما تبدآن أفق.]"
              />
              <p className="apg-p">
                نبني الأنظمة التي تُدار بها المؤسسة يومياً: من يسجّل الطلاب، ومن يعتمد الشراء، ومن يتابع المشروع حتى يصل للمستفيد. ولهذا نبدأ دائماً
                بالجلوس مع من سيستخدم النظام، لا بكتابة الكود.
              </p>
            </div>
            <LogoStory />
          </div>
        </section>

        <section className="apg-where" aria-labelledby="where-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>أين نعمل</Kicker>
              <h2 id="where-title">أربع دول، وأنظمة تعمل كل يوم.</h2>
            </div>
            <ul className="where-grid">
              {WHERE.map((w) => (
                <li key={w.country}>
                  <span className="w-c">{w.country}</span>
                  <span className="w-n">{w.note}</span>
                  <p>{w.clients}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="apg-found" aria-labelledby="found-title">
          <div className="wrap">
            <div className="apg-sec-head">
              <Kicker>الأساس المؤسسي</Kicker>
              <h2 id="found-title">ما يثبت أننا هنا لنبقى.</h2>
            </div>
            <ul className="found-grid">
              {isShown(settings.legal_registration) && (
                <li>
                  <b>التسجيل الرسمي</b>
                  <Pending text={settings.legal_registration} placeholder="[الكيان القانوني ورقم التسجيل]" />
                </li>
              )}
              {isShown(settings.memberships) && (
                <li>
                  <b>العضويات</b>
                  <Pending text={settings.memberships} placeholder="[عضوية اتحاد شركات أنظمة المعلومات الفلسطينية (بيتا) إن وُجدت]" />
                </li>
              )}
              <li>
                <b>حماية البيانات</b>
                <p>
                  بيانات نظامك ملك مؤسستك، ولا نصل إليها إلا بإذنك ولغرض محدد. <Link href="/privacy">سياسة الخصوصية</Link>
                </p>
              </li>
              <li>
                <b>بعد الإطلاق</b>
                <p>نسلّمك الكود والتوثيق كاملين، ونبقى معك بالدعم حتى يستقر النظام.</p>
              </li>
            </ul>
          </div>
        </section>

        <PageCta title="نبدأ بجلسة نسمعك فيها.">
          <Button variant="line" href="/work">
            شاهد أعمالنا
          </Button>
        </PageCta>
      </main>
      <SupportStrip whatsapp={settings.whatsapp_number} />
    </>
  )
}

/**
 * A setting the client has not filled yet: its placeholder, marked as pending,
 * in a preview build; nothing on the live site.
 */
function Pending({ text, placeholder, className }: { text: string | null; placeholder: string; className?: string }) {
  if (!isShown(text)) return null
  const pending = isPending(text)
  const cls = [className, pending && 'pending-txt'].filter(Boolean).join(' ') || undefined
  return <p className={cls}>{pending ? (text ?? placeholder) : text}</p>
}
