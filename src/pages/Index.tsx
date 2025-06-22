
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Flower, Heart, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import ChatWindow from '@/components/ChatWindow';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const Index = () => {
  const { user, loading } = useAuth();
  const { products } = useProducts();
  const { getTotalItems } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showChat, setShowChat] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-green-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-pink-100 p-3 rounded-full">
                <Flower className="w-12 h-12 text-pink-500" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-pink-500">PetalTalk</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover beautiful flowers and arrangements while chatting directly with our expert florists 
              for personalized recommendations and custom orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowChat(true)}
                className="border-pink-500 text-pink-500 hover:bg-pink-50"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Florist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose PetalTalk?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Flower className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh & Beautiful</h3>
                <p className="text-gray-600">
                  Hand-picked fresh flowers and expertly crafted arrangements for every occasion.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Consultation</h3>
                <p className="text-gray-600">
                  Chat directly with our florists for personalized recommendations and custom designs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="bg-pink-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Made with Love</h3>
                <p className="text-gray-600">
                  Every arrangement is crafted with care and attention to make your moments special.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <Button variant="outline" className="group">
                View All
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Browse our collection or chat with a florist to design the perfect arrangement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-500 hover:bg-gray-100">
              Browse Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-pink-500"
              onClick={() => setShowChat(true)}
            >
              Start Conversation
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Prompt for Guest Users */}
      {!user && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join PetalTalk Today
            </h3>
            <p className="text-gray-600 mb-6">
              Create an account to save your favorites, track orders, and chat with florists
            </p>
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
              Sign Up Now
            </Button>
          </div>
        </section>
      )}

      {/* Floating Action Buttons */}
      {user && (
        <>
          <Button
            onClick={() => setShowCart(true)}
            className="fixed bottom-4 right-4 z-40 bg-pink-500 hover:bg-pink-600 rounded-full w-14 h-14 shadow-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Button>

          <Button
            onClick={() => setShowChat(true)}
            className="fixed bottom-20 right-4 z-40 bg-purple-500 hover:bg-purple-600 rounded-full w-14 h-14 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Drawers and Modals */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          // Navigate to checkout
        }}
      />

      <ChatWindow
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default Index;
