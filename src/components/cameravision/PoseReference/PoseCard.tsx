import type { Pose } from '../../../data/poses';
import { BASE_POSE_LABELS, DIFFICULTY_STARS } from '../../../data/poses';
import { PoseImage } from './PoseSvg';

interface PoseCardProps {
  pose: Pose;
  onClick: () => void;
}

export function PoseCard({ pose, onClick }: PoseCardProps) {
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
      aria-label={`查看摆姿：${pose.name}`}
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
      {/* Pose image */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 16px 0',
        }}
      >
        <PoseImage pose={pose} variant="card" />
      </div>

      {/* Info */}
      <div
        style={{
          padding: '10px 14px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {pose.name}
        </h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontFamily: "'Noto Sans SC', sans-serif",
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>{BASE_POSE_LABELS[pose.basePose] || pose.basePose}</span>
          <span>{DIFFICULTY_STARS[pose.difficulty]}</span>
        </div>
      </div>
    </article>
  );
}
