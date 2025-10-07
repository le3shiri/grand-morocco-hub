import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingBag, FolderOpen } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
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

      await loadStats();
    } catch (error) {
      navigate("/");
    }
  };

  const loadStats = async () => {
    try {
      const [usersRes, categoriesRes, productsRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        users: usersRes.count || 0,
        categories: categoriesRes.count || 0,
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
      });
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="font-rajdhani text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-orbitron font-black text-5xl mb-12 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            ADMIN DASHBOARD
          </h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 bg-card border-border hover:border-neon-cyan transition-colors">
              <Users className="w-10 h-10 text-neon-cyan mb-4" />
              <p className="text-sm text-muted-foreground font-rajdhani mb-1">USERS</p>
              <p className="font-orbitron font-bold text-4xl">{stats.users}</p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-neon-purple transition-colors">
              <FolderOpen className="w-10 h-10 text-neon-purple mb-4" />
              <p className="text-sm text-muted-foreground font-rajdhani mb-1">
                CATEGORIES
              </p>
              <p className="font-orbitron font-bold text-4xl">{stats.categories}</p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-neon-cyan transition-colors">
              <Package className="w-10 h-10 text-neon-cyan mb-4" />
              <p className="text-sm text-muted-foreground font-rajdhani mb-1">PRODUCTS</p>
              <p className="font-orbitron font-bold text-4xl">{stats.products}</p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-neon-purple transition-colors">
              <ShoppingBag className="w-10 h-10 text-neon-purple mb-4" />
              <p className="text-sm text-muted-foreground font-rajdhani mb-1">ORDERS</p>
              <p className="font-orbitron font-bold text-4xl">{stats.orders}</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="font-orbitron font-bold text-2xl mb-6">QUICK ACTIONS</h2>

            <Button
              onClick={() => navigate("/admin/categories")}
              size="lg"
              className="w-full justify-start font-rajdhani font-bold text-lg bg-card border border-border hover:border-neon-cyan hover:bg-card"
            >
              <FolderOpen className="w-5 h-5 mr-3" />
              MANAGE CATEGORIES
            </Button>

            <Button
              onClick={() => navigate("/admin/products")}
              size="lg"
              className="w-full justify-start font-rajdhani font-bold text-lg bg-card border border-border hover:border-neon-purple hover:bg-card"
            >
              <Package className="w-5 h-5 mr-3" />
              MANAGE PRODUCTS
            </Button>

            <Button
              onClick={() => navigate("/admin/orders")}
              size="lg"
              className="w-full justify-start font-rajdhani font-bold text-lg bg-card border border-border hover:border-neon-cyan hover:bg-card"
            >
              <ShoppingBag className="w-5 h-5 mr-3" />
              VIEW ORDERS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;