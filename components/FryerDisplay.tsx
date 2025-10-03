import React from 'react';
import { Fryer, FryerStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface FryerDisplayProps {
  fryer: Fryer;
  isSelectable: boolean;
  onSelect: (id: number) => void;
  onReset: (id: number) => void;
}

const getFryerColor = (fryer: Fryer): string => {
  switch (fryer.status) {
    case FryerStatus.READY:
      return 'bg-green-600';
    case FryerStatus.COOKING:
      const progress = (fryer.totalTime - fryer.remainingTime) / fryer.totalTime;
      if (progress < 0.2) return 'bg-orange-300';
      if (progress < 0.4) return 'bg-orange-400';
      if (progress < 0.6) return 'bg-orange-500';
      if (progress < 0.8) return 'bg-red-500';
      return 'bg-red-600';
    default:
      return 'bg-gray-700';
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const FryerDisplay: React.FC<FryerDisplayProps> = ({ fryer, isSelectable, onSelect, onReset }) => {
  const { t } = useLanguage();
  
  const isDone = fryer.status === FryerStatus.DONE;
  const colorClass = isDone ? '' : getFryerColor(fryer);
  const textColorClass = isDone ? '' : (fryer.status === FryerStatus.COOKING && (fryer.totalTime - fryer.remainingTime) / fryer.totalTime < 0.2 ? 'text-black' : 'text-white');

  const handleClick = () => {
    if (isSelectable && fryer.status === FryerStatus.READY) {
      onSelect(fryer.id);
    } else if (fryer.status === FryerStatus.DONE) {
      onReset(fryer.id);
    }
  };

  const cursorClass = isSelectable || fryer.status === FryerStatus.DONE ? 'cursor-pointer' : 'cursor-default';
  
  const getStatusText = (status: FryerStatus) => {
    switch(status) {
      case FryerStatus.READY:
        return t('ready');
      case FryerStatus.DONE:
        return t('done');
      default:
        return status;
    }
  }


  return (
    <div className="flex flex-col items-center space-y-2">
      <h2 className="text-lg font-bold text-gray-300">{t('fryer')} {fryer.id}</h2>
      <div
        onClick={handleClick}
        className={`w-full h-48 rounded-lg flex flex-col justify-center items-center p-2 text-center transition-all duration-300 transform ${cursorClass} ${isDone ? 'animate-blink-done' : `${colorClass} ${textColorClass}`} ${isSelectable ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''} hover:scale-105`}
      >
        {fryer.status === FryerStatus.COOKING ? (
          <>
            <div className="text-sm font-semibold -mt-2">{fryer.categoryName}</div>
            <div className="text-xl font-bold">{fryer.menuItem?.name}</div>
            <div className="text-5xl font-mono font-extrabold mt-2">{formatTime(fryer.remainingTime)}</div>
          </>
        ) : (
          <span className="text-4xl font-extrabold">{getStatusText(fryer.status)}</span>
        )}
      </div>
    </div>
  );
};

export default FryerDisplay;