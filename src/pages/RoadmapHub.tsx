import { Link } from 'react-router-dom';
import { roadmaps, type RoadmapMeta } from '../data/roadmaps';

const statusConfig: Record<RoadmapMeta['status'], { label: string; color: string }> = {
  active: { label: '进行中', color: '#4ecdc4' },
  completed: { label: '已完成', color: '#a8e6cf' },
  planned: { label: '已规划', color: '#d2fffe' },
};

function RoadmapCard({ roadmap }: { roadmap: RoadmapMeta }) {
  const status = statusConfig[roadmap.status];

  return (
    <a
      href={roadmap.href}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        transition: 'all 0.4s var(--transition-ease)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = 'var(--color-bg-elevated-hover)';
        el.style.borderColor = 'var(--color-border-strong)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = 'var(--shadow-soft)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'var(--color-bg-elevated)';
        el.style.borderColor = 'var(--color-border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          fontSize: '36px',
          marginBottom: '16px',
          lineHeight: 1,
        }}
      >
        {roadmap.icon}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '10px',
        }}
      >
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {roadmap.title}
        </h3>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            color: status.color,
            background: `${status.color}18`,
            border: `1px solid ${status.color}30`,
            borderRadius: '20px',
            padding: '2px 10px',
            whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {status.label}
        </span>
      </div>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.6,
          marginBottom: '20px',
        }}
      >
        {roadmap.description}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{roadmap.weeks} 周</span>
        <span>·</span>
        <span>{roadmap.stages} 阶段</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {roadmap.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--color-accent-secondary)',
              background: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.2)',
              borderRadius: '4px',
              padding: '2px 8px',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

export function RoadmapHub() {
  return (
    <div className="container">
      <header style={{ padding: '80px 0 60px', textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '40px',
            transition: 'color 0.2s var(--transition-ease)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回首页
        </Link>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '48px',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            background:
              'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          学习路线
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)',
            fontWeight: 300,
          }}
        >
          统一管理所有学习路线，追踪成长轨迹
        </p>
      </header>

      <main style={{ paddingBottom: '80px' }}>
        {roadmaps.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              color: 'var(--color-text-muted)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p
              style={{
                fontSize: '16px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              暂无学习路线
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '24px',
            }}
          >
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
