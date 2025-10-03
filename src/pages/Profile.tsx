import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ShoppingBag } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const [profileRes, ordersRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", session.user.id).single(),
        supabase
          .from("orders")
          .select("*, products(*)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
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
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-orbitron font-black text-5xl mb-12 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            PROFILE
          </h1>

          {/* Profile Card */}
          <Card className="p-8 mb-8 bg-card border-border">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <User className="w-10 h-10 text-background" />
              </div>
              <div>
                <h2 className="font-orbitron font-bold text-3xl mb-2">
                  {profile?.username}
                </h2>
                <Badge
                  variant={profile?.role === "admin" ? "default" : "secondary"}
                  className="font-rajdhani"
                >
                  {profile?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Orders */}
          <div>
            <h2 className="font-orbitron font-bold text-3xl mb-6 flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-neon-cyan" />
              PURCHASE HISTORY
            </h2>

            {orders.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border">
                <p className="font-rajdhani text-xl text-muted-foreground">
                  No purchases yet
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-6 bg-card border-border hover:border-neon-cyan transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-orbitron font-bold text-xl mb-1">
                          {order.products.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-rajdhani">
                          Model: {order.products.model}
                        </p>
                        <p className="text-sm text-muted-foreground font-rajdhani">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-orbitron font-bold text-2xl text-neon-cyan">
                          ${order.products.price.toLocaleString()}
                        </p>
                        <Badge className="mt-2">
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;