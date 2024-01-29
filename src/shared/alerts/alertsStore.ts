
import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
    id: number;
    message: string;
    type: AlertType;
}

export interface AlertsState {
    alerts: Alert[];
    addAlert: (message: string, type: AlertType) => void;
    deleteAlert: (index: number) => void;
    clearAlerts: () => void;
}

const useAlertsStore = create<AlertsState>((set, get) => ({
    alerts: [],
    addAlert: (message, type) => {
        const lastAlert = get().alerts[get().alerts.length - 1];
        const newId = lastAlert ? lastAlert.id + 1 : 1;

        set({
            alerts: [...get().alerts, { id: newId, message, type }],
        });
    },
    deleteAlert: (index) => {
        const updatedAlerts = get().alerts.filter((alert) => alert.id !== index);
        set({
            alerts: updatedAlerts,
        });
    },
    clearAlerts: () => {
        set({ alerts: [] });
    },
}));

export default useAlertsStore;
