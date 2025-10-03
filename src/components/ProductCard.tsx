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
    <Card className="group overflow-hidden bg-card border-border hover:border-neon-cyan transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]">
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
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-orbitron font-bold text-xl text-foreground group-hover:text-neon-cyan transition-colors">
            {name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground font-rajdhani line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-rajdhani">MODEL</p>
            <p className="font-rajdhani font-semibold text-neon-purple">{model}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-rajdhani">PRICE</p>
            <p className="font-orbitron font-bold text-2xl text-neon-cyan">
              ${price.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onBuy}
            className="flex-1 font-rajdhani font-bold bg-gradient-to-r from-neon-purple to-neon-cyan hover:opacity-90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            BUY NOW
          </Button>
          {youtubeLink && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(youtubeLink, "_blank")}
              className="border-neon-purple hover:bg-neon-purple/10"
            >
              <Youtube className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};