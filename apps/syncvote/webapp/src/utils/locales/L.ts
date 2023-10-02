import { LANG as VN } from './languages/vi';
import { LANG as EN } from './languages/en';

const defaultLanguageKey = 'en';

const LANGUAGES: any = {
  vi: VN,
  en: EN,
};

let LanguagesObj: any = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setLanguage = (lang?: string) => {
  LanguagesObj = LANGUAGES[lang || defaultLanguageKey] || {};

  // const win: any = (window as any).localStorage;
  // if (win) {
  //   win.language = lang || 'en';
  // }
};

// For first time set default language saved in localStorage
setLanguage();

const L = (str: string) => {
  const value = LanguagesObj[str] || str;

  // Used for Test:
  if (str === value) {
    // console.warn('Need Localizing ---> : ', str);
  }
  return value;
};

const LF = (str: string, ...args: string[]) => {
  const value: string = LanguagesObj[str] || str;

  // eslint-disable-next-line no-useless-escape
  const rs = value.replace(/\$\([^\)]{1,}\)/gim, (s) => {
    let v: any = s.trim();
    v = v.substr(2, v.length - 3).trim();
    const val: any = args[v];
    return val !== undefined && val !== null ? val : '';
  });

  if (rs === value) {
    // console.warn('Need Localizing ------------- : ', str);
  }

  return rs;
};

export { L, LF, setLanguage };

// (window as any).L = L;
// (window as any).LF = LF;
