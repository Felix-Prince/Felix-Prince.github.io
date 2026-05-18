import { useState, useCallback } from 'react';
import type { PhotoEntry } from '../../../utils/photo-entry-formatter';

interface PhotoEntryEditorProps {
  entry: PhotoEntry;
  onChange: (updated: PhotoEntry) => void;
}

function TagsInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = input.trim();
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }, [input, tags, onChange]);

  const removeTag = useCallback((idx: number) => {
    onChange(tags.filter((_, i) => i !== idx));
  }, [tags, onChange]);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '4px 6px',
      borderBottom: '1px solid var(--color-border)',
      minHeight: '28px',
      alignItems: 'center',
    }}>
      {tags.map((tag, i) => (
        <span
          key={tag}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '1px 6px',
            background: 'var(--color-bg-elevated)',
            borderRadius: '10px',
            fontSize: '12px',
            color: 'var(--color-text-primary)',
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          {tag}
          <button
            onClick={() => removeTag(i)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: 0,
              fontSize: '13px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? '输入标签，回车添加' : ''}
        style={{
          flex: 1,
          minWidth: '60px',
          border: 'none',
          background: 'none',
          color: 'var(--color-text-primary)',
          fontSize: '12px',
          fontFamily: "'Noto Sans SC', sans-serif",
          outline: 'none',
          padding: '2px 0',
        }}
      />
    </div>
  );
}

export function PhotoEntryEditor({ entry, onChange }: PhotoEntryEditorProps) {
  const [copied, setCopied] = useState(false);
  const jsonStr = JSON.stringify(entry, null, 2);

  const updateField = useCallback(
    (field: keyof PhotoEntry, value: string | string[]) => {
      onChange({ ...entry, [field]: value });
    },
    [entry, onChange],
  );

  const handleCopyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonStr);
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [jsonStr]);

  const handleDownloadJson = useCallback(() => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [jsonStr, entry.id]);

  return (
    <div>
      <h4 style={{
        margin: '0 0 10px',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--color-accent-secondary)',
        fontFamily: "'Noto Sans SC', sans-serif",
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        PhotoEntry 编辑器
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Auto fields (read-only) */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px 8px', fontSize: '12px' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}>ID</span>
          <span style={{ color: 'var(--color-text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{entry.id}</span>

          <span style={{ color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}>日期</span>
          <span style={{ color: 'var(--color-text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{entry.date}</span>

          <span style={{ color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}>相机</span>
          <span style={{ color: 'var(--color-text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{entry.camera}</span>

          <span style={{ color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}>参数</span>
          <span style={{ color: 'var(--color-text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{entry.settings}</span>
        </div>

        {/* Manual fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif", display: 'block', marginBottom: '2px' }}>
              标题
            </label>
            <input
              value={entry.title}
              onChange={(e) => updateField('title', e.target.value)}
              style={{
                width: '100%',
                padding: '4px 6px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                fontFamily: "'Noto Sans SC', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif", display: 'block', marginBottom: '2px' }}>
              标签
            </label>
            <TagsInput
              tags={entry.tags}
              onChange={(tags) => updateField('tags', tags)}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif", display: 'block', marginBottom: '2px' }}>
              描述
            </label>
            <textarea
              value={entry.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '4px 6px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontFamily: "'Noto Sans SC', sans-serif",
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif", display: 'block', marginBottom: '2px' }}>
              集合
            </label>
            <input
              value={entry.collection}
              onChange={(e) => updateField('collection', e.target.value)}
              style={{
                width: '100%',
                padding: '4px 6px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontFamily: "'Noto Sans SC', sans-serif",
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* JSON preview */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontFamily: "'Noto Sans SC', sans-serif" }}>
              JSON 预览
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleCopyJson}
                style={{
                  padding: '2px 8px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  color: copied ? 'var(--color-accent-secondary)' : 'var(--color-text-secondary)',
                  fontSize: '11px',
                  fontFamily: "'Noto Sans SC', sans-serif",
                  cursor: 'pointer',
                }}
              >
                {copied ? '已复制' : '复制 JSON'}
              </button>
              <button
                onClick={handleDownloadJson}
                style={{
                  padding: '2px 8px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '4px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '11px',
                  fontFamily: "'Noto Sans SC', sans-serif",
                  cursor: 'pointer',
                }}
              >
                下载 JSON
              </button>
            </div>
          </div>
          <pre style={{
            margin: 0,
            padding: '8px',
            background: 'rgba(5,8,16,0.4)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--color-text-primary)',
            overflow: 'auto',
            maxHeight: '200px',
            whiteSpace: 'pre',
          }}>
            {jsonStr}
          </pre>
        </div>
      </div>
    </div>
  );
}
