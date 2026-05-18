import { useState, useCallback } from 'react';
import type { DominantColor } from '../../../utils/color-extract';
import {
  exportColorsAsCSSVariables,
  exportColorsAsTailwindConfig,
} from '../../../utils/color-extract';

interface ColorExtractorProps {
  colors: DominantColor[];
}

type ExportFormat = 'css' | 'tailwind';

export function ColorExtractor({ colors }: ColorExtractorProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);
  const [exportCopied, setExportCopied] = useState(false);

  const handleCopyColor = useCallback(async (hex: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // fallback
    }
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const handleExport = useCallback(async (format: ExportFormat) => {
    setExportFormat(format);
    const text = format === 'css'
      ? exportColorsAsCSSVariables(colors)
      : exportColorsAsTailwindConfig(colors);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
    setExportCopied(true);
    setTimeout(() => {
      setExportCopied(false);
      setExportFormat(null);
    }, 1500);
  }, [colors]);

  if (colors.length === 0) {
    return (
      <div style={{
        padding: '16px',
        textAlign: 'center',
        color: 'var(--color-text-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        fontSize: '13px',
      }}>
        暂无色彩数据
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '10px',
      }}>
        {colors.map((c, i) => (
          <div
            key={c.hex}
            onClick={() => handleCopyColor(c.hex, i)}
            style={{
              flex: 1,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'transform 0.15s',
            }}
            title={c.hex}
          >
            <div style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: '6px',
              backgroundColor: c.hex,
              border: '1px solid var(--color-border)',
              position: 'relative',
            }}>
              {copiedIdx === i && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontFamily: "'Noto Sans SC', sans-serif",
                }}>
                  已复制
                </div>
              )}
            </div>
            <span style={{
              display: 'block',
              marginTop: '4px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--color-text-secondary)',
            }}>
              {c.hex}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => handleExport('css')}
          disabled={exportFormat !== null}
          style={{
            padding: '4px 10px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: exportFormat === 'css' && exportCopied
              ? 'var(--color-accent-secondary)'
              : 'var(--color-text-secondary)',
            fontSize: '12px',
            fontFamily: "'Noto Sans SC', sans-serif",
            cursor: 'pointer',
          }}
        >
          {exportFormat === 'css' && exportCopied ? '已复制' : 'CSS 变量'}
        </button>
        <button
          onClick={() => handleExport('tailwind')}
          disabled={exportFormat !== null}
          style={{
            padding: '4px 10px',
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            color: exportFormat === 'tailwind' && exportCopied
              ? 'var(--color-accent-secondary)'
              : 'var(--color-text-secondary)',
            fontSize: '12px',
            fontFamily: "'Noto Sans SC', sans-serif",
            cursor: 'pointer',
          }}
        >
          {exportFormat === 'tailwind' && exportCopied ? '已复制' : 'Tailwind 配置'}
        </button>
      </div>
    </div>
  );
}
