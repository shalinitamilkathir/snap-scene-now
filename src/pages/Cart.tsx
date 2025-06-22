
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';

const Cart = () => {
  const { user, loading } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a delivery address",
        variant: "destructive"
      });
      return;
    }

    // Here you would implement the actual checkout logic
    toast({
      title: "Order Placed!",
      description: "Your order has been successfully placed",
    });
    
    await clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingCart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some beautiful flowers to get started!</p>
                <Button className="bg-pink-500 hover:bg-pink-600">
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.products.image_url || '/placeholder.svg'}
                          alt={item.products.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.products.name}</h3>
                          <p className="text-green-600 font-semibold text-lg">
                            ${item.products.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
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
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            ${(item.products.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Checkout Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>$5.99</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(getTotalPrice() + 5.99).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter delivery address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Input
                        id="instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special requests..."
                      />
                    </div>
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      Place Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
