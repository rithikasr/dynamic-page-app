fetch("https://z0vx5pwf-3000.inc1.devtunnels.ms/admin/orders")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));