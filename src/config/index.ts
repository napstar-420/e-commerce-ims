import api from './api';

const config = {
  APP_NAME: 'Beauty Bonjour',
  EMAIL_REGEX: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
  PASSWORD_REGEX:
    /^(?=.*[0-9])(?=.*[!@#$%^&*()-=_+`~{}[\]:;<>,.?/\\|])(?=.*[a-z])(?=.*[A-Z])\S.{7,}\S$/,
  SERVER_URL: 'http://localhost:3000',
  ALERT_TIMEOUT: 3000, //ms
  DEBOUNCE_RATE: 1500, // ms
  API: { ...api },
};

export default config;
