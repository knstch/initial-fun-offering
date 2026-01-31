import { Snackbar, Alert } from '@mui/material';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    severity: SnackbarSeverity;
    message: string;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({open, setOpen, severity, message}) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setOpen(false)} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarComponent;