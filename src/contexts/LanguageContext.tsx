import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore Products',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    
    // Home Page
    'hero.title': 'Create Your Perfect Custom Phone Case',
    'hero.subtitle': 'Turn your favorite memories into beautiful, durable phone cases. Design in minutes, cherish forever.',
    'hero.cta': 'Start Designing Now',
    
    // Products
    'products.phoneCase': 'Phone Cases',
    'products.mug': 'Mugs',
    'products.bottle': 'Bottles',
    'products.tshirt': 'T-Shirts',
    'products.clock': 'Hug Clocks',
    'products.stickers': 'Stickers',
    'products.pencilCase': 'Pencil Cases',
    
    // Common
    'common.startDesigning': 'Start Designing Now',
    'common.beginDesigning': 'Begin Designing',
    'common.upload': 'Upload Photo',
    'common.preview': 'Live Preview',
    
    // About
    'about.brandStory': 'Brand Story',
    'about.vision': 'Our Vision',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.send': 'Send Message',
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.explore': '商品を見る',
    'nav.about': '私たちについて',
    'nav.contact': 'お問い合わせ',
    
    // Home Page
    'hero.title': '完璧なカスタムフォンケースを作成',
    'hero.subtitle': 'お気に入りの思い出を美しく耐久性のあるフォンケースに変えましょう。数分でデザイン、永遠に大切に。',
    'hero.cta': '今すぐデザインする',
    
    // Products
    'products.phoneCase': 'フォンケース',
    'products.mug': 'マグカップ',
    'products.bottle': 'ボトル',
    'products.tshirt': 'Tシャツ',
    'products.clock': 'ハグクロック',
    'products.stickers': 'ステッカー',
    'products.pencilCase': 'ペンケース',
    
    // Common
    'common.startDesigning': '今すぐデザインする',
    'common.beginDesigning': 'デザインを始める',
    'common.upload': '写真をアップロード',
    'common.preview': 'ライブプレビュー',
    
    // About
    'about.brandStory': 'ブランドストーリー',
    'about.vision': '私たちのビジョン',
    
    // Contact
    'contact.title': 'お問い合わせ',
    'contact.form.name': '名前',
    'contact.form.email': 'メールアドレス',
    'contact.form.message': 'メッセージ',
    'contact.form.send': 'メッセージを送信',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};