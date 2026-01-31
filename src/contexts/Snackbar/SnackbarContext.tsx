import React, { createContext, useContext, useState, ReactNode } from 'react';
import SnackbarComponent from '../../components/UIElements/Snackbar';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar must be used within SnackbarProvider');
    }
    return context;
};

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<SnackbarSeverity>('success');

    const showSnackbar = (msg: string, sev: SnackbarSeverity = 'success') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <SnackbarComponent 
                open={open} 
                setOpen={setOpen} 
                severity={severity} 
                message={message} 
            />
        </SnackbarContext.Provider>
    );
};
