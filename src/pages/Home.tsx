import { Footer } from '../components/layout/Footer';
import { SocialLink } from '../components/ui/SocialLink';
import { ProjectCard } from '../components/ui/ProjectCard';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', display: 'block' }}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1S5.07 1 4.77 5.07 1A5.44 5.44 0 0 0 3.33 9.04c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
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
