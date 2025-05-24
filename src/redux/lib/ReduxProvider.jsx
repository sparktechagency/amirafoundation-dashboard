'use client';
// import { Provider } from "react-redux";
import { persistor, store } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CustomLoader from '@/component/Shared/CustomLoader';

export default function ReduxProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<CustomLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
