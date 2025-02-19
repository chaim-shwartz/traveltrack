import translations from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';

export default function useTranslation() {
    const { language } = useLanguage();
    return translations[language];
}
