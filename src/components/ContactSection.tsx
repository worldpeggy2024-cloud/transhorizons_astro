/*
 * TransHorizons — Contact Section "Get in Touch"
 * Design: Dark charcoal background, ivory form fields, burgundy accents
 * Contact method: mailto: link — pre-fills subject + body from form fields,
 *   opens visitor's email client with peggy.brenier@gmail.com as recipient.
 */

import { useEffect, useRef, useState } from 'react';
import { Send, Mail, MapPin, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CONTACT_EMAIL = 'peggy.brenier@gmail.com';

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function ContactSection() {
  const { ref, inView } = useInView();
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, subject, message } = formState;

    // Build a clean, readable email body
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message,
    ].join('\n');

    const mailtoUrl =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject || 'Message from TransHorizons website')}` +
      `&body=${encodeURIComponent(body)}`;

    // Open the visitor's default email client
    window.location.href = mailtoUrl;

    // Show the success state briefly
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  const fieldClass = (name: string) =>
    `w-full bg-transparent border-b font-body text-sm py-3.5 px-0 focus:outline-none transition-all duration-300 placeholder-white/25 text-white ${
      focused === name ? 'border-[#7D1A2E]' : 'border-white/15'
    }`;

  return (
    <section id="contact" className="bg-[#111111] py-24 lg:py-32" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Info */}
          <div
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#7D1A2E]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-6">
              {t('contact.title')}
            </h2>
            <div className="w-12 h-px bg-[#7D1A2E] mb-8" />
            <p className="text-white/50 font-body text-base leading-relaxed mb-12 max-w-md">
              {t('contact.intro')}
            </p>

            {/* Contact details */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 group">
                <div className="w-11 h-11 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:border-[#7D1A2E] transition-colors">
                  <Mail size={15} className="text-[#7D1A2E]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body mb-1">Email</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-white/70 hover:text-[#7D1A2E] transition-colors font-body text-sm"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <MapPin size={15} className="text-[#7D1A2E]" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body mb-1">{t('contact.location')}</p>
                  <p className="text-white/70 font-body text-sm">{t('contact.montreal')}</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-8 border-t border-white/8">
              <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body mb-5">{t('contact.follow')}</p>
              <div className="flex gap-6">
                {[
                  { icon: BookOpen, label: t('footer.linkedin'), href: '#' },
                  { icon: BookOpen, label: t('footer.instagram'), href: '#' },
                  { icon: BookOpen, label: t('footer.blog'), href: '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-2 text-white/35 hover:text-[#7D1A2E] transition-colors font-body text-xs tracking-wider uppercase group"
                  >
                    <Icon size={13} className="group-hover:scale-110 transition-transform" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div
            className={`transition-all duration-700 ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center">
                <div className="w-16 h-16 border border-[#7D1A2E] flex items-center justify-center mb-6">
                  <Send size={22} className="text-[#7D1A2E]" />
                </div>
                <h3 className="font-display text-2xl text-white mb-3">
                  {t('contact.emailClientOpened')}
                </h3>
                <p className="text-white/40 font-body text-sm max-w-xs leading-relaxed">
                  {t('contact.emailClientOpenedDesc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-9">
                <div>
                  <label className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body block mb-2">
                    Name <span className="text-[#7D1A2E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder={t('contact.name')}
                    required
                    className={fieldClass('name')}
                  />
                </div>

                <div>
                  <label className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body block mb-2">
                    Email <span className="text-[#7D1A2E]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder={t('contact.email')}
                    required
                    className={fieldClass('email')}
                  />
                </div>

                <div>
                  <label className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                    placeholder={t('contact.subject')}
                    className={fieldClass('subject')}
                  />
                </div>

                <div>
                  <label className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-body block mb-2">
                    Message <span className="text-[#7D1A2E]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    placeholder={t('contact.message')}
                    required
                    rows={5}
                    className={`${fieldClass('message')} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#7D1A2E] text-white font-body text-xs tracking-[0.2em] uppercase font-medium hover:bg-white hover:text-[#1A1A1A] transition-colors duration-300"
                >
                  {t('contact.send')}
                  <Send size={13} />
                </button>

                <p className="text-white/20 font-body text-[10px] text-center leading-relaxed">
                  {t('contact.emailClientHint')}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
