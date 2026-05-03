import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { projectAPI, taskAPI } from "../api/api";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import { FolderKanban, ListTodo, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectAPI.getAll(),
          taskAPI.getMyTasks(),
        ]);
        setProjects(projRes.projects || []);
        setTasks(taskRes.tasks || []);
      } catch {
        /* empty state handles it */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      toast.success("Task updated");
    } catch (err) {
      toast.error(err.message || "Could not update task");
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  if (loading) return <div className="loading-screen"><span className="spinner" /></div>;

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p className="section-label">Overview</p>
        <h1 className="page-title">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.username || "there"}
        </h1>
        <p className="page-subtitle">Here's what's happening across your projects.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatsCard icon={FolderKanban} label="Total projects" value={projects.length} color="accent" />
        <StatsCard icon={ListTodo} label="Assigned tasks" value={tasks.length} color="info" />
        <StatsCard icon={CheckCircle2} label="Completed" value={completedTasks} color="success" />
        <StatsCard icon={Clock} label="Pending" value={pendingTasks} color="warning" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="dashboard-grid">
        {/* Recent Projects */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-primary)" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <FolderKanban size={16} style={{ color: "var(--accent)" }} /> Recent projects
            </h2>
            <Link to="/projects" style={{ fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <FolderKanban size={36} className="empty-state-icon" style={{ margin: "0 auto 12px" }} />
              <p className="empty-state-title">No projects yet</p>
              <p className="empty-state-text">Create your first project to get started.</p>
              <Link to="/projects" className="btn btn-primary btn-sm">Create project</Link>
            </div>
          ) : (
            <div style={{ padding: 8 }}>
              {projects.slice(0, 5).map((proj) => (
                <Link
                  key={proj._id}
                  to={`/projects/${proj._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background-color 0.15s",
                  }}
                  className="project-row"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className="avatar avatar-md" style={{ backgroundColor: "var(--accent-subtle)", color: "var(--accent)", fontWeight: 700, fontSize: "0.75rem" }}>
                    {proj.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)" }} className="line-clamp-1">{proj.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{proj.members?.length || 0} members</p>
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-primary)" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <ListTodo size={16} style={{ color: "var(--info)" }} /> Your tasks
            </h2>
            <Link to="/my-tasks" style={{ fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <ListTodo size={36} className="empty-state-icon" style={{ margin: "0 auto 12px" }} />
              <p className="empty-state-title">No tasks yet</p>
              <p className="empty-state-text">Tasks assigned to you will appear here.</p>
            </div>
          ) : (
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {tasks.slice(0, 4).map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} showProject />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
