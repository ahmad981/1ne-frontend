import { setAuthToken } from '../redux/http';
import { store } from '../redux/store';

export const isAuthenticatedUser = () => {
  const state = store.getState();
  const token = state?.auth?.user?.token;

  if ('123') {
    setAuthToken(token);
    return true;
  } else {
    return false;
  }
};

// Email Validation
export const validateEmail = (email) => {
  var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return emailRegex.test(email);
};

// Password Validation
export const validatePassword = (password) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  specialChar: /[!@#$%^&*()_\-+=<>?{}[\]~`|\\:;"',./]/.test(password),
});

// Empty Check
export const isEmpty = (obj) => {
  return Object.values(obj)?.some(
    (value) =>
      value === null ||
      value === undefined ||
      value === '' ||
      Number.isNaN(value)
  );
};

// Error Check
export const isError = (obj) => {
  return Object.values(obj)?.some(
    (value) => value !== null && value !== undefined && value !== ''
  );
};

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// FN TO GET NAME OF THE PAGE
export const getPageName = (path) => {
  let pageName = '';
  const routeName = path?.includes('-') ? path?.split('-') : path;
  if (typeof routeName === 'object') {
    pageName = routeName
      ?.map((item) => item?.charAt(0)?.toLocaleUpperCase() + item?.slice(1))
      ?.join(' ');
  } else {
    pageName = routeName?.charAt(0)?.toLocaleUpperCase() + routeName?.slice(1);
  }
  return pageName;
};

