
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer = ({ isOpen, onClose, onCheckout }: CartDrawerProps) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { toast } = useToast();

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    const { error } = await updateQuantity(productId, newQuantity);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const { error } = await removeFromCart(productId);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="ml-auto w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              {getTotalItems() > 0 && (
                <Badge className="bg-pink-500">
                  {getTotalItems()}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-2">Add some beautiful flowers to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.products.image_url || '/placeholder.svg'}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.products.name}</h3>
                      <p className="text-green-600 font-semibold">
                        ${item.products.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button 
                onClick={onCheckout}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
