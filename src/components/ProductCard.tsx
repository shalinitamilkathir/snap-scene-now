
import { useState } from 'react';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: 'bouquets' | 'plants' | 'occasions';
  tags: string[] | null;
}

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const [loved, setLoved] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async () => {
    const { error } = await addToCart(product.id);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`
      });
    }
  };

  const categoryColors = {
    bouquets: 'bg-pink-100 text-pink-800',
    plants: 'bg-green-100 text-green-800',
    occasions: 'bg-purple-100 text-purple-800'
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-white">
      <div className="relative overflow-hidden">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white p-2"
            onClick={() => setLoved(!loved)}
          >
            <Heart className={`w-4 h-4 ${loved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
        <Badge className={`absolute top-2 left-2 ${categoryColors[product.category]}`}>
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={() => onViewDetails?.(product)}
          variant="outline"
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-pink-500 hover:bg-pink-600"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
