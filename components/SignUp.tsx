import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('회원가입 성공!', userCredential.user);
      alert(t('signUp.successAlert'));
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(t('signUp.errorAlert'));
    }
  };

  return (
    <div>
      <h3>{t('signUp.title')}</h3>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('signUp.emailPlaceholder')}
          required
          className="bg-gray-700 text-white rounded px-2 py-1 mb-2 w-full"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('signUp.passwordPlaceholder')}
          required
          className="bg-gray-700 text-white rounded px-2 py-1 mb-2 w-full"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          {t('signUp.button')}
        </button>
      </form>
    </div>
  );
};

export default SignUp;