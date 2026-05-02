import { ReactNode } from 'react';

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  text: string;
}

export function SocialLink({ href, icon, text }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={text}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 28px',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        color: 'var(--color-text-secondary)',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        transition: 'all 0.4s var(--transition-ease)',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#050810';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
        const bg = e.currentTarget.querySelector('.social-link-bg') as HTMLElement;
        if (bg) bg.style.opacity = '1';
        const arrow = e.currentTarget.querySelector('.social-link-arrow') as HTMLElement;
        if (arrow) arrow.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-secondary)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        const bg = e.currentTarget.querySelector('.social-link-bg') as HTMLElement;
        if (bg) bg.style.opacity = '0';
        const arrow = e.currentTarget.querySelector('.social-link-arrow') as HTMLElement;
        if (arrow) arrow.style.transform = '';
      }}
    >
      <span className="social-link-bg" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, var(--color-gradient-1), var(--color-gradient-2), var(--color-gradient-3))',
        opacity: 0,
        transition: 'opacity 0.4s var(--transition-ease)'
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{icon}</span>
      <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
      <span className="social-link-arrow" style={{
        position: 'relative',
        zIndex: 1,
        transition: 'transform 0.4s var(--transition-ease)'
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', display: 'block' }}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </a>
  );
}
