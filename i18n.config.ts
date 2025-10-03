import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// 우리가 방금 수정한 i18n.ts 파일에서 번역 데이터를 가져옵니다.
import { translations } from './i18n';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // resources에 가져온 데이터를 바로 사용합니다.
    resources: translations,
    fallbackLng: 'en', // 기본 언어
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;