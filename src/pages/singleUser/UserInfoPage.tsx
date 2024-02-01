import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUsersById, editUser, getUserById } from "../../service/users/users.api";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";
import HeaderFixed from "../../shared/components/HeaderFixed";
import { useQueryClient } from "react-query";
import useAlertsStore from "../../shared/alerts/alertsStore";
import { useDateFns } from "../../shared/useDateFns";
import { ModalEditUser } from "./components/ModalEditUser";

export function UserInfoPage() {
    const { id } = useParams();
    const { data: user, isLoading: getUserIsLoading, error: getUserIsError } = getUserById(id!);
    const { isLoading: deleteUserIsLoading, mutateAsync: mutateDeleteUser } = deleteUsersById();

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const { addAlert } = useAlertsStore();
    const { formatDateView } = useDateFns();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // FUNCTIONS----------------
    async function deleteUser(idUser: string) {
        addAlert(`'${user?.email}': ${t("messages.deletingUser")}`, 'info');
        try {
            await mutateDeleteUser([idUser]);
            addAlert(`'${user?.email}': ${t("messages.userDeletedSuccess")}`, 'success');
            queryClient.clear();
            navigate('/');
        } catch (error) {
            addAlert(`'${user?.email}': ${t("error.userDeletion")}`, 'error');
        }
    };

    // HANDLERS----------------
    const handleClickDeleteUser = () => setIsDialogOpen(true);

    const handleClickEditUser = () => handleOpenEditModal();

    function handleOpenEditModal() {
        setIsEditModalOpen(true);
    }

    function handleCloseDeleteDialog(isDialogConfirmed: boolean, idUser: string) {
        isDialogConfirmed ? deleteUser(idUser) : null;
        setIsDialogOpen(false);
    };


    return (
        <>
            <HeaderFixed components={[
                <Button variant="outlined" sx={{ px: 3, bgcolor: 'white', borderRadius: 3, py: 2 }} onClick={() => navigate('/')}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <ArrowBackIosNewIcon sx={{ fontSize: 15, paddingBottom: .1 }} />
                        <Box sx={{ fontSize: 15 }}>{t("buttons.userList")}</Box>
                    </Stack>
                </Button>,
                <Stack direction={'row'} spacing={2}>
                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={handleClickDeleteUser} color="error">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <DeleteIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                            {
                                deleteUserIsLoading ?
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("messages.deleting")}</Box>
                                    :
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("buttons.deleteUser")}</Box>
                            }
                        </Stack>
                    </Button>
                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={handleClickEditUser} color="primary">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <EditIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("buttons.editUser")}</Box>
                        </Stack>
                    </Button>
                </Stack>
            ]} />

            <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'stretch'} sx={{ padding: 5 }}>
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                    <Stack height={1} justifyContent={'center'}>
                        {(() => {
                            switch (true) {
                                case user != undefined:
                                    return (
                                        <Stack spacing={3} alignItems={'center'}>
                                            <Avatar sx={{ width: 150, height: 150, fontSize: 70 }}>
                                                {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Stack alignItems={'center'} spacing={0}>
                                                <Typography variant="h4">{user.name} {user.surname}</Typography>
                                                <Typography variant="subtitle1" color="textSecondary">{user.email}</Typography>
                                            </Stack>
                                            <Box sx={{ p: 4, borderRadius: 3 }}>
                                                <Stack height={1} justifyContent={'center'}>
                                                    <Stack spacing={3}>
                                                        <Stack direction={'row'} spacing={3}>
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("labels.birthdayDate")} secondary={formatDateView(user.birthday_date)} />
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("labels.address")} secondary={user.address} />
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                            <Typography variant="caption" color='textSecondary'>{t("labels.userCreatedDate")} {formatDateView(user.created)}</Typography>
                                        </Stack>
                                    );
                                case getUserIsLoading == true:
                                    return (
                                        <Typography variant="subtitle1" color="textSecondary">{t("messages.loading")}</Typography>
                                    );

                                default:
                                    return (
                                        <Typography variant="subtitle1" color="textSecondary">{t("errors.uknownError")}</Typography>
                                    );
                            }
                        })()}
                    </Stack>
                </Paper>
            </Stack>

            {
                user &&
                <ModalEditUser isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} user={user} />
            }

            {/* DIALOG CONFIRM DELETE USER */}
            {!getUserIsLoading && !getUserIsError && user &&
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    sx={{ '& > * > :first-of-type': { borderRadius: 3, p: 1 } }}
                >
                    <DialogTitle>
                        {`${t("dialogs.deleteUserTitle")} "${user.email}"?`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t("dialogs.deleteUserDesc")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ borderRadius: 3, bgcolor: 'white' }} variant="outlined" onClick={() => handleCloseDeleteDialog(false, user.id)}>{t("buttons.cancelButton")}</Button>
                        <Button sx={{ borderRadius: 3 }} variant="contained" color="error" onClick={() => handleCloseDeleteDialog(true, user.id)} autoFocus>
                            {t("buttons.deleteUser")}
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}