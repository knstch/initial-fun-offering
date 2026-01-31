import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import { SnackbarProvider } from './contexts/Snackbar/SnackbarContext';
import { AuthProvider } from './contexts/Auth/AuthProvider';
import { AddressType, BrowserSDKConfig } from "@phantom/browser-sdk";
import { PhantomProvider, darkTheme } from '@phantom/react-sdk';
import logo from './assets/full_logo.svg';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const phantomWalletConfig: BrowserSDKConfig = {
    providers: ["injected"],
    appId: process.env.REACT_APP_PHANTOM_APP_ID,
    addressTypes: [AddressType.solana],
  }

const Router = () => {
    return (
        <BrowserRouter>
        <PhantomProvider config={phantomWalletConfig} theme={darkTheme} appIcon={logo} appName="Initial Fun Offering">
            <SnackbarProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<App><MainPage/></App>} />
                    </Routes>
                </AuthProvider>
            </SnackbarProvider>
        </PhantomProvider>
        </BrowserRouter>
    );
}

root.render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
)
