import type { Pose } from '../../../data/poses';

interface PoseImageProps {
  pose: Pose;
  size?: number;
  /** 是否在卡片中使用（小图）还是详情中使用（大图） */
  variant?: 'card' | 'detail';
}

export function PoseImage({ pose, size, variant = 'card' }: PoseImageProps) {
  const cardSize = variant === 'detail' ? undefined : (size ?? 200);

  return (
    <div
      style={{
        width: cardSize ? `${cardSize}px` : '100%',
        maxWidth: '100%',
        aspectRatio: '3 / 4',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={pose.imagePath}
        alt={pose.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        loading="lazy"
      />
    </div>
  );
}
