import { useState, useMemo } from 'react';
import { shootingPlans } from '../../../data/shooting-plans';
import { PlanFilters } from './PlanFilters';
import { PlanCard } from './PlanCard';
import { PlanDetail } from './PlanDetail';

export function ShootingPlan() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const filteredPlans = useMemo(() => {
    let result = shootingPlans;

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const selectedPlan = selectedPlanId
    ? shootingPlans.find((p) => p.id === selectedPlanId) || null
    : null;

  // Detail mode
  if (selectedPlan) {
    return (
      <PlanDetail
        plan={selectedPlan}
        onBack={() => setSelectedPlanId(null)}
      />
    );
  }

  // Gallery mode
  return (
    <div>
      <PlanFilters
        activeCategory={activeCategory}
        onCategoryChange={(id) => {
          setActiveCategory(id);
          setSelectedPlanId(null);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredPlans.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--color-text-secondary)',
            fontFamily: "'Noto Sans SC', sans-serif",
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
          没有找到匹配的方案，试试其他关键词
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onClick={() => setSelectedPlanId(plan.id)}
            />
          ))}
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
        共 {shootingPlans.length} 个拍摄方案 · 更多方案持续更新
      </p>
    </div>
  );
}
