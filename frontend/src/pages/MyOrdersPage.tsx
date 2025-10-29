import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import orderApi from '../api/order';

type UserOrder = {
  id: number;
  title: string;
  price: number;
  status: string;
  completed: boolean;
  order_date: string;
  gig?: {
    id: number;
    title: string;
    image_url?: string;
  };
  seller?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getUserOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const getStatusBadge = (status: string, completed: boolean) => {
    if (completed) {
      return (
        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium">
          Completed
        </span>
      );
    }
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 font-medium">
            Pending
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800 font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your gig orders and their status</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">You haven&apos;t placed any orders yet.</p>
                <Button onClick={() => (window.location.href = '/search')}>Browse Gigs</Button>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      {order.gig?.image_url && (
                        <img
                          src={order.gig.image_url}
                          alt={order.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.title}</h3>

                        {order.seller && (
                          <div className="flex items-center space-x-3 mb-3">
                            {order.seller.profile_image && (
                              <img
                                src={order.seller.profile_image}
                                alt={order.seller.name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {order.seller.name}
                              </p>
                              <p className="text-sm text-gray-500">@{order.seller.username}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Order #{order.id}</span>
                          <span>•</span>
                          <span>Ordered on {new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-2">${order.price}</div>
                      <div className="mb-3">{getStatusBadge(order.status, order.completed)}</div>
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/orders/${order.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {order.completed && (
                          <Button
                            size="sm"
                            tone="primary"
                            onClick={() => window.open(`/gigs/${order.gig?.id}/review`, '_blank')}
                          >
                            <Star className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
