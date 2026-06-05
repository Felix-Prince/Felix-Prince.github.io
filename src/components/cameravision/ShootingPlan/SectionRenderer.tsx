import type { ShootingPlanSection } from '../../../data/shooting-plans';

interface SectionRendererProps {
  section: ShootingPlanSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'heading':
      return (
        <h2
          style={{
            margin: '0 0 12px',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: section.level === 3 ? '15px' : '17px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            lineHeight: 1.4,
          }}
        >
          {section.content || ''}
        </h2>
      );

    case 'text':
      return (
        <p
          style={{
            margin: '0 0 16px',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'var(--color-text-primary)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {section.content || ''}
        </p>
      );

    case 'tip':
      return (
        <div
          style={{
            margin: '0 0 16px',
            padding: '12px 14px',
            background: 'rgba(78,205,196,0.08)',
            borderLeft: '3px solid var(--color-accent-secondary)',
            borderRadius: '0 8px 8px 0',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '13px',
            lineHeight: 1.7,
            color: 'var(--color-accent-secondary)',
          }}
        >
          💡 {section.content || ''}
        </div>
      );

    case 'image':
      return (
        <figure
          style={{
            margin: '0 0 16px',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--color-bg-elevated)',
          }}
        >
          <div
            style={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(36,116,166,0.1), rgba(78,205,196,0.1))',
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              fontFamily: "'Noto Sans SC', sans-serif",
            }}
          >
            {section.src ? (
              <img
                src={section.src}
                alt={section.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
              />
            ) : (
              <span>📷 参考图占位</span>
            )}
          </div>
          {section.caption && (
            <figcaption
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                fontFamily: "'Noto Sans SC', sans-serif",
              }}
            >
              {section.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'settings-table':
      return (
        <div
          style={{
            margin: '0 0 16px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '13px',
          }}
        >
          {section.rows?.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                borderBottom: i < (section.rows?.length || 0) - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div
                style={{
                  flex: '0 0 100px',
                  padding: '8px 12px',
                  background: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
