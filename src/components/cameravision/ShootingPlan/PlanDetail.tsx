import type { ShootingPlan } from '../../../data/shooting-plans';
import { SectionRenderer } from './SectionRenderer';

interface PlanDetailProps {
  plan: ShootingPlan;
  onBack: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  portrait: '人像',
  landscape: '风光',
  street: '街拍',
  'still-life': '静物',
  architecture: '建筑',
  night: '夜景',
};

const DIFFICULTY_LABELS: Record<string, { stars: string; label: string }> = {
  beginner: { stars: '⭐', label: '入门' },
  intermediate: { stars: '⭐⭐', label: '进阶' },
  advanced: { stars: '⭐⭐⭐', label: '高阶' },
};

export function PlanDetail({ plan, onBack }: PlanDetailProps) {
  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          background: 'transparent',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: '13px',
          marginBottom: '20px',
          transition: 'color 0.2s',
        }}
      >
        ← 返回方案列表
      </button>

      {/* Title section */}
      <div
        style={{
          marginBottom: '20px',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '16px',
        }}
      >
        <h1
          style={{
            margin: '0 0 4px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {plan.title}
        </h1>
        <p
          style={{
            margin: '0 0 10px',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {plan.subtitle}
        </p>

        {/* Tags row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
          }}
        >
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(78,205,196,0.12)',
              color: 'var(--color-accent-secondary)',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '11px',
            }}
          >
            {CATEGORY_NAMES[plan.category] || plan.category}
          </span>
          {plan.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'var(--color-bg-elevated)',
                color: 'var(--color-text-secondary)',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: '11px',
              }}
            >
              {tag}
            </span>
          ))}
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(210,255,254,0.08)',
              color: 'var(--color-text-primary)',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '11px',
            }}
          >
            {DIFFICULTY_LABELS[plan.difficulty].stars} {DIFFICULTY_LABELS[plan.difficulty].label}
          </span>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(210,255,254,0.08)',
              color: 'var(--color-text-primary)',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '11px',
            }}
          >
            🕐 {plan.estimatedTime}
          </span>
        </div>
      </div>

      {/* Gear */}
      {plan.gear && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 16px',
            background: 'var(--color-bg-elevated)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            style={{
              margin: '0 0 10px',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎯 推荐镜头 & 道具
          </h3>
          {plan.gear.lens && (
            <Row label="镜头" value={plan.gear.lens.join(' / ')} />
          )}
          {plan.gear.props && (
            <Row label="道具" value={plan.gear.props.join(' / ')} />
          )}
        </div>
      )}

      {/* Settings summary */}
      {plan.settings && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 16px',
            background: 'var(--color-bg-elevated)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            style={{
              margin: '0 0 10px',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ⚙️ 推荐参数
          </h3>
          {plan.settings.aperture && <Row label="光圈" value={plan.settings.aperture} />}
          {plan.settings.shutterSpeed && <Row label="快门" value={plan.settings.shutterSpeed} />}
          {plan.settings.iso && <Row label="ISO" value={plan.settings.iso} />}
          {plan.settings.focalLength && <Row label="焦距" value={plan.settings.focalLength} />}
          {plan.settings.whiteBalance && <Row label="白平衡" value={plan.settings.whiteBalance} />}
        </div>
      )}

      {/* Reference Images */}
      {plan.referenceImages && plan.referenceImages.length > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 16px',
            background: 'var(--color-bg-elevated)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            style={{
              margin: '0 0 12px',
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🖼 参考图
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px',
            }}
          >
            {plan.referenceImages.map((img, i) => (
              <figure
                key={i}
                style={{
                  margin: 0,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'var(--color-bg)',
                }}
              >
                <div
                  style={{
                    height: '340px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(36,116,166,0.1), rgba(78,205,196,0.1))',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    fontFamily: "'Noto Sans SC', sans-serif",
                  }}
                >
                  {img.src ? (
                    <img
                      src={img.src}
                      alt={img.caption || `参考图 ${i + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <span>📷 参考图 {i + 1}</span>
                  )}
                </div>
                {img.caption && (
                  <figcaption
                    style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      color: 'var(--color-text-secondary)',
                      fontFamily: "'Noto Sans SC', sans-serif",
                    }}
                  >
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Content sections */}
      {plan.sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '4px',
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: '13px',
        lineHeight: 1.6,
      }}
    >
      <span
        style={{
          flex: '0 0 48px',
          color: 'var(--color-text-secondary)',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  );
}
