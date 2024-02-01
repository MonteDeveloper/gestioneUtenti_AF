import { format } from "date-fns";
import { getCurrentLocale } from "../locales/i18n";

export function useDateFns(){
    const formatDateInput = (dateString: string) => format(dateString, 'yyyy-MM-dd', { locale: getCurrentLocale() });

    const formatDateView = (dateString: string) => format(dateString, 'PPP', { locale: getCurrentLocale() });

    return {
        formatDateInput,
        formatDateView
    }
}