import { Users, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, onDelete, currentUserId }) => {
  const isAdmin = project.members?.some(
    (m) =>
      (m.user?._id || m.user) === currentUserId && m.role === "Admin"
  );

  const memberCount = project.members?.length || 0;

  return (
    <div className="project-card glass-card p-5 flex flex-col gap-4 card-enter">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {project.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
            {project.description || "No description"}
          </p>
        </div>
        {isAdmin && (
          <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
            Admin
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Users size={14} />
        <span>
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Member Avatars */}
      <div className="flex -space-x-2">
        {project.members?.slice(0, 5).map((m, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-2 border-[hsl(220,20%,10%)] flex items-center justify-center text-xs font-bold text-white"
            title={m.user?.username || "Member"}
          >
            {(m.user?.username || "?").charAt(0).toUpperCase()}
          </div>
        ))}
        {memberCount > 5 && (
          <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[hsl(220,20%,10%)] flex items-center justify-center text-xs text-gray-300">
            +{memberCount - 5}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
        <Link
          to={`/projects/${project._id}`}
          className="flex-1 glass-button text-center text-sm py-2 flex items-center justify-center gap-2"
        >
          View <ArrowRight size={14} />
        </Link>
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(project._id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
            title="Delete Project"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
