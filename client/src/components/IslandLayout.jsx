import React from 'react';

const IslandLayout = ({ title, children }) => {
  return (
    <div className="card p-6 space-y-4">
      <h3 className="tech-heading text-xl mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default IslandLayout; 