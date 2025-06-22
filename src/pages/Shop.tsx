
import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import ChatWindow from '@/components/ChatWindow';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Shop = () => {
  const { user, loading } = useAuth();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const [showCart, setShowCart] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Flowers</h1>
            <p className="text-gray-600">Discover our beautiful collection of fresh flowers and arrangements</p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search flowers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="bouquets">Bouquets</SelectItem>
                  <SelectItem value="plants">Plants</SelectItem>
                  <SelectItem value="occasions">Occasions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {sortedProducts.length} of {products.length} products
            </p>
            {selectedCategory !== 'all' && (
              <Badge variant="outline" className="capitalize">
                {selectedCategory}
              </Badge>
            )}
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded"></div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4"
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Buttons */}
      <Button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 right-4 z-40 bg-pink-500 hover:bg-pink-600 rounded-full w-14 h-14 shadow-lg"
      >
        <Grid className="w-6 h-6" />
      </Button>

      <Button
        onClick={() => setShowChat(true)}
        className="fixed bottom-20 right-4 z-40 bg-purple-500 hover:bg-purple-600 rounded-full w-14 h-14 shadow-lg"
      >
        <Filter className="w-6 h-6" />
      </Button>

      {/* Drawers */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => setShowCart(false)}
      />

      <ChatWindow
        isOpen={showChat}
        onClose={() => setShowChat(false)}
      />
    </div>
  );
};

export default Shop;
