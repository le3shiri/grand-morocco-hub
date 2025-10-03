import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => setProfile(data));
    } else {
      setProfile(null);
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="text-3xl font-orbitron font-black bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            NUPSIA
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-rajdhani text-lg hover:text-neon-cyan transition-colors">
            HOME
          </Link>
          <Link to="/catalogue" className="font-rajdhani text-lg hover:text-neon-cyan transition-colors">
            CATALOGUE
          </Link>
          {profile?.role === "admin" && (
            <Link to="/admin" className="font-rajdhani text-lg hover:text-neon-purple transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" />
              ADMIN
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="hover:text-neon-cyan"
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
            >
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};