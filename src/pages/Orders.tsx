
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

const Orders = () => {
  const { user, loading } = useAuth();

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

  // Mock orders data - replace with actual hook
  const orders = [
    {
      id: '1',
      status: 'pending',
      total: 45.99,
      items: 2,
      date: '2024-01-15',
      address: '123 Main St, City, State'
    },
    {
      id: '2',
      status: 'delivered',
      total: 32.50,
      items: 1,
      date: '2024-01-10',
      address: '456 Oak Ave, City, State'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'delivered':
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h2>
                <p className="text-gray-500">Your order history will appear here once you make a purchase.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-medium">{order.items} item(s)</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-medium text-green-600">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="font-medium">{order.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
