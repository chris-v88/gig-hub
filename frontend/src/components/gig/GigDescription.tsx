import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { Gig } from '../../api/gig';

export type GigDescriptionProps = {
  gig: Gig;
};

const GigDescription = (props: GigDescriptionProps) => {
  const { gig } = props;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>About This Gig</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {gig.description.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-4 text-gray-700 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GigDescription;
