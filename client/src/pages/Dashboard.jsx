import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { projectAPI, taskAPI } from "../api/api";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

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
        // silently fail, show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await taskAPI.updateStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status } : t))
      );
      toast.success("Status updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="animate-spin w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">Dashboard</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {user?.username || "User"}
          </span>
        </h1>
        <p className="text-gray-400 mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={FolderKanban}
          label="Total Projects"
          value={projects.length}
          color="purple"
        />
        <StatsCard
          icon={ListTodo}
          label="My Tasks"
          value={tasks.length}
          color="cyan"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks}
          color="green"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={pendingTasks}
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FolderKanban size={18} className="text-purple-400" />
              Recent Projects
            </h2>
            <Link
              to="/projects"
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
              <p>No projects yet. Create your first!</p>
              <Link to="/projects" className="glass-button inline-block mt-3 text-sm">
                Create Project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((proj) => (
                <Link
                  key={proj._id}
                  to={`/projects/${proj._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-purple-400 font-bold text-sm">
                    {proj.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                      {proj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {proj.members?.length || 0} members
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-600 group-hover:text-purple-400 transition-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Tasks */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <ListTodo size={18} className="text-cyan-400" />
              My Tasks
            </h2>
            <Link
              to="/my-tasks"
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ListTodo size={40} className="mx-auto mb-3 opacity-30" />
              <p>No tasks assigned to you yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  showProject
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
