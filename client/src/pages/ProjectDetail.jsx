import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projectAPI, taskAPI } from "../api/api";
import { useAuth } from "../store/auth";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import {
  ArrowLeft, Plus, UserPlus, Users, Trash2,
  FolderKanban, ListTodo, Sparkles, Shield, Calendar,
} from "lucide-react";
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
      toast.error("Failed to load project");
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
      const body = {
        title: taskForm.title,
        description: taskForm.description,
        project: id,
        ...(taskForm.assignedTo && { assignedTo: taskForm.assignedTo }),
        ...(taskForm.dueDate && { dueDate: taskForm.dueDate }),
      };
      await taskAPI.create(body);
      toast.success("Task created!");
      setTaskForm({ title: "", description: "", assignedTo: "", dueDate: "" });
      setShowTaskModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to create task");
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
      toast.success("Member added!");
      setMemberForm({ email: "", role: "Member" });
      setShowMemberModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to add member");
    } finally {
      setCreating(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success("Member removed");
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to remove member");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
      toast.success("Status updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await taskAPI.remove(taskId);
      toast.success("Task deleted");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="animate-spin w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-xl text-gray-400">Project not found</h2>
        <Link to="/projects" className="glass-button inline-block mt-4">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Back + Header */}
      <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Project</span>
            {isAdmin && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">Admin</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          {project.description && <p className="text-gray-400 mt-1">{project.description}</p>}
          {project.createdAt && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Calendar size={12} /> Created {format(new Date(project.createdAt), "MMM dd, yyyy")}
            </p>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-2 self-start">
            <button onClick={() => setShowMemberModal(true)} className="glass-button-secondary flex items-center gap-2 text-sm">
              <UserPlus size={16} /> Add Member
            </button>
            <button onClick={() => setShowTaskModal(true)} className="glass-button flex items-center gap-2 text-sm">
              <Plus size={16} /> New Task
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Members Panel */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-1">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <Users size={18} className="text-cyan-400" /> Members ({project.members?.length || 0})
          </h2>
          <div className="space-y-2">
            {project.members?.map((m) => {
              const member = m.user || {};
              const memberId = member._id || m.user;
              return (
                <div key={memberId} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {(member.username || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{member.username || member.email || "Unknown"}</p>
                    <p className="text-xs text-gray-500 truncate">{member.email || ""}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${m.role === "Admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/10 text-gray-400 border border-white/10"}`}>
                    {m.role === "Admin" && <Shield size={8} className="inline mr-0.5 -mt-0.5" />}
                    {m.role}
                  </span>
                  {isAdmin && m.role !== "Admin" && (
                    <button onClick={() => handleRemoveMember(memberId)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all" title="Remove member">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks Panel */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ListTodo size={18} className="text-purple-400" /> Tasks ({tasks.length})
            </h2>
          </div>
          {tasks.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl text-center">
              <ListTodo size={50} className="mx-auto mb-3 text-gray-700" />
              <p className="text-gray-500 mb-4">No tasks yet for this project</p>
              {isAdmin && (
                <button onClick={() => setShowTaskModal(true)} className="glass-button inline-flex items-center gap-2 text-sm">
                  <Plus size={16} /> Create First Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} onDelete={handleDeleteTask} isAdmin={isAdmin} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Title</label>
            <input type="text" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="Task title" className="glass-input" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Description</label>
            <textarea value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Task description..." className="glass-input min-h-[80px] resize-none" rows={2} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Assign To</label>
            <select value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="glass-input cursor-pointer">
              <option value="" className="bg-gray-900">Unassigned</option>
              {project.members?.map((m) => {
                const member = m.user || {};
                return (
                  <option key={member._id || m.user} value={member._id || m.user} className="bg-gray-900">
                    {member.username || member.email || "Unknown"} ({m.role})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Due Date</label>
            <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="glass-input cursor-pointer" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowTaskModal(false)} className="glass-button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="glass-button flex-1 flex items-center justify-center gap-2">
              {creating ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><Plus size={16} /> Create</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal isOpen={showMemberModal} onClose={() => setShowMemberModal(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Email</label>
            <input type="email" value={memberForm.email} onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} placeholder="member@example.com" className="glass-input" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Role</label>
            <select value={memberForm.role} onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} className="glass-input cursor-pointer">
              <option value="Member" className="bg-gray-900">Member</option>
              <option value="Admin" className="bg-gray-900">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowMemberModal(false)} className="glass-button-secondary flex-1">Cancel</button>
            <button type="submit" disabled={creating} className="glass-button flex-1 flex items-center justify-center gap-2">
              {creating ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" /> : <><UserPlus size={16} /> Add</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
