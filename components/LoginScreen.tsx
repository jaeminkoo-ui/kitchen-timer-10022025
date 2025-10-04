import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
  authError: string | null;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSignUp, authError }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLoginView) {
      if (email.trim() && password.trim()) {
        onLogin(email.trim(), password.trim());
      }
    } else { // Sign up view
      if (password !== confirmPassword) {
        setError(t('passwordsDoNotMatch'));
        return;
      }
      if (email.trim() && password.trim()) {
        onSignUp(email.trim(), password.trim());
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-white text-center mb-2">{t('fryerDashboard')}</h1>
        <h2 className="text-xl text-gray-300 text-center mb-8">
          {isLoginView ? t('loginToAccount') : t('createAccount')}
        </h2>
        
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4">
          {error && <p className="text-red-500 text-xs italic text-center mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******************"
              required
            />
          </div>
          {!isLoginView && (
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="confirm-password">
                {t('confirmPassword')}
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="******************"
                required
              />
            </div>
          )}
          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors"
            >
              {isLoginView ? t('login') : t('signUp')}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          {isLoginView ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
          <button onClick={toggleView} className="font-bold text-blue-500 hover:text-blue-400">
            {isLoginView ? t('signUp') : t('login')}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;