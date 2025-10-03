import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/auth"); return; }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (profile?.role !== "admin") { navigate("/"); return; }
    await loadOrders();
  };

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase.from("orders").select("*, profiles(username), products(name, price, model)").order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-8 font-rajdhani hover:text-neon-cyan">
            <ArrowLeft className="w-4 h-4 mr-2" />BACK TO DASHBOARD
          </Button>
          <h1 className="font-orbitron font-black text-4xl mb-8 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">ORDERS</h1>
          {loading ? <p className="text-center text-muted-foreground">Loading...</p> : orders.length === 0 ? (
            <Card className="p-12 text-center bg-card border-border"><p className="font-rajdhani text-xl text-muted-foreground">No orders yet</p></Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 bg-card border-border hover:border-neon-cyan transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-orbitron font-bold text-xl">{order.products.name}</h3>
                      <p className="text-sm text-muted-foreground font-rajdhani">User: {order.profiles.username}</p>
                      <p className="text-sm text-muted-foreground font-rajdhani">Model: {order.products.model}</p>
                      <p className="text-sm text-muted-foreground font-rajdhani">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-orbitron font-bold text-2xl text-neon-cyan">${order.products.price.toLocaleString()}</p>
                      <Badge>{order.status.toUpperCase()}</Badge>
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

export default Orders;