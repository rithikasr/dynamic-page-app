import { useEffect, useState } from "react";
import { fetchOrders } from "@/api/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [active, setActive] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setActive(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center gap-2 text-pink-600">
        <Loader2 className="animate-spin" /> Loading orders
      </div>
    );
  }

  const filtered = orders.filter((o) =>
    o.customer_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-[#FDF2F8] via-white to-[#FCE7F3]">
      <h1 className="text-4xl font-extrabold mb-8 text-[#111827]">
        Your Orders
      </h1>
      
  <Button
    onClick={() => navigate("/admin/products")}
    className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-6 py-2"
  >
    Manage Products
  </Button>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <Card className="col-span-4 rounded-3xl border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-4 h-4 text-pink-400" />
              <Input
                placeholder="Search email"
                className="pl-9 border-pink-200 focus:border-pink-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[520px] pr-2">
              <div className="space-y-3">
                {filtered.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => setActive(order)}
                    className={`p-4 rounded-2xl cursor-pointer transition border-2 ${
                      active?._id === order._id
                        ? "border-pink-500 bg-[#FDF2F8]"
                        : "border-transparent hover:bg-pink-50"
                    }`}
                  >
                    <p className="font-bold text-pink-600">
                      #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer_email}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold text-gray-700">
                        ₹{order.total_amount}
                      </span>
                      <Badge
                        className={
                          order.payment_status === "paid"
                            ? "bg-pink-100 text-pink-600"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card className="col-span-8 rounded-3xl border-0 shadow-xl bg-white">
          {active && (
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-pink-600">
                    Order #{active._id}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(active.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={
                    active.payment_status === "paid"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                      : "bg-amber-500 text-white"
                  }
                >
                  {active.payment_status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-2xl bg-[#FDF2F8]">
                  <p className="text-sm text-pink-500">Customer</p>
                  <p className="font-semibold text-gray-900">
                    {active.customer_email}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FCE7F3]">
                  <p className="text-sm text-pink-500">Total</p>
                  <p className="font-semibold text-pink-600">
                    ₹{active.total_amount}
                  </p>
                </div>
              </div>

              <h3 className="font-bold mb-4 text-lg text-gray-800">Items</h3>
              <div className="space-y-4">
                {active.order_items.map((item: any, idx: number) => (
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
          )}
        </Card>
      </div>
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { fetchOrders } from "@/api/admin";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Loader2, Package, Search } from "lucide-react";
// import { motion } from "framer-motion";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchOrders()
//       .then((data) => {
//         setOrders(data);
//         setFiltered(data);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     let updated = [...orders];

//     if (statusFilter !== "all") {
//       updated = updated.filter((order) => order.payment_status === statusFilter);
//     }

//     if (search.trim() !== "") {
//       updated = updated.filter((order) =>
//         order.customer_email.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     setFiltered(updated);
//   }, [statusFilter, search, orders]);

//   if (loading) {
//     return (
//       <div className="flex h-[70vh] items-center justify-center gap-2">
//         <Loader2 className="animate-spin w-6 h-6" />
//         <p className="text-lg">Loading orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-10 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-10 flex items-center gap-3">
//         <Package className="w-10 h-10" /> Order Management
//       </h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-5 rounded-xl shadow-sm">
//         <div className="relative w-full md:w-1/2">
//           <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//           <Input
//             placeholder="Search by customer email..."
//             className="pl-10"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <Select onValueChange={setStatusFilter} defaultValue="all">
//           <SelectTrigger className="w-full md:w-40">
//             <SelectValue placeholder="Filter Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="paid">Paid</SelectItem>
//             <SelectItem value="pending">Pending</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Orders Grid */}
//       <div className="grid gap-6">
//         {filtered.map((order) => (
//           <motion.div
//             key={order._id}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.25 }}
//           >
//             <Card className="shadow-md hover:shadow-xl transition-all rounded-2xl">
//               <CardHeader className="flex flex-row justify-between items-center">
//                 <div>
//                   <CardTitle className="text-xl">{order.customer_email}</CardTitle>
//                   <p className="text-gray-500 text-sm mt-1">
//                     {new Date(order.createdAt).toLocaleString()}
//                   </p>
//                 </div>

//                 <Badge
//                   className={
//                     order.payment_status === "paid"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }
//                 >
//                   {order.payment_status.toUpperCase()}
//                 </Badge>
//               </CardHeader>

//               <CardContent className="space-y-3">
//                 <p>
//                   <b>Total Amount:</b> ₹{order.total_amount}
//                 </p>
//                 <p>
//                   <b>Currency:</b> {order.currency.toUpperCase()}
//                 </p>
//                 <p>
//                   <b>Stripe Session:</b> {order.stripe_session_id}
//                 </p>

//                 <div className="mt-6">
//                   <h3 className="font-semibold mb-3 text-lg">Items</h3>

//                   <div className="space-y-3">
//                     {order.order_items.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between bg-gray-50 p-3 rounded-lg border hover:bg-gray-100"
//                       >
//                         <span className="font-medium">{item.product_name}</span>
//                         <span>
//                           {item.quantity} × ₹{item.unit_price}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {filtered.length === 0 && (
//         <p className="text-center text-gray-500 mt-10 text-lg">No orders found.</p>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;

// // import { useEffect, useState } from "react";
// // import { fetchOrders } from "@/api/admin";

// // const AdminOrders = () => {
// //   const [orders, setOrders] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //   fetchOrders()
// //     .then((orders) => {
// //       console.log("Orders received in component:", orders);
// //       setOrders(orders);
// //     })
// //     .finally(() => setLoading(false));
// // }, []);

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-[70vh]">
// //         <p className="text-lg animate-pulse">Loading orders...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-8 max-w-5xl mx-auto">
// //       <h1 className="text-4xl font-bold mb-8">📦 Order Management</h1>

// //       <div className="grid gap-6">
// //         {orders.map((order) => (
// //           <div
// //             key={order._id}
// //             className="
// //               border rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl
// //               transition-all duration-300
// //             "
// //           >
// //             {/* Header Row */}
// //             <div className="flex justify-between mb-4">
// //               <div>
// //                 <p className="text-lg font-semibold text-gray-800">
// //                   {order.customer_email}
// //                 </p>

// //                 <p className="text-sm text-gray-500 mt-1">
// //                   {new Date(order.createdAt).toLocaleString()}
// //                 </p>
// //               </div>

// //               {/* Status Badge */}
// //               <span
// //                 className={`
// //                   px-3 py-1 rounded-full text-sm font-semibold 
// //                   ${
// //                     order.payment_status === "paid"
// //                       ? "bg-green-100 text-green-700"
// //                       : "bg-yellow-100 text-yellow-700"
// //                   }
// //                 `}
// //               >
// //                 {order.payment_status.toUpperCase()}
// //               </span>
// //             </div>

// //             {/* Order Summary */}
// //             <div className="border-t pt-4">
// //               <p className="text-gray-700">
// //                 <b>Total Amount:</b> ₹{order.total_amount}
// //               </p>
// //               <p className="text-gray-700">
// //                 <b>Currency:</b> {order.currency.toUpperCase()}
// //               </p>
// //               <p className="text-gray-700">
// //                 <b>Stripe Session:</b> {order.stripe_session_id}
// //               </p>
// //             </div>

// //             {/* Order Items */}
// //             <div className="mt-6">
// //               <h3 className="font-semibold mb-2 text-lg">Items</h3>

// //               <ul className="space-y-3">
// //                 {order.order_items.map((item, index) => (
// //                   <li
// //                     key={index}
// //                     className="
// //                       flex justify-between bg-gray-50 p-3 rounded-lg
// //                       hover:bg-gray-100 transition
// //                     "
// //                   >
// //                     <span className="font-medium">{item.product_name}</span>
// //                     <span>
// //                       {item.quantity} × ₹{item.unit_price}
// //                     </span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {orders.length === 0 && (
// //         <p className="text-center text-gray-500 mt-10">
// //           No orders found.
// //         </p>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminOrders;


// // import { useEffect, useState } from "react";
// // import { fetchOrders } from "@/api/admin";

// // const AdminOrders = () => {
// //   const [orders, setOrders] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchOrders()
// //       .then(setOrders)
// //       .finally(() => setLoading(false));
// //   }, []);

// //   if (loading) return <p>Loading orders...</p>;

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-3xl font-bold mb-6">Order Management</h1>

// //       <div className="space-y-6">
// //         {orders.map((order) => (
// //           <div
// //             key={order.id}
// //             className="border rounded-xl p-6 bg-white shadow"
// //           >
// //             <div className="flex justify-between mb-3">
// //               <p className="font-semibold">{order.customer_email}</p>
// //               <p className="text-sm text-gray-500">
// //                 {new Date(order.created_at).toLocaleString()}
// //               </p>
// //             </div>

// //             <p>Status: <b>{order.payment_status}</b></p>
// //             <p>
// //               Total: <b>${order.total_amount}</b> {order.currency}
// //             </p>

// //             <div className="mt-4">
// //               <h3 className="font-semibold mb-2">Items</h3>
// //               <ul className="list-disc pl-5">
// //                 {order.order_items.map((item: any) => (
// //                   <li key={item.id}>
// //                     {item.product_name} × {item.quantity} — $
// //                     {item.unit_price}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminOrders;
