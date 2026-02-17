import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(
        "https://z0vx5pwf-3000.inc1.devtunnels.ms/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (data.success) {
        setMsg("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1600);
      } else {
        setMsg(data.message || "Something went wrong");
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
          <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

          {msg && <p className="mb-4 text-center text-primary">{msg}</p>}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-2 border rounded-lg"
                onChange={handleChange}
              />
            </div>

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
            </div>

            <Button className="w-full mt-4" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
