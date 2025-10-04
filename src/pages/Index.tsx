import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingCart, Zap, Shield, Star } from "lucide-react";
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
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-8 inline-block">
            <div className="px-6 py-2 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/50 rounded-full backdrop-blur-sm">
              <p className="font-rajdhani text-sm tracking-widest text-neon-cyan">🎮 GTA MOROCCO OFFICIAL SERVER</p>
            </div>
          </div>
          
          <h1 className="font-orbitron font-black text-7xl md:text-9xl mb-6 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            NUPSIA
          </h1>
          
          <p className="font-rajdhani text-2xl md:text-4xl mb-4 text-foreground font-bold">
            Premium Marketplace
          </p>
          <p className="font-rajdhani text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto">
            Discover exclusive vehicles, weapons, and gear for the ultimate GTA Morocco experience
          </p>
          
          <div className="flex gap-6 justify-center flex-wrap">
            <Button 
              onClick={() => navigate("/catalogue")}
              size="lg"
              className="font-rajdhani font-bold text-lg px-8 py-6 bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              BROWSE CATALOGUE
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-neon-purple/10 to-transparent border border-neon-purple/20 hover:border-neon-purple/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center">
                <Shield className="w-8 h-8 text-background" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-2">Secure Trading</h3>
              <p className="font-rajdhani text-muted-foreground">Safe and instant delivery via Discord ticket system</p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-neon-cyan/10 to-transparent border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center">
                <Star className="w-8 h-8 text-background" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-2">Premium Quality</h3>
              <p className="font-rajdhani text-muted-foreground">Handpicked vehicles and weapons collection</p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-b from-neon-purple/10 to-transparent border border-neon-purple/20 hover:border-neon-purple/50 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan flex items-center justify-center">
                <Zap className="w-8 h-8 text-background" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-2">Instant Access</h3>
              <p className="font-rajdhani text-muted-foreground">Quick purchase process with video previews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-5xl md:text-6xl mb-4 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              FEATURED COLLECTION
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-purple to-neon-cyan mx-auto mb-4"></div>
            <p className="font-rajdhani text-xl text-muted-foreground">
              Exclusive items you won't find anywhere else
            </p>
          </div>
          
          {loading ? (
            <div className="text-center text-muted-foreground font-rajdhani text-lg">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

          <div className="text-center mt-16">
            <Button 
              onClick={() => navigate("/catalogue")}
              size="lg"
              className="font-rajdhani font-bold text-lg px-10 py-6 bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              VIEW ALL PRODUCTS
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-card/30">
        <div className="container mx-auto text-center">
          <h3 className="font-orbitron font-black text-3xl mb-4 bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            NUPSIA
          </h3>
          <p className="font-rajdhani text-muted-foreground mb-4">
            © 2025 NUPSIA - GTA Morocco Server. All rights reserved.
          </p>
          <p className="font-rajdhani text-sm text-muted-foreground">
            Built with ❤️ for the GTA Morocco community
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;