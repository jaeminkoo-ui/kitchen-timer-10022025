import React from 'react';
import { LogEntry } from '../types';
import XIcon from './icons/XIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryModalProps {
  logs: LogEntry[];
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ logs, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 relative flex flex-col">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{t('cookingHistory')}</h2>
        
        <div className="flex-grow overflow-y-auto max-h-[75vh] pr-2">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">{t('noHistory')}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {logs.map(log => (
                <li key={log.id} className="bg-gray-700 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <p className="font-bold text-white">{log.itemName}</p>
                    <p className="text-sm text-gray-300">({log.categoryName})</p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>{t('fryer')} {log.fryerId}</p>
                    <p>{log.date} {t('at')} {log.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
