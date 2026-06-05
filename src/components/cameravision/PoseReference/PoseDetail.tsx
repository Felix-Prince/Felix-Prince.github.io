import type { Pose } from '../../../data/poses';
import { BASE_POSE_LABELS, DIFFICULTY_STARS } from '../../../data/poses';
import { PoseImage } from './PoseSvg';

interface PoseDetailProps {
  pose: Pose;
  onBack: () => void;
}

export function PoseDetail({ pose, onBack }: PoseDetailProps) {
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
          marginBottom: '16px',
          transition: 'color 0.2s',
        }}
      >
        ← 返回列表
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 1fr)',
          gap: '24px',
          marginBottom: '20px',
        }}
      >
        {/* Large pose image */}
        <div
          style={{
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f0f0',
          }}
        >
          <PoseImage pose={pose} variant="detail" />
        </div>

        {/* Info panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Title & meta */}
          <div>
            <h1
              style={{
                margin: '0 0 6px',
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {pose.name}
            </h1>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: '12px',
              }}
            >
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: '10px',
                  background: 'rgba(78,205,196,0.12)',
                  color: 'var(--color-accent-secondary)',
                }}
              >
                {BASE_POSE_LABELS[pose.basePose] || pose.basePose}
              </span>
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: '10px',
                  background: 'rgba(210,255,254,0.08)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {DIFFICULTY_STARS[pose.difficulty]}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3
              style={{
                margin: '0 0 6px',
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              📝 姿势说明
            </h3>
            <p
              style={{
                margin: 0,
                fontFamily: "'Noto Sans SC', sans-serif",
                fontSize: '13px',
                lineHeight: 1.7,
                color: 'var(--color-text-primary)',
              }}
            >
              {pose.description}
            </p>
          </div>

          {/* Tip */}
          <div
            style={{
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
            💡 {pose.tip}
          </div>
        </div>
      </div>
    </div>
  );
}
