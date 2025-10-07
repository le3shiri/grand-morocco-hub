import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ShoppingCart, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  model: string;
  description: string;
  imageUrl?: string;
  youtubeLink?: string;
  onBuy: () => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  model,
  description,
  imageUrl,
  youtubeLink,
  onBuy,
}: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-sm border-border hover:border-royal-gold/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:-translate-y-2">
      <Link to={`/product/${id}`}>
        <div className="aspect-video overflow-hidden bg-muted relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-orbitron font-bold text-xl text-foreground group-hover:text-royal-gold transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground font-rajdhani line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-rajdhani mb-1">MODEL</p>
            <div className="px-3 py-1 bg-royal-gold/20 border border-royal-gold/50 rounded-full inline-block">
              <p className="font-rajdhani font-bold text-sm text-royal-gold">{model}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-rajdhani mb-1">PRICE</p>
            <p className="font-orbitron font-black text-3xl bg-gradient-to-r from-royal-gold to-amber-glow bg-clip-text text-transparent">
              ${price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={onBuy}
            className="flex-1 font-rajdhani font-bold bg-gradient-to-r from-royal-gold to-amber-glow text-background hover:opacity-90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            BUY NOW
          </Button>
          {youtubeLink && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(youtubeLink, "_blank")}
              className="border-royal-gold text-royal-gold hover:bg-royal-gold/10 transition-all"
            >
              <Youtube className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};