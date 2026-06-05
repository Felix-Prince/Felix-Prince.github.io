import { POSE_CATEGORIES } from '../../../data/poses';

interface PoseFiltersProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export function PoseFilters({ activeCategory, onCategoryChange }: PoseFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
      }}
    >
      {POSE_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          style={{
            padding: '6px 16px',
            border: '1px solid',
            borderColor:
              activeCategory === cat.id
                ? 'var(--color-accent-secondary)'
                : 'var(--color-border)',
            borderRadius: '20px',
            background:
              activeCategory === cat.id
                ? 'var(--color-accent-secondary)'
                : 'transparent',
            color:
              activeCategory === cat.id
                ? 'var(--color-bg, #050810)'
                : 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '13px',
            fontWeight: activeCategory === cat.id ? 600 : 400,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
