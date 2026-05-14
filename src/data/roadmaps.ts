export interface RoadmapMeta {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'active' | 'completed' | 'planned';
  weeks: number;
  stages: number;
  tags: string[];
  href: string;
}

export const roadmaps: RoadmapMeta[] = [
  {
    id: 'agent-roadmap-2026',
    title: 'Agent 工程学习路线 2026',
    description:
      '从零基础到 Agent 工程方向的系统学习路线，涵盖 TypeScript/Node.js、Anthropic/Claude 生态，从兴趣探索到创业方向。',
    icon: '🤖',
    status: 'active',
    weeks: 42,
    stages: 6,
    tags: ['TypeScript', 'Node.js', 'Claude', 'Anthropic', 'Agent'],
    href: '/roadmaps/agent-roadmap-2026.html',
  },
];
