import React from 'react';

export type StatItem = {
  value: string;
  label: string;
};

const StatsSection = () => {
  const stats: StatItem[] = [
    { value: '4M+', label: 'Active buyers' },
    { value: '900K+', label: 'Professional services' },
    { value: '500K+', label: 'Projects completed' },
    { value: '4.9/5', label: 'Average rating' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
