import { Footer } from '../components/layout/Footer';
import { SocialLink } from '../components/ui/SocialLink';
import { ProjectCard } from '../components/ui/ProjectCard';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', display: 'block' }}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.314.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" strokeWidth="2" />
  </svg>
);

export function Home() {
  return (
    <div className="container">
      <header style={{ padding: '80px 0 40px' }}>
        <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            marginBottom: '32px'
          }}>
            <div style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, var(--color-gradient-1), var(--color-gradient-2), var(--color-gradient-3), var(--color-gradient-4), var(--color-gradient-1))',
              animation: 'ring-spin 8s linear infinite',
              opacity: 0.7
            }} />
            <div style={{
              position: 'relative',
              width: '112px',
              height: '112px',
              borderRadius: '50%',
              background: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Playfair Display', serif",
              fontSize: '44px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              zIndex: 1,
              boxShadow: 'var(--shadow-soft)'
            }}>F</div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '12px',
              animation: 'fade-in-up 0.8s var(--transition-ease) both'
            }}>Hello, I'm</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '64px',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'fade-in-up 0.8s var(--transition-ease) 0.1s both'
            }}>Felix Prince</h1>
            <div style={{ overflow: 'hidden' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '18px',
                color: 'var(--color-text-secondary)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                animation: 'fade-in-up 0.8s var(--transition-ease) 0.2s both'
              }}>探索代码与创意的交汇点</span>
            </div>
          </div>

          <nav style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fade-in-up 0.8s var(--transition-ease) 0.3s both'
          }}>
            <SocialLink
              href="https://github.com/Felix-Prince"
              icon={<GithubIcon />}
              text="GitHub"
            />
          </nav>
        </div>
      </header>

      <main>
        <section style={{ padding: '40px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '48px'
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              color: 'var(--color-accent)',
              fontWeight: 500
            }}>01</span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}>精选项目</h2>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, var(--color-border) 0%, transparent 100%)'
            }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            <ProjectCard
              to="/colorwalk"
              type="Web App"
              title="ColorWalk"
              description="一种色彩探索的出行方式，随机抽取颜色，用一天去寻找和记录城市里的色彩故事。"
              emoji="🎨"
              ctaText="探索项目"
            />
            <ProjectCard
              to="/photogallery"
              type="Photography"
              title="摄影集"
              description="个人摄影作品集，记录生活中的光影瞬间。支持标签分类、搜索与时间线浏览。"
              emoji="📷"
              ctaText="浏览作品"
            />
            <ProjectCard
              isPlaceholder
              type=""
              title=""
              description="更多项目\n即将推出"
              emoji="✨"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
