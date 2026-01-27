import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App><MainPage/></App>} />
        </Routes>
    </BrowserRouter>
)

root.render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
)
