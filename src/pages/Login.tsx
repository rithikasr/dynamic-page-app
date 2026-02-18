import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants/apiConstants";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

        const from = location.state?.from?.pathname || "/";
        setMsg("Login successful! Redirecting...");
        setTimeout(() => navigate(from), 1500);
      } else {
        setMsg(data.message || "Invalid credentials");
      }
    } catch (error) {
      setMsg("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-xl border-0 bg-white/80 backdrop-blur-md">
        <CardContent>
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          {msg && <p className="mb-4 text-center text-primary">{msg}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border rounded-lg"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2 border rounded-lg"
                onChange={handleChange}
              />
              <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button className="w-full mt-4" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
