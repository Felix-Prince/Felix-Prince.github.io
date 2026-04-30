import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GradientOrbs } from '../components/layout/GradientOrbs';

interface ColorItem {
  name: string;
  color: string;
}

const allColors: ColorItem[] = [
  { name: '樱桃红', color: '#FF6B6B' },
  { name: '西瓜红', color: '#FF4757' },
  { name: '珊瑚粉', color: '#FF7F50' },
  { name: '蜜桃粉', color: '#FFABAB' },
  { name: '玫瑰粉', color: '#FF6B9D' },
  { name: '樱花粉', color: '#FFB7C5' },
  { name: '亮橙色', color: '#FF9F43' },
  { name: '太阳橙', color: '#FF8C00' },
  { name: '芒果橙', color: '#FFA502' },
  { name: '金黄', color: '#F9CA24' },
  { name: '柠檬黄', color: '#F7DC6F' },
  { name: '小鸡黄', color: '#FFF3CD' },
  { name: '鸭蛋黄', color: '#FFEAA7' },
  { name: '青柠绿', color: '#7bed9f' },
  { name: '薄荷绿', color: '#A8E6CF' },
  { name: '苹果绿', color: '#82E0AA' },
  { name: '草绿', color: '#6DD55A' },
  { name: '翠绿', color: '#2ECC71' },
  { name: '森林绿', color: '#27AE60' },
  { name: '青碧色', color: '#1ABC9C' },
  { name: '水青色', color: '#00D2D3' },
  { name: '天青蓝', color: '#48DBFB' },
  { name: '天空蓝', color: '#74B9FF' },
  { name: '海洋蓝', color: '#0984E3' },
  { name: '宝石蓝', color: '#2E86DE' },
  { name: '浅紫蓝', color: '#A29BFE' },
  { name: '薰衣草', color: '#D6A2E8' },
  { name: '紫罗兰', color: '#9B59B6' },
  { name: '葡萄紫', color: '#A55EEA' },
  { name: '梅子紫', color: '#BE2EDD' },
  { name: '藕荷紫', color: '#E0BBE4' },
  { name: '丁香紫', color: '#B8A9C9' },
  { name: '香槟金', color: '#FFC312' },
  { name: '铂金色', color: '#EAB543' },
  { name: '桃心红', color: '#FD79A8' },
  { name: '霓虹粉', color: '#F368E0' },
];

function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export function ColorWalk() {
  const [wheelColors, setWheelColors] = useState<ColorItem[]>([]);
  const [availableColors, setAvailableColors] = useState<ColorItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initColors();
  }, []);

  const initColors = () => {
    const shuffled = shuffleArray(allColors);
    setWheelColors(shuffled.slice(0, 8));
    setAvailableColors(shuffled.slice(8));
  };

  const randomizeColors = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 100);
    initColors();
  };

  const removeWheelColor = (index: number) => {
    if (wheelColors.length <= 2) {
      alert('转盘至少需要保留2个颜色');
      return;
    }
    const removed = wheelColors[index];
    setWheelColors(prev => prev.filter((_, i) => i !== index));
    setAvailableColors(prev => [removed, ...prev]);
  };

  const addToWheel = (index: number) => {
    if (wheelColors.length >= 12) {
      alert('转盘最多添加12个颜色');
      return;
    }
    const added = availableColors[index];
    setAvailableColors(prev => prev.filter((_, i) => i !== index));
    setWheelColors(prev => [...prev, added]);
  };

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + spins * 360 + randomAngle;
    setRotation(totalRotation);
  };

  const handleTransitionEnd = () => {
    if (isSpinning) {
      setIsSpinning(false);
    }
  };

  const segmentAngle = 360 / wheelColors.length;

  return (
    <>
      <GradientOrbs />
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '520px',
        margin: '0 auto',
        padding: '0 24px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{ padding: '32px 0 24px', textAlign: 'center', animation: 'fade-in-up 0.8s var(--transition-ease) both' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              marginBottom: '24px',
              transition: 'color 0.3s var(--transition-ease)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
          >
            <BackIcon />
            <span>返回</span>
          </Link>
          <div className="header-content">
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '8px'
            }}>色彩漫步</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '40px',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>ColorWalk</h1>
            <p style={{
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              fontWeight: 300
            }}>随机一种颜色，用一天去寻找城市里的色彩故事</p>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <section style={{ padding: '16px 0', animation: 'fade-in-up 0.8s var(--transition-ease) 0.1s both' }}>
            <div style={{ position: 'relative', width: '320px', height: '320px', margin: '0 auto' }}>
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }} />
                <div style={{
                  position: 'relative',
                  width: 0,
                  height: 0,
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderTop: '24px solid var(--color-text-primary)',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                  zIndex: 1
                }} />
              </div>

              <div
                onTransitionEnd={handleTransitionEnd}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--color-border)',
                  transition: 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: `rotate(${rotation}deg)`
                }}
              >
                <div style={{
                  content: '',
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  pointerEvents: 'none',
                  zIndex: 5
                }} />
                {wheelColors.map((color, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      width: '50%',
                      height: '50%',
                      transformOrigin: '100% 100%',
                      left: 0,
                      top: 0,
                      background: color.color,
                      transform: `rotate(${index * segmentAngle}deg) skew(${90 - segmentAngle}deg)`
                    }}
                  />
                ))}
              </div>

              <button
                onClick={spin}
                disabled={isSpinning}
                className={isSpinning ? 'spinning' : ''}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border-strong)',
                  cursor: isSpinning ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  zIndex: 25,
                  transition: 'all 0.4s var(--transition-smooth)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
                }}
                onMouseEnter={(e) => {
                  if (isSpinning) return;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(-50%, -50%)';
                  e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                }}
                onMouseDown={(e) => {
                  if (isSpinning) return;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  if (isSpinning) return;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
                }}
              >
                <span style={{
                  fontSize: '28px',
                  lineHeight: 1,
                  transition: 'transform 0.3s var(--transition-ease)',
                  animation: isSpinning ? 'spin 0.5s linear infinite' : 'none'
                }}>↻</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>{isSpinning ? 'Wait' : 'Spin'}</span>
              </button>
            </div>
          </section>

          <section style={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            backdropFilter: 'blur(20px)',
            animation: 'fade-in-up 0.8s var(--transition-ease) 0.2s both'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🎨</span>
                <h2 style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '-0.01em' }}>转盘颜色</h2>
              </div>
              <button
                onClick={randomizeColors}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--color-bg-elevated-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  transition: 'all 0.3s var(--transition-ease)',
                  transform: isRefreshing ? 'scale(0.95)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.background = 'var(--color-bg-elevated-hover)';
                }}
              >
                <RefreshIcon />
                <span>重新随机</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {wheelColors.map((color, index) => (
                <div key={index} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px 8px 6px',
                  background: 'var(--color-bg-elevated-hover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '20px',
                  fontSize: '13px',
                  transition: 'all 0.3s var(--transition-ease)'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    background: color.color
                  }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>{color.name}</span>
                  <button
                    onClick={() => removeWheelColor(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '18px',
                      lineHeight: 1,
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      transition: 'all 0.2s var(--transition-ease)',
                      padding: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'rgba(255,107,107,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              position: 'relative',
              height: '1px',
              background: 'var(--color-border)',
              margin: '24px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg)',
                padding: '0 12px',
                textTransform: 'lowercase'
              }}>or</span>
            </div>

            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>备选颜色</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>点击添加到转盘</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => addToWheel(index)}
                    role="button"
                    aria-label={`Add ${color.name} to wheel`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: '20px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s var(--transition-ease)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                      e.currentTarget.style.background = 'var(--color-bg-elevated-hover)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      background: color.color
                    }} />
                    <span style={{ color: 'var(--color-text-secondary)' }}>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer style={{
          padding: '32px 0 40px',
          textAlign: 'center',
          animation: 'fade-in-up 0.8s var(--transition-ease) 0.3s both'
        }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            转动转盘，抽取今日主题色，开启你的色彩漫步
          </p>
        </footer>
      </div>
    </>
  );
}
