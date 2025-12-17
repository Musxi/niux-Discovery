
import React, { useState, useEffect, useMemo } from 'react';
import { DisplayItem } from '../types';
import ProjectCard from './ProjectCard';

interface MasonryGridProps {
  items: DisplayItem[];
  searchQuery?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, searchQuery }) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columnWrappers = useMemo(() => {
    const cols: DisplayItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, index) => {
      cols[index % columns].push(item);
    });
    return cols;
  }, [items, columns]);

  return (
    <div className="flex gap-6 items-start transition-opacity duration-300">
      {columnWrappers.map((colItems, colIndex) => (
        <div key={`col-${colIndex}-${items.length}`} className="flex-1 flex flex-col gap-6 min-w-0">
          {colItems.map((item) => (
            <div key={`${item.sourceType}-${item.id}`} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <ProjectCard project={item} searchQuery={searchQuery} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
