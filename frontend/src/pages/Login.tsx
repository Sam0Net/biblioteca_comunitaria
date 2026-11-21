import React from 'react';
import { Auth } from './Auth.js';

export const Login: React.FC = () => {
  return <Auth initialMode="login" />;
};

export default Login;
