import { Navbar } from "@/components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShoppingCart, Youtube, ArrowLeft, Package } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      if (productData.category_id) {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("*")
          .eq("id", productData.category_id)
          .single();
        setCategory(categoryData);
      }
    } catch (error: any) {
      console.error("Error loading product:", error);
      toast.error("Product not found");
      navigate("/catalogue");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to make a purchase");
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        .insert({ user_id: session.user.id, product_id: id });

      if (error) throw error;

      toast.success("Purchase request sent! Check Discord for your ticket.");
    } catch (error: any) {
      toast.error("Failed to process purchase");
      console.error(error);
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

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/catalogue")}
            className="mb-8 font-rajdhani hover:text-neon-cyan"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO CATALOGUE
          </Button>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {category && (
                <Badge className="font-rajdhani">{category.name}</Badge>
              )}

              <h1 className="font-orbitron font-black text-5xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <p className="font-orbitron font-bold text-5xl text-neon-cyan">
                  ${product.price.toLocaleString()}
                </p>
                <p className="text-muted-foreground font-rajdhani">
                  Stock: {product.stock} available
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground font-rajdhani">MODEL</p>
                  <p className="font-rajdhani font-bold text-xl text-neon-purple">
                    {product.model}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground font-rajdhani mb-2">
                    DESCRIPTION
                  </p>
                  <p className="font-rajdhani text-lg text-foreground/90">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  size="lg"
                  onClick={handleBuy}
                  disabled={product.stock === 0}
                  className="flex-1 font-rajdhani font-bold text-lg bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? "OUT OF STOCK" : "BUY NOW"}
                </Button>

                {product.youtube_link && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(product.youtube_link, "_blank")}
                    className="border-neon-purple hover:bg-neon-purple/10 font-rajdhani font-bold"
                  >
                    <Youtube className="w-5 h-5 mr-2" />
                    VIEW CLIP
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;