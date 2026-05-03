import { useEffect, useState } from "react";
import { taskAPI } from "../api/api";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import { ListTodo, Filter, Sparkles } from "lucide-react";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await taskAPI.getMyTasks();
        setTasks(data.tasks || []);
      } catch {
        toast.error("Failed to load tasks");
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
      toast.error(err.message || "Failed to update");
    }
  };

  const statuses = ["All", "Pending", "In Progress", "Completed", "Overdue"];

  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const statusCounts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Overdue: tasks.filter((t) => t.status === "Overdue").length,
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="animate-spin w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-cyan-400" />
          <span className="text-sm text-cyan-400 font-medium">My Tasks</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Tasks Assigned to You</h1>
        <p className="text-gray-400 mt-1">
          Track and manage all your assigned work
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Filter size={16} className="text-gray-500 self-center mr-1" />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === s
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
            }`}
          >
            {s}{" "}
            <span className="text-xs opacity-60">({statusCounts[s]})</span>
          </button>
        ))}
      </div>

      {/* Tasks */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ListTodo size={60} className="mx-auto mb-4 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">
            {filter === "All"
              ? "No tasks assigned yet"
              : `No ${filter.toLowerCase()} tasks`}
          </h2>
          <p className="text-gray-500">
            Tasks assigned to you will appear here
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task) => (
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
  );
};

export default MyTasks;
