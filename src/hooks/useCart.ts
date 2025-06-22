
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('carts')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('carts')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;
      await fetchCart();
      return { error: null };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { error };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      if (quantity <= 0) {
        return await removeFromCart(productId);
      }

      const { error } = await supabase
        .from('carts')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCart();
      return { error: null };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { error };
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchCart();
      return { error: null };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { error };
    }
  };

  const clearCart = async () => {
    if (!user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCart();
      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error };
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: fetchCart
  };
};
