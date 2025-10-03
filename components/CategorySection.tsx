import React from 'react';
import { Category, MenuItem } from '../types';
import MenuItemButton from './MenuItemButton';
import PlusIcon from './icons/PlusIcon';
import useLongPress from '../hooks/useLongPress';

interface CategorySectionProps {
  category: Category;
  draggedItemId: string | null | undefined;
  onMenuItemSelect: (item: MenuItem, category: Category) => void;
  onAddMenuItem: () => void;
  onEditMenuItem: (item: MenuItem) => void;
  onEditCategory: () => void;
  onDragStart: (item: MenuItem, categoryId: string) => void;
  onDrop: (targetCategoryId: string, targetItemId: string | null) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  category, 
  draggedItemId,
  onMenuItemSelect, 
  onAddMenuItem, 
  onEditMenuItem,
  onEditCategory,
  onDragStart,
  onDrop
}) => {
  const longPressProps = useLongPress(onEditCategory, 2000);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const targetElement = e.target as HTMLElement;
    const targetItemElement = targetElement.closest('[data-item-id]');
    const targetId = targetItemElement ? targetItemElement.getAttribute('data-item-id') : null;
    onDrop(category.id, targetId);
  };
  
  return (
    <div className="border-t border-gray-700 pt-4">
      <h3 
        {...longPressProps}
        className="text-2xl font-bold uppercase tracking-wider mb-4 cursor-pointer active:cursor-grabbing"
        title="Long press to edit name"
      >
        {category.name}
      </h3>
      <div 
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {category.items.map(item => (
          <MenuItemButton 
            key={item.id}
            isBeingDragged={draggedItemId === item.id}
            onClick={() => onMenuItemSelect(item, category)}
            onEdit={() => onEditMenuItem(item)}
            onDragStart={() => onDragStart(item, category.id)}
            data-item-id={item.id}
          >
            {item.name}
          </MenuItemButton>
        ))}
        <button
          onClick={onAddMenuItem}
          className="w-24 h-24 flex justify-center items-center bg-gray-700 border-2 border-dashed border-gray-500 rounded-2xl text-gray-400 hover:bg-gray-600 hover:border-gray-400 transition-colors"
        >
          <PlusIcon className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default CategorySection;
