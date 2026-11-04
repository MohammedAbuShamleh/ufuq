// The one door to the admin API (Laravel Sanctum, SPA cookie mode).
// Requests carry the session cookie and echo the XSRF-TOKEN cookie back as a
// header; the first write of a visit fetches that cookie.

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/admin/v1'
const CSRF_URL = new URL('/sanctum/csrf-cookie', API_URL).href

export type FieldErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly errors: FieldErrors

  constructor(status: number, message: string, errors: FieldErrors = {}) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

const FALLBACK: Record<number, string> = {
  0: 'تعذّر الاتصال بالخادم. تحقّق من الإنترنت وحاول مجدداً.',
  401: 'سجّل الدخول أولاً.',
  403: 'لا تملك صلاحية هذا الإجراء.',
  404: 'العنصر غير موجود، ربما حُذف.',
  413: 'الملف أكبر من الحجم المسموح.',
  419: 'انتهت الجلسة، حدّث الصفحة وحاول مجدداً.',
  429: 'محاولات كثيرة، انتظر دقيقة ثم حاول.',
}

const fallbackMessage = (status: number) => FALLBACK[status] ?? 'حدث خطأ غير متوقع، حاول مجدداً.'

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

async function ensureCsrf(force = false) {
  if (!force && readCookie('XSRF-TOKEN')) return
  await fetch(CSRF_URL, { credentials: 'include', headers: { Accept: 'application/json' } })
}

function headers(json: boolean): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
  const token = readCookie('XSRF-TOKEN')
  if (token) h['X-XSRF-TOKEN'] = token
  if (json) h['Content-Type'] = 'application/json'
  return h
}

function toError(status: number, data: unknown): ApiError {
  const body = (data ?? {}) as { message?: unknown; errors?: unknown }
  const errors = body.errors && typeof body.errors === 'object' ? (body.errors as FieldErrors) : {}
  // A 422's summary line is Laravel's ("… (and 2 more errors)"); the first field message reads better.
  const first = Object.values(errors)[0]?.[0]
  const server = typeof body.message === 'string' && body.message && status < 500 ? body.message : null
  return new ApiError(status, (status === 422 ? first : null) ?? server ?? fallbackMessage(status), errors)
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export async function api<T>(path: string, options: { method?: Method; body?: unknown } = {}): Promise<T> {
  const method = options.method ?? 'GET'
  const write = method !== 'GET'

  const send = () =>
    fetch(API_URL + path, {
      method,
      credentials: 'include',
      headers: headers(options.body !== undefined),
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })

  let res: Response
  try {
    if (write) await ensureCsrf()
    res = await send()
    // An expired token is renewed once, quietly.
    if (res.status === 419 && write) {
      await ensureCsrf(true)
      res = await send()
    }
  } catch {
    throw new ApiError(0, fallbackMessage(0))
  }

  if (res.status === 204) return undefined as T
  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) throw toError(res.status, data)
  return data as T
}

/** Multipart upload through XHR: fetch cannot report upload progress. */
export async function upload<T>(path: string, form: FormData, onProgress?: (fraction: number) => void): Promise<T> {
  try {
    await ensureCsrf()
  } catch {
    throw new ApiError(0, fallbackMessage(0))
  }

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', API_URL + path)
    xhr.withCredentials = true
    for (const [k, v] of Object.entries(headers(false))) xhr.setRequestHeader(k, v)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onerror = () => reject(new ApiError(0, fallbackMessage(0)))
    xhr.onload = () => {
      let data: unknown = null
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null
      } catch {
        // A non-JSON body (e.g. the PHP size limit page) falls back to the status message.
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data as T)
      else reject(toError(xhr.status, data))
    }
    xhr.send(form)
  })
}

/** First message per field, keyed like the request ("title.ar", "facts.0.value"). */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {}
  return Object.fromEntries(Object.entries(error.errors).map(([k, v]) => [k, v[0] ?? '']))
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return fallbackMessage(-1)
}
