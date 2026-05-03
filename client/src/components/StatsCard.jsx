const StatsCard = ({ icon: Icon, label, value, color = "purple" }) => {
  const colorMap = {
    purple: "from-purple-500/20 to-purple-900/10 border-purple-500/30",
    cyan: "from-cyan-500/20 to-cyan-900/10 border-cyan-500/30",
    green: "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30",
    orange: "from-orange-500/20 to-orange-900/10 border-orange-500/30",
    pink: "from-pink-500/20 to-pink-900/10 border-pink-500/30",
  };

  const iconColorMap = {
    purple: "text-purple-400",
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    orange: "text-orange-400",
    pink: "text-pink-400",
  };

  return (
    <div
      className={`stats-card bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl bg-white/5 ${iconColorMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
};

export default StatsCard;
