import { Calendar, Trash2, FolderKanban } from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  Pending: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  "In Progress": {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
    dot: "bg-blue-400",
  },
  Completed: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Overdue: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-500/30",
    dot: "bg-red-400",
  },
};

const statusOptions = ["Pending", "In Progress", "Completed", "Overdue"];

const TaskCard = ({ task, onStatusChange, onDelete, showProject = false, isAdmin = false }) => {
  const cfg = statusConfig[task.status] || statusConfig.Pending;

  return (
    <div className="task-card glass-card p-4 card-enter">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        <div
          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${cfg.bg} ${cfg.text} ${cfg.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {task.status}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
        {showProject && task.project && (
          <span className="flex items-center gap-1">
            <FolderKanban size={12} />
            {task.project.name || "Project"}
          </span>
        )}

        {task.assignedTo && (
          <span className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center text-[8px] text-white font-bold">
              {(task.assignedTo.username || "?").charAt(0).toUpperCase()}
            </div>
            {task.assignedTo.username || task.assignedTo.email}
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="glass-input text-sm py-1.5 px-3 flex-1 cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s} className="bg-gray-900 text-white">
                {s}
              </option>
            ))}
          </select>
        )}

        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
