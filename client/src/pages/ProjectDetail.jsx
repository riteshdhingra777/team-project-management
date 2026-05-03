import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectAPI, taskAPI } from "../api/api";
import { useAuth } from "../store/auth";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { ArrowLeft, Plus, UserPlus, Users, Trash2, ListTodo, Shield, Calendar } from "lucide-react";
import { format } from "date-fns";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "" });
  const [memberForm, setMemberForm] = useState({ email: "", role: "Member" });
  const [creating, setCreating] = useState(false);

  const isAdmin = project?.members?.some(
    (m) => (m.user?._id || m.user) === user?._id && m.role === "Admin"
  );

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getByProject(id),
      ]);
      setProject(projRes.project);
      setTasks(taskRes.tasks || []);
    } catch {
      toast.error("Could not load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return toast.warn("Task title is required");
    setCreating(true);
    try {
      await taskAPI.create({
        title: taskForm.title,
        description: taskForm.description,
        project: id,
        ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
        ...(taskForm.dueDate && { dueDate: taskForm.dueDate }),
      });
      toast.success("Task created");
      setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      setShowTaskModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Could not create task");
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberForm.email.trim()) return toast.warn("Email is required");
    setCreating(true);
    try {
      await projectAPI.addMember(id, memberForm);
      toast.success("Member added");
      setMemberForm({ email: "", role: "Member" });
      setShowMemberModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Could not add member");
    } finally {
      setCreating(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member from the project?")) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success("Member removed");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Could not remove member");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      toast.success("Task updated");
    } catch (err) {
      toast.error(err.message || "Could not update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskAPI.remove(taskId);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      toast.error(err.message || "Could not delete task");
    }
  };

  if (loading) return <div className="loading-screen"><span className="spinner" /></div>;

  if (!project) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 80 }}>
        <p className="empty-state-title">Project not found</p>
        <Link to="/projects" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Back to projects</Link>
      </div>
    );
  }

  const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <div className="page-container fade-in">
      <Link to="/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", color: "var(--text-tertiary)", marginBottom: 24, textDecoration: "none" }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-tertiary)"}
      >
        <ArrowLeft size={14} /> Back to projects
      </Link>

      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <p className="section-label" style={{ marginBottom: 0 }}>Project</p>
            {isAdmin && <span className="badge badge-accent">Admin</span>}
          </div>
          <h1 className="page-title">{project.name}</h1>
          {project.description && <p className="page-subtitle">{project.description}</p>}
          {project.createdAt && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={12} /> Created {format(new Date(project.createdAt), "MMM dd, yyyy")}
            </p>
          )}
        </div>
        {isAdmin && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowMemberModal(true)} className="btn btn-secondary btn-sm"><UserPlus size={14} /> Add member</button>
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> New task</button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }} className="detail-grid">
        {/* Members */}
        <div className="card" style={{ overflow: "hidden", alignSelf: "flex-start" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-primary)", display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={15} style={{ color: "var(--accent)" }} />
            <h2 style={{ fontSize: "0.875rem", fontWeight: 600 }}>Members ({project.members?.length || 0})</h2>
          </div>
          <div style={{ padding: 4 }}>
            {project.members?.map((m, i) => {
              const member = m.user || {};
              const memberId = member._id || m.user;
              return (
                <div key={memberId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, transition: "background-color 0.15s" }}
                  className="member-row"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div className="avatar avatar-md" style={{ backgroundColor: colors[i % colors.length] }}>
                    {(member.username || "?").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 500 }} className="line-clamp-1">{member.username || "Unknown"}</p>
                    <p style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)" }} className="line-clamp-1">{member.email || ""}</p>
                  </div>
                  <span className={`badge ${m.role === "Admin" ? "badge-accent" : "badge-neutral"}`} style={{ fontSize: "0.5625rem" }}>
                    {m.role === "Admin" && <Shield size={8} style={{ marginRight: 2 }} />}
                    {m.role}
                  </span>
                  {isAdmin && m.role !== "Admin" && (
                    <button onClick={() => handleRemoveMember(memberId)} className="icon-btn danger" style={{ width: 28, height: 28, opacity: 0 }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
              <ListTodo size={16} style={{ color: "var(--accent)" }} /> Tasks ({tasks.length})
            </h2>
          </div>
          {tasks.length === 0 ? (
            <div className="card empty-state">
              <ListTodo size={40} className="empty-state-icon" style={{ margin: "0 auto 12px" }} />
              <p className="empty-state-title">No tasks yet</p>
              <p className="empty-state-text">Create a task to start tracking work.</p>
              {isAdmin && (
                <button onClick={() => setShowTaskModal(true)} className="btn btn-primary btn-sm"><Plus size={14} /> Create task</button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="New task">
        <form onSubmit={handleCreateTask} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="What needs to be done?" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Add details…" className="form-textarea" rows={2} />
          </div>
          <div className="form-group">
            <label className="form-label">Assign to</label>
            <select value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="form-select">
              <option value="">Unassigned</option>
              {project.members?.map((m) => {
                const member = m.user || {};
                return <option key={member._id || m.user} value={member._id || m.user}>{member.username || member.email || "Unknown"} ({m.role})</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Due date</label>
            <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="form-input" />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => setShowTaskModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={creating} className="btn btn-primary" style={{ flex: 1 }}>
              {creating ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : "Create task"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Add member">
        <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} placeholder="teammate@company.com" className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="form-select">
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" onClick={() => setShowMemberModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={creating} className="btn btn-primary" style={{ flex: 1 }}>
              {creating ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : "Add member"}
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        .member-row:hover .icon-btn { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
