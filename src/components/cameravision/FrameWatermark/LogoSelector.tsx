import { logoToDataUrl } from '../../../utils/frame-renderer/logo-renderer';

const LOGO_BRANDS = [
  'Nikon', 'Nikon Full', 'Canon', 'Sony', 'Fujifilm',
  'Hasselblad', 'Hasselblad-T', 'Leica', 'Leica Full', 'Leica Red Full',
  'RED', 'RED Full', 'DJI', 'Insta360', 'Kodak',
  'Lumix', 'Mamiya', 'Olympus', 'Panasonic', 'Pentax',
  'Phase One', 'Ricoh', 'Rolleiflex', 'Sigma', 'Tamron', 'Zeiss Full',
];

interface LogoSelectorProps {
  isOpen: boolean;
  selectedLogo: string | null;
  onSelect: (logo: string | null) => void;
  onClose: () => void;
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
                <img
                  src={logoToDataUrl(brand)}
                  alt={brand}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '6px',
                    display: 'block',
                  }}
                />
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
