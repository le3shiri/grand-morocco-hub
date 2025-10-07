import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const isAdmin = userRoles?.some(r => r.role === 'admin');
    if (!isAdmin) {
      navigate("/");
      return;
    }

    await loadCategories();
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editCategory) {
        const { error } = await supabase
          .from("categories")
          .update(formData)
          .eq("id", editCategory.id);

        if (error) throw error;
        toast.success("Category updated!");
      } else {
        const { error } = await supabase.from("categories").insert(formData);

        if (error) throw error;
        toast.success("Category created!");
      }

      setFormData({ name: "", description: "" });
      setEditCategory(null);
      setDialogOpen(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete all products in this category."))
      return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      toast.success("Category deleted!");
      loadCategories();
    } catch (error: any) {
      toast.error("Failed to delete category");
    }
  };

  const openDialog = (category?: any) => {
    if (category) {
      setEditCategory(category);
      setFormData({ name: category.name, description: category.description || "" });
    } else {
      setEditCategory(null);
      setFormData({ name: "", description: "" });
    }
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-8 font-rajdhani hover:text-neon-cyan"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO DASHBOARD
          </Button>

          <div className="flex justify-between items-center mb-8">
            <h1 className="font-orbitron font-black text-4xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              CATEGORIES
            </h1>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => openDialog()}
                  className="font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  NEW CATEGORY
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle className="font-orbitron text-2xl">
                    {editCategory ? "Edit Category" : "New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="bg-background"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
                  >
                    {editCategory ? "UPDATE" : "CREATE"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : categories.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border">
              <p className="font-rajdhani text-xl text-muted-foreground">
                No categories yet
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="p-6 bg-card border-border hover:border-neon-cyan transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-orbitron font-bold text-2xl mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-muted-foreground font-rajdhani">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openDialog(category)}
                        className="border-neon-purple hover:bg-neon-purple/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
                        className="border-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;