interface TabBarProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <nav style={{
      display: 'flex',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 16px',
      overflowX: 'auto',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '12px 20px',
            border: 'none',
            background: 'none',
            color: activeTab === tab.id
              ? 'var(--color-accent-secondary)'
              : 'var(--color-text-secondary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
            fontWeight: activeTab === tab.id ? 600 : 400,
            cursor: 'pointer',
            borderBottom: activeTab === tab.id ? '2px solid var(--color-accent-secondary)' : '2px solid transparent',
            transition: 'color 0.2s, border-color 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
