'use client';

import { useActionState, useState } from 'react';
import { submitContact, type ContactState } from './lib/contact-action';
import type { Lang } from './site-data';

const initial: ContactState = { status: 'idle' };

export default function ContactForm({ lang }: { lang: Lang }) {
  const en = lang === 'en';
  const [state, action, pending] = useActionState(submitContact, initial);
  const [startedAt] = useState(() => Date.now());
  const err = state.fieldErrors || {};
  const val = state.values || {};

  if (state.status === 'success') {
    return (
      <div className="placeholder" role="status">
        {state.message}
      </div>
    );
  }

  const field = (name: keyof NonNullable<ContactState['fieldErrors']>, label: string, opts: { type?: string; required?: boolean; max: number; autoComplete?: string }) => (
    <label className="form-field">
      <span>
        {label}
        {opts.required ? ' *' : ''}
      </span>
      <input
        name={name}
        type={opts.type || 'text'}
        required={opts.required}
        maxLength={opts.max}
        autoComplete={opts.autoComplete}
        defaultValue={val[name]}
        aria-invalid={Boolean(err[name])}
        aria-describedby={err[name] ? `${name}-error` : undefined}
      />
      {err[name] && (
        <small id={`${name}-error`} className="form-error">
          {err[name]}
        </small>
      )}
    </label>
  );

  return (
    <form className="contact-form" action={action} noValidate>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot: hidden from people, often filled by bots. */}
      <div className="form-hp" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="form-grid">
        {field('name', en ? 'Full name' : 'Họ và tên', { required: true, max: 120, autoComplete: 'name' })}
        {field('email', 'Email', { type: 'email', required: true, max: 254, autoComplete: 'email' })}
        {field('organization', en ? 'Organisation' : 'Tổ chức', { max: 200, autoComplete: 'organization' })}
        {field('phone', en ? 'Phone' : 'Điện thoại', { type: 'tel', max: 40, autoComplete: 'tel' })}
      </div>
      {field('subject', en ? 'Subject' : 'Tiêu đề', { required: true, max: 200 })}
      <label className="form-field">
        <span>{en ? 'Message' : 'Nội dung'} *</span>
        <textarea
          name="message"
          rows={6}
          required
          maxLength={5000}
          defaultValue={val.message}
          aria-invalid={Boolean(err.message)}
          aria-describedby={err.message ? 'message-error' : undefined}
        />
        {err.message && (
          <small id="message-error" className="form-error">
            {err.message}
          </small>
        )}
      </label>
      {state.status === 'error' && state.message && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}
      <button className="btn btn-dark" type="submit" disabled={pending}>
        {pending ? (en ? 'Sending…' : 'Đang gửi…') : en ? 'Send message' : 'Gửi tin nhắn'} <span>↗</span>
      </button>
    </form>
  );
}
