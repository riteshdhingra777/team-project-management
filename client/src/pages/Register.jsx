import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { authAPI } from "../api/api";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, User, Phone, Zap, ArrowRight } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.register(form);
      storeTokenInLS(data.token);
      toast.success("Account created! 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Full Name", type: "text", icon: User, placeholder: "John Doe" },
    { name: "email", label: "Email", type: "email", icon: Mail, placeholder: "you@example.com" },
    { name: "phone", label: "Phone", type: "tel", icon: Phone, placeholder: "+91 9876543210" },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "••••••••" },
  ];

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-container glass-card p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">
            Join TeamTask and start collaborating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-sm text-gray-300 font-medium">
                {f.label}
              </label>
              <div className="relative">
                <f.icon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  id={`register-${f.name}`}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="glass-input pl-10"
                  required
                />
              </div>
            </div>
          ))}

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="glass-button w-full flex items-center justify-center gap-2 py-3 mt-2"
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            Sign in <ArrowRight size={14} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
