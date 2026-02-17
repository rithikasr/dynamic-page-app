// 🔐 Get token stored after login
const getToken = () => localStorage.getItem("token");

export const fetchProducts = async () => {
  const res = await fetch(
    "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products",
    {
      headers: {
        "Content-Type": "application/json",
        //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODcxZjAzMTgxMmEzMzFmMmY3MTAzZiIsImVtYWlsIjoiaWFtcml5YXNoeWRlckBnbWFpbC5jb20iLCJpYXQiOjE3NzA2MzgyMDIsImV4cCI6MTc3MTI0MzAwMn0.ZGYxvF1wnrBL3FXxJrn4QNzEF1ZI7DTFs3ULbMMg9PU`,
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await res.json();
  return data.products || [];
};

export const createProduct = async (payload: any) => {
  const res = await fetch(
    "https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return res.json();
};

export const updateProduct = async (id: string, payload: any) => {
  const res = await fetch(
    `https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(
    `https://z0vx5pwf-3000.inc1.devtunnels.ms/api/products/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.json();
};
