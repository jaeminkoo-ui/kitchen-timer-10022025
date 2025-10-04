import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Fryer, MenuItem, Category, LogEntry, FryerStatus } from './types';
import { INITIAL_CATEGORIES } from './constants';
import FryerDisplay from './components/FryerDisplay';
import CategorySection from './components/CategorySection';
import MenuModal from './components/AddMenuModal';
import HistoryModal from './components/HistoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import LanguageSelector from './components/LanguageSelector';
import XIcon from './components/icons/XIcon';
import LoginScreen from './components/LoginScreen';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [fryers, setFryers] = useState<Fryer[]>(
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      status: FryerStatus.READY,
      remainingTime: 0,
      totalTime: 0,
    }))
  );
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [pendingMenuItem, setPendingMenuItem] = useState<{ item: MenuItem; category: Category } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuModalContext, setMenuModalContext] = useState<{ category: Category, itemToEdit?: MenuItem } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [draggedItemInfo, setDraggedItemInfo] = useState<{ item: MenuItem; categoryId: string } | null>(null);

  const { t, language } = useLanguage();

  const alarmSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    alarmSound.current = new Audio('https://cdn.freesound.org/previews/249/249589_4198850-lq.mp3');
  }, []);

  // Check for logged in user on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('KITCHEN_TIMER_LOGGED_IN_USER');
    if (loggedInUser) {
        const userData = localStorage.getItem(`KITCHEN_TIMER_USER_DATA_${loggedInUser}`);
        if (userData) {
            setCategories(JSON.parse(userData));
        } else {
            setCategories(INITIAL_CATEGORIES);
        }
        setCurrentUser(loggedInUser);
    }
  }, []);

  // Save categories to localStorage whenever they change for the current user
  useEffect(() => {
    if (currentUser) {
        localStorage.setItem(`KITCHEN_TIMER_USER_DATA_${currentUser}`, JSON.stringify(categories));
    }
  }, [categories, currentUser]);
  
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: { [key: string]: string } = { en: 'en-US', es: 'es-ES', ko: 'ko-KR' };
      utterance.lang = langMap[language] || 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, [language]);


  useEffect(() => {
    const timerId = setInterval(() => {
      setFryers(currentFryers =>
        currentFryers.map(fryer => {
          if (fryer.status === FryerStatus.COOKING && fryer.remainingTime > 0) {
            const newRemainingTime = fryer.remainingTime - 1;
            if (newRemainingTime <= 0) {
              if (alarmSound.current) {
                alarmSound.current.play();
              }
              const message = t('fryerDoneMessage').replace('{fryerId}', fryer.id.toString());
              speak(message);

              const now = new Date();
              const newLog: LogEntry = {
                id: `log-${Date.now()}`,
                date: now.toLocaleDateString(),
                time: now.toLocaleTimeString(),
                fryerId: fryer.id,
                categoryName: fryer.categoryName || 'Unknown',
                itemName: fryer.menuItem?.name || 'Unknown',
              };
              setLogs(prevLogs => [newLog, ...prevLogs]);

              return { ...fryer, status: FryerStatus.DONE, remainingTime: 0 };
            }
            return { ...fryer, remainingTime: newRemainingTime };
          }
          return fryer;
        })
      );
    }, 1000);

    return () => clearInterval(timerId);
  }, [t, speak]);

  const handleLogin = (email: string, password: string) => {
    setAuthError(null);
    const users = JSON.parse(localStorage.getItem('KITCHEN_TIMER_USERS') || '{}');
    if (users[email] && users[email] === password) {
      const userData = localStorage.getItem(`KITCHEN_TIMER_USER_DATA_${email}`);
      if (userData) {
          setCategories(JSON.parse(userData));
      } else {
          setCategories(INITIAL_CATEGORIES);
          localStorage.setItem(`KITCHEN_TIMER_USER_DATA_${email}`, JSON.stringify(INITIAL_CATEGORIES));
      }
      setCurrentUser(email);
      localStorage.setItem('KITCHEN_TIMER_LOGGED_IN_USER', email);
    } else {
      setAuthError(t('invalidCredentials'));
    }
  };

  const handleSignUp = (email: string, password: string) => {
    setAuthError(null);
    const users = JSON.parse(localStorage.getItem('KITCHEN_TIMER_USERS') || '{}');
    if (users[email]) {
        setAuthError(t('emailAlreadyExists'));
    } else {
        users[email] = password; // In a real app, hash this password
        localStorage.setItem('KITCHEN_TIMER_USERS', JSON.stringify(users));
        
        // Create initial data for the new user
        localStorage.setItem(`KITCHEN_TIMER_USER_DATA_${email}`, JSON.stringify(INITIAL_CATEGORIES));
        
        // Automatically log in after successful sign-up
        handleLogin(email, password);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('KITCHEN_TIMER_LOGGED_IN_USER');
  };

  const handleMenuItemSelect = (item: MenuItem, category: Category) => {
    const allFryersBusy = fryers.every(f => f.status !== FryerStatus.READY);
    if (allFryersBusy) {
        const message = t('allFryersBusy');
        setNotification(message);
        speak(message);
        setTimeout(() => setNotification(null), 4000);
        return;
    }
    setPendingMenuItem({ item, category });
    setNotification(null);
  };

  const handleFryerSelect = (fryerId: number) => {
    if (pendingMenuItem) {
      setFryers(currentFryers =>
        currentFryers.map(fryer => {
          if (fryer.id === fryerId && fryer.status === FryerStatus.READY) {
            return {
              ...fryer,
              status: FryerStatus.COOKING,
              menuItem: pendingMenuItem.item,
              categoryName: pendingMenuItem.category.name,
              totalTime: pendingMenuItem.item.cookTime,
              remainingTime: pendingMenuItem.item.cookTime,
            };
          }
          return fryer;
        })
      );
      setPendingMenuItem(null);
    }
  };

  const handleFryerReset = (fryerId: number) => {
    setFryers(currentFryers =>
      currentFryers.map(fryer =>
        fryer.id === fryerId && fryer.status === FryerStatus.DONE
          ? { ...fryer, status: FryerStatus.READY, menuItem: null, categoryName: null, totalTime: 0, remainingTime: 0 }
          : fryer
      )
    );
  };

  const handleRequestAddItem = (category: Category) => {
    setMenuModalContext({ category });
    setIsMenuModalOpen(true);
  };

  const handleRequestEditItem = (item: MenuItem, category: Category) => {
    setMenuModalContext({ category, itemToEdit: item });
    setIsMenuModalOpen(true);
  };

  const handleCloseMenuModal = () => {
    setIsMenuModalOpen(false);
    setMenuModalContext(null);
  };

  const handleSaveMenuItem = (data: { name: string; cookTime: number }) => {
    if (!menuModalContext) return;
    const { category, itemToEdit } = menuModalContext;

    if (itemToEdit) {
      setCategories(cats => cats.map(cat => 
        cat.id === category.id
          ? { ...cat, items: cat.items.map(it => it.id === itemToEdit.id ? { ...it, ...data } : it) }
          : cat
      ));
    } else {
      setCategories(cats => cats.map(cat => 
        cat.id === category.id
          ? { ...cat, items: [...cat.items, { ...data, id: `item-${Date.now()}` }] }
          : cat
      ));
    }
    handleCloseMenuModal();
  };

  const handleDeleteMenuItem = () => {
    if (!menuModalContext || !menuModalContext.itemToEdit) return;
    const { category, itemToEdit } = menuModalContext;

    setCategories(cats => cats.map(cat => 
      cat.id === category.id
        ? { ...cat, items: cat.items.filter(it => it.id !== itemToEdit.id) }
        : cat
    ));
    handleCloseMenuModal();
  };
  
  const handleRequestEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleUpdateCategoryName = (newName: string) => {
    if (!editingCategory) return;
    setCategories(cats => cats.map(cat => 
      cat.id === editingCategory.id ? { ...cat, name: newName } : cat
    ));
    setIsEditCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleDragStart = (item: MenuItem, categoryId: string) => {
    setDraggedItemInfo({ item, categoryId });
  };

  const handleDrop = (targetCategoryId: string, targetItemId: string | null) => {
    if (!draggedItemInfo) return;

    const { item: draggedItem, categoryId: sourceCategoryId } = draggedItemInfo;
    
    if (sourceCategoryId !== targetCategoryId) {
      setDraggedItemInfo(null);
      return;
    }

    setCategories(prevCategories => {
        const newCategories = [...prevCategories];
        const categoryIndex = newCategories.findIndex(c => c.id === sourceCategoryId);
        if (categoryIndex === -1) return prevCategories;

        const sourceCategory = newCategories[categoryIndex];
        const items = sourceCategory.items.filter(i => i.id !== draggedItem.id);

        let dropIndex = items.findIndex(i => i.id === targetItemId);
        if (dropIndex === -1) {
            dropIndex = items.length;
        }

        items.splice(dropIndex, 0, draggedItem);
        
        newCategories[categoryIndex] = { ...sourceCategory, items };
        return newCategories;
    });

    setDraggedItemInfo(null);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onSignUp={handleSignUp} authError={authError} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8 font-sans">
      {isMenuModalOpen && menuModalContext && (
        <MenuModal
          context={{...menuModalContext, categoryName: menuModalContext.category.name}}
          onClose={handleCloseMenuModal}
          onSave={handleSaveMenuItem}
          onDelete={handleDeleteMenuItem}
        />
      )}
      {isHistoryOpen && (
        <HistoryModal logs={logs} onClose={() => setIsHistoryOpen(false)} />
      )}
      {isEditCategoryModalOpen && editingCategory && (
        <EditCategoryModal 
          category={editingCategory}
          onClose={() => setIsEditCategoryModalOpen(false)}
          onSave={handleUpdateCategoryName}
        />
      )}

      <header className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">{t('fryerDashboard')}</h1>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {t('history')}
          </button>
           <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </header>

      {notification && (
        <div className="fixed top-0 left-0 w-full bg-yellow-600 p-3 text-center text-black z-50 flex justify-center items-center shadow-lg">
          <span className="font-bold text-lg">{notification}</span>
        </div>
      )}

      {pendingMenuItem && (
        <div className="fixed top-0 left-0 w-full bg-blue-600 p-3 text-center text-white z-50 flex justify-center items-center shadow-lg">
          <span className="font-bold text-lg">{t('selectReadyFryerFor')} {pendingMenuItem.item.name}</span>
          <button onClick={() => setPendingMenuItem(null)} className="ml-4 p-1 rounded-full hover:bg-blue-700 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
      )}
      
      <div className={`grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8 ${(pendingMenuItem || notification) ? 'mt-16' : ''}`}>
        {fryers.map(fryer => (
          <FryerDisplay
            key={fryer.id}
            fryer={fryer}
            isSelectable={pendingMenuItem !== null && fryer.status === FryerStatus.READY}
            onSelect={handleFryerSelect}
            onReset={handleFryerReset}
          />
        ))}
      </div>

      <div className="space-y-8">
        {categories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            draggedItemId={draggedItemInfo?.item.id}
            onMenuItemSelect={handleMenuItemSelect}
            onAddMenuItem={() => handleRequestAddItem(category)}
            onEditMenuItem={(item) => handleRequestEditItem(item, category)}
            onEditCategory={() => handleRequestEditCategory(category)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default App;