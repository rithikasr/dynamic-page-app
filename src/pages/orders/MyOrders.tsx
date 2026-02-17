import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package } from "lucide-react";
import { API_ENDPOINTS, getAuthHeaders, getAuthToken } from "@/constants/apiConstants";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price: number;
};

type Order = {
  _id: string;
  stripe_session_id: string;
  customer_email: string;
  total_amount: number;
  currency: string;
  payment_status: "paid" | "pending";
  order_items: OrderItem[];
  createdAt: string;
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    fetch(API_ENDPOINTS.ORDERS.MY_ORDERS, {
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center gap-2 text-pink-600">
        <Loader2 className="animate-spin" />
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-[#FDF2F8] via-white to-[#FCE7F3]">
      <h1 className="text-4xl font-extrabold mb-8 text-[#111827] flex items-center gap-3">
        <Package className="text-pink-500" />
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="rounded-3xl shadow-lg border-0 bg-white"
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-bold text-pink-600">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <Badge
                  className={
                    order.payment_status === "paid"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-amber-500 text-white"
                  }
                >
                  {order.payment_status.toUpperCase()}
                </Badge>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-2xl bg-[#FDF2F8]">
                  <p className="text-sm text-pink-500">Email</p>
                  <p className="font-semibold text-gray-900">
                    {order.customer_email}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCE7F3]">
                  <p className="text-sm text-pink-500">Total</p>
                  <p className="font-semibold text-pink-600">
                    ₹{order.total_amount} {order.currency.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <h3 className="font-bold mb-3 text-gray-800">Items</h3>
              <div className="space-y-3">
                {order.order_items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-[#FDF2F8] to-white"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.product_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-pink-600">
                      ₹{item.unit_price}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            You have no orders yet.
          </p>
        )}
      </div>
    </div>
  );
}
