import { useState } from 'react';
import { getLogoPath } from '../../../data/camera-logos';

const LOGO_BRANDS = [
  'Nikon', 'Canon', 'Sony', 'Fujifilm',
  'Hasselblad', 'Leica', 'DJI', 'Ricoh',
];

interface LogoSelectorProps {
  isOpen: boolean;
  selectedLogo: string | null;
  onSelect: (logo: string | null) => void;
  onClose: () => void;
}

function LogoThumb({ brand }: { brand: string }) {
  const [failed, setFailed] = useState(false);
  const src = getLogoPath(brand);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt={brand}
      onError={() => setFailed(true)}
      style={{
        width: '64px', height: '64px',
        objectFit: 'contain', display: 'block',
        borderRadius: '6px',
      }}
    />
  );
}

export function LogoSelector({ isOpen, selectedLogo, onSelect, onClose }: LogoSelectorProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,8,16,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '560px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h3 style={{
          margin: '0 0 16px',
          color: 'var(--color-text-primary)',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: "'Noto Sans SC', sans-serif",
        }}>
          选择相机品牌
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
          gap: '10px',
        }}>
          {LOGO_BRANDS.map((brand) => {
            const isSelected = selectedLogo === brand;
            return (
              <button
                key={brand}
                onClick={() => {
                  onSelect(brand);
                  onClose();
                }}
                style={{
                  padding: '8px',
                  border: `2px solid ${isSelected ? 'var(--color-accent-secondary)' : 'transparent'}`,
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(78,205,196,0.1)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
              >
                <LogoThumb brand={brand} />
                <span style={{
                  fontSize: '10px',
                  color: 'var(--color-text-secondary)',
                  fontFamily: "'Noto Sans SC', sans-serif",
                }}>
                  {brand.replace(' Full', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
