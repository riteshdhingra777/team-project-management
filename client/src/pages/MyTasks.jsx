import { useEffect, useState } from "react";
import { taskAPI } from "../api/api";
import TaskCard from "../components/TaskCard";
import { toast } from "react-toastify";
import { ListTodo } from "lucide-react";

const statusOptions = ["All", "Pending", "In Progress", "Completed", "Overdue"];

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
        toast.error("Could not load tasks");
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

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    All: tasks.length,
    Pending: tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
    Overdue: tasks.filter((t) => t.status === "Overdue").length,
  };

  if (loading) return <div className="loading-screen"><span className="spinner" /></div>;

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: 24 }}>
        <p className="section-label">Tasks</p>
        <h1 className="page-title">My tasks</h1>
        <p className="page-subtitle">Track and manage work assigned to you</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: 20, fontSize: "0.8125rem" }}
          >
            {s}
            <span style={{ opacity: 0.6, fontSize: "0.6875rem", marginLeft: 4 }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={48} className="empty-state-icon" style={{ margin: "0 auto 12px" }} />
          <p className="empty-state-title">
            {filter === "All" ? "No tasks assigned" : `No ${filter.toLowerCase()} tasks`}
          </p>
          <p className="empty-state-text">Tasks assigned to you will show up here.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map((task) => (
            <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} showProject />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
