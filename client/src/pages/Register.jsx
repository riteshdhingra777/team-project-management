import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";
import { authAPI } from "../api/api";
import { toast } from "react-toastify";
import { UserPlus, Mail, Lock, User, Phone, Zap, Sun, Moon } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { storeTokenInLS } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.register(form);
      storeTokenInLS(data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "username", label: "Full name", type: "text", icon: User, placeholder: "John Doe", auto: "name" },
    { name: "email", label: "Email address", type: "email", icon: Mail, placeholder: "you@company.com", auto: "email" },
    { name: "phone", label: "Phone number", type: "tel", icon: Phone, placeholder: "+91 9876543210", auto: "tel" },
    { name: "password", label: "Password", type: "password", icon: Lock, placeholder: "Min. 7 characters", auto: "new-password" },
  ];

  return (
    <div className="auth-page">
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <div className="auth-container">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "var(--accent)",
              marginBottom: 20,
            }}
          >
            <Zap size={24} color="white" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: 8 }}>
            Start managing projects with your team
          </p>
        </div>

        <form onSubmit={handleSubmit} id="register-form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label className="form-label" htmlFor={`register-${f.name}`}>{f.label}</label>
              <div className="form-input-icon">
                <f.icon size={15} className="input-icon" />
                <input
                  id={`register-${f.name}`}
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="form-input"
                  required
                  autoComplete={f.auto}
                />
              </div>
            </div>
          ))}

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: 8, height: 44 }}
          >
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><UserPlus size={16} /> Create account</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
