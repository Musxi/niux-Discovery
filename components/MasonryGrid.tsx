
import React, { useState, useEffect, useMemo } from 'react';
import { DisplayItem } from '../types';
import ProjectCard from './ProjectCard';

interface MasonryGridProps {
  items: DisplayItem[];
  searchQuery?: string;
  onSelect?: (id: number) => void;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items, searchQuery, onSelect }) => {
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
    <div className="flex gap-4 sm:gap-6 items-start">
      {columnWrappers.map((colItems, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          {colItems.map((item) => (
            <ProjectCard key={item.id} project={item} searchQuery={searchQuery} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
