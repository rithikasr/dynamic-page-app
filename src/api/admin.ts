export const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token"); // get token from storage

    const res = await fetch(
      "https://z0vx5pwf-3000.inc1.devtunnels.ms/admin/orders",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ add token here
        },
      }
    );

    const data = await res.json();

    console.log("RAW API RESPONSE:", data);
    console.log("ORDERS ARRAY:", data.orders);

    if (!data.orders) return [];

    return data.orders;
  } catch (err) {
    console.error("Error fetching orders", err);
    return [];
  }
};



// export const fetchOrders = async () => {
//   const res = await fetch(
//     "https://z0vx5pwf-3000.inc1.devtunnels.ms/admin/orders",
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }
//   );

//   const data = await res.json();

//   console.log("RAW API RESPONSE:", data);        // debug
//   console.log("ORDERS ARRAY:", data.orders);     // debug

//   if (!data.orders) return [];                   // safety fallback

//   return data.orders;
// };


// export const fetchOrders = async () => {
//   const res = await fetch("https://z0vx5pwf-3000.inc1.devtunnels.ms/admin/orders");
//   const data = await res.json();
//   console.log("Fetched orders:", data.orders); // debug log
//   return data.orders; // ✅ return only the orders array
// };

// // export const fetchOrders = async () => {
// //   const res = await fetch(
// //     `${import.meta.env.VITE_API_URL}/admin/orders`,
// //     {
// //       headers: {
// //         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //       },
// //     }
// //   );

// //   if (!res.ok) throw new Error("Unauthorized");
// //   return res.json();
// // };
