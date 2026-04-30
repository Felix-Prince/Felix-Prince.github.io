export function Footer() {
  return (
    <footer style={{ padding: '80px 0 60px' }}>
      <div className="footer-content" style={{ textAlign: 'center' }}>
        <p style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            color: 'var(--color-text-muted)'
          }}>© 2024</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--color-text-secondary)'
          }}>Felix Prince</span>
        </p>
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          fontStyle: 'italic',
          letterSpacing: '0.02em'
        }}>Crafted with precision and passion</p>
      </div>
    </footer>
  );
}
