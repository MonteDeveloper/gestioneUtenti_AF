import useAlertsStore from "./alertsStore";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ReactNode } from "react";

interface SnackbarProviderProps {
    children: ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps) {
    const { alerts, deleteAlert } = useAlertsStore();

    const handleClose = (index: number) => (event?: Event | React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        deleteAlert(index);
    };

    return (
        <>
            {children}
            {alerts.map((alert, index) => (
                <Snackbar
                    key={alert.id}
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleClose(alert.id)}
                    style={{ position: 'fixed', bottom: `${index * 55}px`, left: 0, padding: 15 }}
                >
                    <Alert severity={alert.type} onClose={handleClose(alert.id)}>
                        {alert.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};
