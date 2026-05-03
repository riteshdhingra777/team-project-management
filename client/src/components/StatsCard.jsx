const StatsCard = ({ icon: Icon, label, value, color = "accent" }) => {
  const colorMap = {
    accent: { bg: "var(--accent-subtle)", icon: "var(--accent)" },
    success: { bg: "var(--success-subtle)", icon: "var(--success)" },
    warning: { bg: "var(--warning-subtle)", icon: "var(--warning)" },
    error: { bg: "var(--error-subtle)", icon: "var(--error)" },
    info: { bg: "var(--info-subtle)", icon: "var(--info)" },
  };

  const c = colorMap[color] || colorMap.accent;

  return (
    <div className="card card-body" style={{ padding: "20px" }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: c.bg,
          color: c.icon,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Icon size={18} />
      </div>
      <p
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "0.8125rem",
          color: "var(--text-tertiary)",
          marginTop: 4,
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default StatsCard;
