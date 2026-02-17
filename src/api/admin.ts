import { API_ENDPOINTS, getAuthHeaders } from '../constants/apiConstants';

export const fetchOrders = async () => {
  try {
    const res = await fetch(API_ENDPOINTS.ADMIN.ORDERS, {
      method: "GET",
      headers: getAuthHeaders(),
    });

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

