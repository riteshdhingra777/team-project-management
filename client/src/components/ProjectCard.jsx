import { Users, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, onDelete, currentUserId }) => {
  const isAdmin = project.members?.some(
    (m) => (m.user?._id || m.user) === currentUserId && m.role === "Admin"
  );
  const memberCount = project.members?.length || 0;

  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];
  const getColor = (i) => colors[i % colors.length];

  return (
    <div className="card card-interactive card-body slide-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }} className="line-clamp-1">
            {project.name}
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginTop: 4 }} className="line-clamp-2">
            {project.description || "No description added"}
          </p>
        </div>
        {isAdmin && <span className="badge badge-accent">Admin</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="avatar-stack">
          {project.members?.slice(0, 4).map((m, i) => (
            <div
              key={i}
              className="avatar avatar-sm"
              style={{ backgroundColor: getColor(i) }}
              title={m.user?.username || "Member"}
            >
              {(m.user?.username || "?").charAt(0).toUpperCase()}
            </div>
          ))}
          {memberCount > 4 && (
            <div className="avatar avatar-sm" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", fontSize: "0.5rem" }}>
              +{memberCount - 4}
            </div>
          )}
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
      </div>

      <hr className="divider" style={{ margin: 0 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
          Open <ArrowRight size={14} />
        </Link>
        {isAdmin && onDelete && (
          <button onClick={() => onDelete(project._id)} className="btn btn-danger btn-sm" title="Delete project" style={{ padding: "0 10px" }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
