import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { Gig } from '../../api/gig';

export type GigSellerInfoProps = {
  gig: Gig;
};

const GigSellerInfo = (props: GigSellerInfoProps) => {
  const { gig } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About the Seller</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">{gig.user.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{gig.user.name}</h3>
            <p className="text-sm text-gray-600">@{gig.user.username}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={14}
                    className={
                      i < Math.floor(gig.average_rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }
                  />
                ))}
                <span className="ml-1">{gig.average_rating}</span>
              </div>
              <span>({gig.total_reviews} reviews)</span>
            </div>
          </div>
        </div>

        {gig.user.description && (
          <p className="text-gray-700 text-sm mb-4">{gig.user.description}</p>
        )}

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Orders completed</span>
            <span className="font-medium">{gig.user.total_orders_completed || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member since</span>
            <span className="font-medium">
              {gig.user.created_at ? new Date(gig.user.created_at).getFullYear() : 'N/A'}
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4">
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default GigSellerInfo;
