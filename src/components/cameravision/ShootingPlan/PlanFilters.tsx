import { SHOOTING_CATEGORIES } from '../../../data/shooting-plans';

interface PlanFiltersProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PlanFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: PlanFiltersProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
      }}
    >
      {/* Search */}
      <div
        style={{
          position: 'relative',
          flex: '1 1 240px',
          minWidth: '160px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px',
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="搜索拍摄方案..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="搜索拍摄方案"
          style={{
            width: '100%',
            padding: '8px 12px 8px 32px',
            background: 'var(--color-bg-elevated, rgba(36,116,166,0.08))',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: 'var(--color-text-primary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {SHOOTING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            style={{
              padding: '6px 14px',
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
              fontSize: '12px',
              fontWeight: activeCategory === cat.id ? 600 : 400,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
