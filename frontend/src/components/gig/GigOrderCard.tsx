import React from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { Gig } from '../../api/gig';

export type GigOrderCardProps = {
  gig: Gig;
  onOrderClick: () => void;
};

const GigOrderCard = (props: GigOrderCardProps) => {
  const { gig, onOrderClick } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order This Gig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-lg border-primary-500 bg-primary-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Standard Package</h3>
            <span className="text-2xl font-bold text-primary-600">${gig.price}</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{gig.short_description || gig.title}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Icon name="Clock" size={14} className="mr-1" />
            <span>{gig.delivery_time} day delivery</span>
          </div>
          {gig.revisions && (
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Icon name="RotateCcw" size={14} className="mr-1" />
              <span>
                {gig.revisions >= 999 || gig.revisions === -1
                  ? 'Unlimited revisions'
                  : `${gig.revisions} revisions`}
              </span>
            </div>
          )}
        </div>

        <Button tone="primary" className="w-full mt-6" size="lg" onClick={onOrderClick}>
          Order Now (${gig.price})
        </Button>

        <Button variant="outline" className="w-full mt-3">
          Contact Seller
        </Button>
      </CardContent>
    </Card>
  );
};

export default GigOrderCard;
