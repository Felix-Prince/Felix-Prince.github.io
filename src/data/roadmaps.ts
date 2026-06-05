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
  {
    id: 'dify-roadmap-2026',
    title: 'Dify 学习路线图 2026',
    description:
      '为前端开发者量身定制的 Dify 学习路线。聚焦 API 集成、前端嵌入、自定义组件开发，零后端部署负担，从入门到全栈 LLM 应用实战。',
    icon: '🔧',
    status: 'active',
    weeks: 28,
    stages: 6,
    tags: ['Dify', 'LLM', 'RAG', 'Agent', 'Workflow', '前端集成'],
    href: '/roadmaps/dify-roadmap-2026.html',
  },
];
