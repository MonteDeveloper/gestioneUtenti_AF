import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../../service/auth/useAuth";
import { useTranslation } from "react-i18next";

export function LoginIfNotLogged(props: PropsWithChildren) {
    const isLogged = useAuth(state => state.isLogged);
    const login = useAuth(state => state.login);
    const {t} = useTranslation();

    useEffect(() => {
        if(!isLogged){
            login('lorenzo.montello@admin.it', 'admin12345');
        }
    }, [])

    return (
        <>
            {
                isLogged ?
                    props.children :
                    <h1>{t("loading")}</h1>
            }
        </>
    )
}