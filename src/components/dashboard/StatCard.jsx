export default function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 63, 127, 0.12)',
        border: 'none',
        borderTop: `4px solid ${color}`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 63, 127, 0.15)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 63, 127, 0.12)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', color: '#6c757d', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </p>
      </div>
      <div>
        <p
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: color,
            margin: 0,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
