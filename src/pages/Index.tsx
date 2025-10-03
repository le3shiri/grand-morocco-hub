import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Car, Crosshair } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(3);

      if (error) throw error;
      setFeaturedProducts(data || []);
    } catch (error: any) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyProduct = async (productId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to make a purchase");
      navigate("/auth");
      return;
    }

    // Create order and trigger Discord webhook
    try {
      const { error } = await supabase
        .from("orders")
        .insert({ user_id: session.user.id, product_id: productId });

      if (error) throw error;

      toast.success("Purchase request sent! Check Discord for your ticket.");
    } catch (error: any) {
      toast.error("Failed to process purchase");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        <div className="relative z-10 text-center space-y-8 px-4 max-w-5xl">
          <h1 className="font-orbitron font-black text-6xl md:text-8xl bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-fade-in">
            NUPSIA
          </h1>
          <p className="font-rajdhani text-2xl md:text-3xl text-foreground/90 animate-fade-in">
            Premium Vehicles & Weapons for GTA Morocco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/catalogue")}
              className="font-rajdhani font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
            >
              BROWSE CATALOGUE
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="font-rajdhani font-bold text-lg border-neon-cyan hover:bg-neon-cyan/10"
            >
              LOGIN / REGISTER
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-card border border-border rounded-xl hover:border-neon-purple transition-all group">
              <Car className="w-12 h-12 text-neon-purple mb-4" />
              <h3 className="font-orbitron font-bold text-2xl mb-3 group-hover:text-neon-purple transition-colors">
                LUXURY VEHICLES
              </h3>
              <p className="font-rajdhani text-muted-foreground">
                High-performance supercars and sports vehicles for the ultimate roleplay experience
              </p>
            </div>
            <div className="p-8 bg-card border border-border rounded-xl hover:border-neon-cyan transition-all group">
              <Crosshair className="w-12 h-12 text-neon-cyan mb-4" />
              <h3 className="font-orbitron font-bold text-2xl mb-3 group-hover:text-neon-cyan transition-colors">
                PREMIUM WEAPONS
              </h3>
              <p className="font-rajdhani text-muted-foreground">
                High-quality firearms and pistols for professional operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <h2 className="font-orbitron font-black text-4xl md:text-5xl text-center mb-12 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            FEATURED PRODUCTS
          </h2>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  model={product.model}
                  description={product.description}
                  imageUrl={product.image_url}
                  youtubeLink={product.youtube_link}
                  onBuy={() => handleBuyProduct(product.id)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/catalogue")}
              className="font-rajdhani font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
            >
              VIEW ALL PRODUCTS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="font-rajdhani text-muted-foreground">
            © 2025 NUPSIA - GTA Morocco Server. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;