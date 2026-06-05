import type { ShootingPlan } from '../../../data/shooting-plans';
import { isImagePath } from '../../../data/shooting-plans';

interface PlanCardProps {
  plan: ShootingPlan;
  onClick: () => void;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '⭐',
  intermediate: '⭐⭐',
  advanced: '⭐⭐⭐',
};

const CATEGORY_NAMES: Record<string, string> = {
  portrait: '人像',
  landscape: '风光',
  street: '街拍',
  'still-life': '静物',
  architecture: '建筑',
  night: '夜景',
};

export function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`查看拍摄方案：${plan.title}`}
      style={{
        background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: '140px',
          background: plan.coverGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          userSelect: 'none',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isImagePath(plan.coverEmoji) ? (
          <img
            src={plan.coverEmoji}
            alt={plan.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        ) : (
          plan.coverEmoji
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}
          >
            {plan.title}
          </h3>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              fontFamily: "'Noto Sans SC', sans-serif",
              whiteSpace: 'nowrap',
              marginLeft: '8px',
            }}
          >
            {DIFFICULTY_LABELS[plan.difficulty]}
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {plan.summary}
        </p>

        {/* Tags + meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: '4px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '4px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                padding: '2px 8px',
                background: 'rgba(78,205,196,0.12)',
                borderRadius: '10px',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: '11px',
                color: 'var(--color-accent-secondary)',
              }}
            >
              {CATEGORY_NAMES[plan.category] || plan.category}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Noto Sans SC', sans-serif",
              fontSize: '11px',
              color: 'var(--color-text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            {plan.estimatedTime}
          </span>
        </div>
      </div>
    </article>
  );
}
