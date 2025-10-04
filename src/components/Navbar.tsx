import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src={logo} 
            alt="NUPSIA Logo" 
            className="h-16 w-auto transition-all duration-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.9)] group-hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="font-rajdhani text-lg font-bold hover:text-royal-gold transition-all relative group"
          >
            HOME
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-royal-gold to-amber-glow group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/catalogue" 
            className="font-rajdhani text-lg font-bold hover:text-royal-gold transition-all relative group"
          >
            CATALOGUE
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-royal-gold to-amber-glow group-hover:w-full transition-all duration-300"></span>
          </Link>
          {profile?.role === "admin" && (
            <Link 
              to="/admin" 
              className="font-rajdhani text-lg font-bold hover:text-deep-burgundy transition-all flex items-center gap-2 relative group"
            >
              <Shield className="w-4 h-4" />
              ADMIN
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-deep-burgundy to-royal-gold group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="hover:text-royal-gold hover:bg-royal-gold/10 transition-all rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:text-destructive hover:bg-destructive/10 transition-all rounded-full"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="font-rajdhani font-bold px-6 bg-gradient-to-r from-royal-gold to-amber-glow hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            >
              LOGIN
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};