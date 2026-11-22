'use server';

import { headers } from 'next/headers';
import { createContactMessage } from './cms';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back on error so the form can keep what the visitor typed. */
  values?: Partial<Record<ContactField, string>>;
};
type ContactField = 'name' | 'email' | 'subject' | 'message' | 'phone' | 'organization';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{6,40}$/;
const MIN_FILL_MS = 3000; // bots usually submit instantly
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Simple per-process rate limiter. For multi-instance hosting use a shared store (e.g. Redis).
const hits = new Map<string, number[]>();
function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim() : '';
};

export async function submitContact(_prev: ContactState, fd: FormData): Promise<ContactState> {
  const lang = str(fd, 'lang') === 'en' ? 'en' : 'vi';
  const en = lang === 'en';
  const t = {
    required: en ? 'This field is required.' : 'Vui lòng nhập thông tin này.',
    email: en ? 'Enter a valid email address.' : 'Email không hợp lệ.',
    phone: en ? 'Enter a valid phone number.' : 'Số điện thoại không hợp lệ.',
    tooLong: en ? 'This field is too long.' : 'Nội dung quá dài.',
    tooShort: en ? 'Please write a little more.' : 'Vui lòng nhập chi tiết hơn.',
    fix: en ? 'Please check the highlighted fields.' : 'Vui lòng kiểm tra lại các trường được đánh dấu.',
    rate: en ? 'Too many messages. Please try again in a few minutes.' : 'Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau vài phút.',
    unavailable: en
      ? 'The form is temporarily unavailable. Please email us directly.'
      : 'Biểu mẫu tạm thời chưa hoạt động. Vui lòng gửi email trực tiếp cho chúng tôi.',
    ok: en ? 'Thank you! Your message has been sent.' : 'Cảm ơn bạn! Tin nhắn đã được gửi.',
  };

  // Honeypot + time trap: silently accept so bots learn nothing.
  const startedAt = Number(str(fd, 'startedAt'));
  if (str(fd, 'website') || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: 'success', message: t.ok };
  }

  const data = {
    name: str(fd, 'name'),
    email: str(fd, 'email').toLowerCase(),
    organization: str(fd, 'organization'),
    phone: str(fd, 'phone'),
    subject: str(fd, 'subject'),
    message: str(fd, 'message'),
  };

  const errors: ContactState['fieldErrors'] = {};
  if (data.name.length < 2) errors.name = t.required;
  else if (data.name.length > 120) errors.name = t.tooLong;
  if (!data.email) errors.email = t.required;
  else if (!EMAIL.test(data.email) || data.email.length > 254) errors.email = t.email;
  if (data.phone && !PHONE.test(data.phone)) errors.phone = t.phone;
  if (data.organization.length > 200) errors.organization = t.tooLong;
  if (data.subject.length < 3) errors.subject = t.required;
  else if (data.subject.length > 200) errors.subject = t.tooLong;
  if (data.message.length < 10) errors.message = data.message ? t.tooShort : t.required;
  else if (data.message.length > 5000) errors.message = t.tooLong;
  if (Object.keys(errors).length) return { status: 'error', message: t.fix, fieldErrors: errors, values: data };

  const h = await headers();
  const ip = (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim();
  if (rateLimited(ip)) return { status: 'error', message: t.rate, values: data };

  try {
    const saved = await createContactMessage({
      ...data,
      organization: data.organization || undefined,
      phone: data.phone || undefined,
      locale: lang,
    });
    if (!saved) return { status: 'error', message: t.unavailable, values: data };
    return { status: 'success', message: t.ok };
  } catch (error) {
    console.error('[contact] failed to store message', error);
    return { status: 'error', message: t.unavailable, values: data };
  }
}
