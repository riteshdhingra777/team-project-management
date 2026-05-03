import { Calendar, Trash2, FolderKanban } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  Pending: { badge: "badge-warning", dot: "var(--warning)" },
  "In Progress": { badge: "badge-info", dot: "var(--info)" },
  Completed: { badge: "badge-success", dot: "var(--success)" },
  Overdue: { badge: "badge-error", dot: "var(--error)" },
};

const statusOptions = ["Pending", "In Progress", "Completed", "Overdue"];

const TaskCard = ({ task, onStatusChange, onDelete, showProject = false, isAdmin = false }) => {
  const cfg = statusConfig[task.status] || statusConfig.Pending;

  return (
    <div className="card card-body slide-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)" }} className="line-clamp-1">
            {task.title}
          </h4>
          {task.description && (
            <p style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)", marginTop: 4 }} className="line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <span className={`badge ${cfg.badge}`} style={{ flexShrink: 0 }}>
          <span className="status-dot" style={{ backgroundColor: cfg.dot }} />
          {task.status}
        </span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
        {showProject && task.project && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FolderKanban size={12} />
            {task.project.name || "Project"}
          </span>
        )}
        {task.assignedTo && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div className="avatar avatar-sm" style={{ backgroundColor: "var(--accent)", width: 18, height: 18, fontSize: "0.5rem" }}>
              {(task.assignedTo.username || "?").charAt(0).toUpperCase()}
            </div>
            {task.assignedTo.username || task.assignedTo.email}
          </span>
        )}
        {task.dueDate && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={12} />
            {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </span>
        )}
      </div>

      <hr className="divider" style={{ margin: 0 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="form-select"
            style={{ flex: 1, height: 32, fontSize: "0.8125rem" }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        {isAdmin && onDelete && (
          <button onClick={() => onDelete(task._id)} className="btn btn-danger btn-sm" style={{ padding: "0 8px" }} title="Delete task">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
