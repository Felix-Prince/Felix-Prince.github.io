import { useState, useMemo, useEffect } from 'react';
import { poses } from '../../../data/poses';
import { PoseFilters } from './PoseFilters';
import { PoseCard } from './PoseCard';
import { PoseDetail } from './PoseDetail';

interface PoseReferenceProps {
  initialPoseId?: string | null;
  onClearPoseId?: () => void;
}

export function PoseReference({ initialPoseId, onClearPoseId }: PoseReferenceProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPoseId, setSelectedPoseId] = useState<string | null>(initialPoseId || null);

  useEffect(() => {
    if (initialPoseId) {
      setSelectedPoseId(initialPoseId);
    }
  }, [initialPoseId]);

  const filteredPoses = useMemo(() => {
    if (activeCategory === 'all') return poses;
    return poses.filter((p) => p.basePose === activeCategory);
  }, [activeCategory]);

  const selectedPose = selectedPoseId
    ? poses.find((p) => p.id === selectedPoseId) || null
    : null;

  if (selectedPose) {
    return (
      <PoseDetail
        pose={selectedPose}
        onBack={() => {
          setSelectedPoseId(null);
          onClearPoseId?.();
        }}
      />
    );
  }

  return (
    <div>
      <PoseFilters
        activeCategory={activeCategory}
        onCategoryChange={(id) => {
          setActiveCategory(id);
          setSelectedPoseId(null);
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredPoses.map((pose) => (
          <PoseCard
            key={pose.id}
            pose={pose}
            onClick={() => setSelectedPoseId(pose.id)}
          />
        ))}
      </div>

      {filteredPoses.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--color-text-secondary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧘</div>
          没有找到匹配的姿势
        </div>
      )}

      <p
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontFamily: "'Noto Sans SC', sans-serif",
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}
      >
        共 {poses.length} 个摆姿参考 · 点击卡片查看详情
      </p>
    </div>
  );
}
