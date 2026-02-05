// src/components/admin/AdminAuthGuard.tsx
import { useState } from "react";
import AdminOrders from "@/pages/admin/Orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminAuthGuard() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid admin credentials");
    }
  };

  if (authorized) return <AdminOrders />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-pink-600">
            Admin Login
          </h2>

          <Input
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}