import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import type { Gig } from '../../api/gig';

export type GigBreadcrumbProps = {
  gig: Gig;
};

const GigBreadcrumb = (props: GigBreadcrumbProps) => {
  const { gig } = props;

  return (
    <nav className="mb-6">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-primary-600">
          Home
        </Link>
        <Icon name="ChevronRight" size={16} />
        <span>{gig.category.name}</span>
        <Icon name="ChevronRight" size={16} />
        <span className="text-gray-900">{gig.title}</span>
      </div>
    </nav>
  );
};

export default GigBreadcrumb;
