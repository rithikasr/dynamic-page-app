import { useEffect, useState } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Pencil, PlusCircle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "inr",
    image: "",
    stock: "",
  });

  const [selectedId, setSelectedId] = useState("");

  const loadProducts = () => {
    setLoading(true);
    fetchProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreate = () => {
    setEditMode(false);
    setSelectedId("");
    setForm({
      name: "",
      description: "",
      price: "",
      currency: "inr",
      image: "",
      stock: "",
    });
    setOpen(true);
  };

  const openEdit = (p: any) => {
    setEditMode(true);
    setSelectedId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      currency: p.currency || "inr",
      image: p.image,
      stock: p.stock,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editMode) {
      await updateProduct(selectedId, payload);
    } else {
      await createProduct(payload);
    }

    setOpen(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Products</h1>

        <Button onClick={openCreate} className="gap-2 bg-pink-600">
          <PlusCircle />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center text-pink-600 gap-2">
          <Loader2 className="animate-spin" />
          Loading products...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Card
              key={p._id}
              className="rounded-3xl border-0 shadow-xl bg-white p-4"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded-2xl mb-4"
              />

              <h2 className="font-bold text-lg text-gray-800">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.description}</p>

              <p className="mt-2 font-semibold text-pink-600">
                ₹{p.price} — Stock: {p.stock}
              </p>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => openEdit(p)}
                  className="gap-2"
                >
                  <Pencil size={18} />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p._id)}
                  className="gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {["name", "description", "image"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  value={(form as any)[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} className="bg-pink-600">
              {editMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
