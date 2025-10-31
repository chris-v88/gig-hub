import React from 'react';
import { Link } from 'react-router-dom';
import Icon, { type LucideIconName } from '../ui/Icon';

export type Category = {
  name: string;
  icon: LucideIconName;
  color: string;
  description: string;
};

const PopularCategoriesSection = () => {
  const popularCategories: Category[] = [
    {
      name: 'Graphic Design',
      icon: 'Palette',
      color: 'bg-purple-500',
      description: 'Logo design, branding & more',
    },
    {
      name: 'Web Development',
      icon: 'Code',
      color: 'bg-blue-500',
      description: 'Websites, web apps & more',
    },
    {
      name: 'Digital Marketing',
      icon: 'TrendingUp',
      color: 'bg-green-500',
      description: 'SEO, social media & ads',
    },
    {
      name: 'Video & Animation',
      icon: 'Video',
      color: 'bg-red-500',
      description: 'Video editing & animation',
    },
    {
      name: 'Writing & Translation',
      icon: 'PenTool',
      color: 'bg-yellow-500',
      description: 'Content writing & translation',
    },
    {
      name: 'Programming & Tech',
      icon: 'Code2',
      color: 'bg-indigo-500',
      description: 'Software development & tech',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular professional services</h2>
          <p className="text-lg text-gray-600">Get inspired by work done on GigHub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCategories.map((category) => (
            <Link
              key={category.name}
              to={`/search?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow group-hover:bg-gray-100">
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon name={category.icon} size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
                <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                  Explore <Icon name="ArrowRight" size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
