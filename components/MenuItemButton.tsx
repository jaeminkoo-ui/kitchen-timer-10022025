import React, { useState } from 'react';
import useLongPress from '../hooks/useLongPress';
import { useLanguage } from '../contexts/LanguageContext';


interface MenuItemButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onClick: () => void;
  onEdit: () => void;
  onDragStart: () => void;
  isBeingDragged?: boolean;
}

const MenuItemButton: React.FC<MenuItemButtonProps> = ({ children, onClick, onEdit, onDragStart, isBeingDragged, ...divProps }) => {
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const { t } = useLanguage();

  const handleLongPress = () => {
    setShowEditOverlay(true);
  };

  const longPressProps = useLongPress(handleLongPress, 2000);

  const handleClick = () => {
    if (!showEditOverlay) {
      onClick();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setShowEditOverlay(false);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditOverlay(false);
  };
  
  return (
    <div 
      className={`relative w-24 h-24 ${isBeingDragged ? 'opacity-30' : ''}`}
      draggable="true"
      onDragStart={onDragStart}
      {...divProps}
    >
      <button
        onClick={handleClick}
        {...longPressProps}
        className="w-full h-full p-2 flex justify-center items-center text-center bg-gray-800 border-2 border-gray-600 rounded-2xl text-white font-semibold cursor-grab active:cursor-grabbing hover:bg-gray-700 hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </button>
      {showEditOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl flex flex-col justify-center items-center space-y-2 z-10">
          <button
            onClick={handleEditClick}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('edit')}
          </button>
          <button
            onClick={handleCancelClick}
            className="bg-gray-600 text-white font-semibold py-1 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuItemButton;
