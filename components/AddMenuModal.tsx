import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import XIcon from './icons/XIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface MenuModalProps {
  onClose: () => void;
  onSave: (newItem: { name: string, cookTime: number }) => void;
  onDelete: () => void;
  context: {
    categoryName: string;
    itemToEdit?: MenuItem;
  }
}

const MenuModal: React.FC<MenuModalProps> = ({ context, onClose, onSave, onDelete }) => {
  const { categoryName, itemToEdit } = context;
  const isEditMode = !!itemToEdit;
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    if (isEditMode && itemToEdit) {
      setName(itemToEdit.name);
      setMinutes(Math.floor(itemToEdit.cookTime / 60).toString());
      setSeconds((itemToEdit.cookTime % 60).toString());
    }
  }, [isEditMode, itemToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = (parseInt(minutes, 10) || 0) * 60 + (parseInt(seconds, 10) || 0);
    if (name.trim() && totalSeconds > 0) {
      onSave({ name: name.trim(), cookTime: totalSeconds });
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('confirmDelete'))) {
      onDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? t('editMenuItem') : t('addMenuItem')}</h2>
        <p className="text-gray-400 mb-6">
          {isEditMode ? t('editingInCategory') : t('toCategory')} <span className="font-semibold text-white">{categoryName}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="menuName" className="block text-sm font-medium text-gray-300 mb-1">{t('menuName')}</label>
            <input
              type="text"
              id="menuName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('cookTime')}</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="MM"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-2xl font-bold text-gray-400">:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="SS"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
              >
                {t('delete')}
              </button>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {isEditMode ? t('saveChanges') : t('addItem')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;
