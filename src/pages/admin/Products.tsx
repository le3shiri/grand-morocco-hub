import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", model: "", youtube_link: "",
    image_url: "", category_id: "", stock: "0"
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    const { data: userRoles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    const isAdmin = userRoles?.some(r => r.role === 'admin');
    if (!isAdmin) { navigate("/"); return; }
    await loadData();
  };

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from("products").select("*, categories(name)").order("name"),
        supabase.from("categories").select("*").order("name")
      ]);
      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) };
      if (editProduct) {
        const { error } = await supabase.from("products").update(data).eq("id", editProduct.id);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(data);
        if (error) throw error;
        toast.success("Product created!");
      }
      setFormData({ name: "", description: "", price: "", model: "", youtube_link: "", image_url: "", category_id: "", stock: "0" });
      setEditProduct(null);
      setDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted!");
      loadData();
    } catch (error: any) {
      toast.error("Failed to delete product");
    }
  };

  const openDialog = (product?: any) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name, description: product.description || "", price: product.price.toString(),
        model: product.model, youtube_link: product.youtube_link || "", image_url: product.image_url || "",
        category_id: product.category_id, stock: product.stock.toString()
      });
    } else {
      setEditProduct(null);
      setFormData({ name: "", description: "", price: "", model: "", youtube_link: "", image_url: "", category_id: "", stock: "0" });
    }
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-8 font-rajdhani hover:text-neon-cyan">
            <ArrowLeft className="w-4 h-4 mr-2" />BACK TO DASHBOARD
          </Button>
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-orbitron font-black text-4xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">PRODUCTS</h1>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openDialog()} className="font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />NEW PRODUCT
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="font-orbitron text-2xl">{editProduct ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-background" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-background" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Price</Label><Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="bg-background" /></div>
                    <div className="space-y-2"><Label>Stock</Label><Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required className="bg-background" /></div>
                  </div>
                  <div className="space-y-2"><Label>Model</Label><Input value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required className="bg-background" /></div>
                  <div className="space-y-2"><Label>Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
                      <SelectTrigger className="bg-background"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>{categories.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Image URL</Label><Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="bg-background" /></div>
                  <div className="space-y-2"><Label>YouTube Link</Label><Input value={formData.youtube_link} onChange={(e) => setFormData({...formData, youtube_link: e.target.value})} className="bg-background" /></div>
                  <Button type="submit" className="w-full font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90">{editProduct ? "UPDATE" : "CREATE"}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {loading ? <p className="text-center text-muted-foreground">Loading...</p> : products.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border"><p className="font-rajdhani text-xl text-muted-foreground">No products yet</p></Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-6 bg-card border-border hover:border-neon-cyan transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-orbitron font-bold text-xl mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground font-rajdhani">{product.categories?.name} • ${product.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => openDialog(product)} className="border-neon-purple hover:bg-neon-purple/10"><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="outline" onClick={() => handleDelete(product.id)} className="border-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-rajdhani">Model: {product.model} • Stock: {product.stock}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;