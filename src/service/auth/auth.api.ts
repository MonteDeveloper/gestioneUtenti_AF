import { pb } from "../../pocketbase";

export function isLogged() {
    return pb.authStore.isValid;
}

export function getToken() {
    return pb.authStore.token;
}

export async function loginIfNotLogged() {
    if (!isLogged()) {
        try {
            pb.admins.authWithPassword('lorenzo.montello@admin.it', 'admin12345');
        } catch (error) {

        }
    }
}

export async function login(username: string, password: string) {
    return pb.admins.authWithPassword(username, password);
}

export async function logout() {
    pb.authStore.clear();
}