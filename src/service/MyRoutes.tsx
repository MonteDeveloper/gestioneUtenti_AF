import { Navigate, useRoutes } from "react-router-dom";
import { UsersListPage } from "../pages/usersList/UsersListPage";
import { UserInfoPage } from "../pages/singleUser/UserInfoPage";
import { LoginIfNotLogged } from "../shared/guards/LoginIfNotLogged";
import { CreateNewUserPage } from "../pages/newUser/CreateNewUserPage";

export function MyRoutes() {
    return useRoutes([
        { path: '/', element:<Navigate to='users-list' /> },
        { path: 'users-list', element: <LoginIfNotLogged><UsersListPage /></LoginIfNotLogged> },
        { path: 'user-info/:id', element: <LoginIfNotLogged><UserInfoPage /></LoginIfNotLogged> },
        { path: 'create-user', element: <LoginIfNotLogged><CreateNewUserPage /></LoginIfNotLogged> },
    ])
}