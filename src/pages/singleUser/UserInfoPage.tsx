import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUsersById, editUser, getUserById } from "../../service/users/users.api";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, ListItemText, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from "react-i18next";
import HeaderFixed from "../../shared/components/HeaderFixed";
import { useQueryClient } from "react-query";
import useAlertsStore from "../../shared/alerts/alertsStore";
import { Controller, useForm } from "react-hook-form";
import { User } from "../../models/user";
import { format } from "date-fns";
import { getCurrentLocale } from "../../locales/i18n";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    address: string;
}

export function UserInfoPage() {
    const { id } = useParams();
    const { data: user, isLoading: getUserIsLoading, error: getUserIsError } = getUserById(id!);
    const { isLoading: deleteUserIsLoading, isError: deleteUserIsError, mutateAsync: mutateDeleteUser } = deleteUsersById();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const { addAlert } = useAlertsStore();
    const { handleSubmit, control, formState: { errors, isDirty }, reset: resetEditForm } = useForm<FormData>();
    const { isLoading: editUserIsLoading, isError, mutateAsync: mutateEditUser } = editUser(id!);

    const formatDateInput = (dateString: string) => format(dateString, 'yyyy-MM-dd', { locale: getCurrentLocale() });

    const formatDateView = (dateString: string) => format(dateString, 'dd MMMM yyyy', { locale: getCurrentLocale() });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleClickDeleteUser = () => setIsDialogOpen(true);

    const handleClickEditUser = () => handleOpenEditModal();

    function handleOpenEditModal() {
        setIsEditModalOpen(true);
    }

    function handleCloseEditModal(event?: {}, reason?: string) {
        if (reason == 'backdropClick') {
            return;
        }
        setIsEditModalOpen(false);
        resetEditForm();
    }

    function handleCloseEditModalDialog(isDialogConfirmed: boolean, idUser: string) {
        isDialogConfirmed ? deleteUser(idUser) : null;
        setIsDialogOpen(false);
    };

    async function onEditSubmit(data: FormData) {
        const editedUser: Partial<User> = {
            address: data.address,
            birthday_date: data.birthDate,
            email: data.email,
            name: data.firstName,
            surname: data.lastName,
        }
        try {
            console.log(editedUser);
            addAlert(`'${user?.email}': ${t("editingUser")}`, 'info');
            await mutateEditUser(editedUser);
            addAlert(`'${user?.email}': ${t("userEditedSuccess")}`, 'success');
            queryClient.clear();
            setIsEditModalOpen(false);
        } catch (error) {
            addAlert(`'${user?.email}': ${t("userEditError")}`, 'error');
        }
    };

    async function deleteUser(idUser: string) {
        addAlert(`'${user?.email}': ${t("deletingUser")}`, 'info');
        try {
            await mutateDeleteUser([idUser]);
            addAlert(`'${user?.email}': ${t("userDeletedSuccess")}`, 'success');
            queryClient.clear();
            navigate('/');
        } catch (error) {
            addAlert(`'${user?.email}': ${t("userDeletionError")}`, 'error');
        }
    };

    return (
        <>
            <HeaderFixed components={[
                <Button variant="outlined" sx={{ px: 3, bgcolor: 'white', borderRadius: 3, py: 2 }} onClick={() => navigate('/')}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <ArrowBackIosNewIcon sx={{ fontSize: 15, paddingBottom: .1 }} />
                        <Box sx={{ fontSize: 15 }}>{t("usersListPageButton")}</Box>
                    </Stack>
                </Button>,
                <Stack direction={'row'} spacing={2}>
                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={handleClickDeleteUser} color="error">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <DeleteIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                            {
                                deleteUserIsLoading ?
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("deleteUserButtonLoading")}</Box>
                                    :
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("deleteUserButton")}</Box>
                            }
                        </Stack>
                    </Button>
                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={handleClickEditUser} color="primary">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            <EditIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("editUserButton")}</Box>
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
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("birthdayDate")} secondary={formatDateView(user.birthday_date)} />
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("address")} secondary={user.address} />
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                            <Typography variant="caption" color='textSecondary'>{t("userCreatedDate")} {formatDateView(user.created)}</Typography>
                                        </Stack>
                                    );
                                case getUserIsLoading == true:
                                    return (
                                        <Typography variant="subtitle1" color="textSecondary">{t("loading")}</Typography>
                                    );

                                default:
                                    return (
                                        <Typography variant="subtitle1" color="textSecondary">{t("uknownError")}</Typography>
                                    );
                            }
                        })()}
                    </Stack>
                </Paper>
            </Stack>

            {/* EDIT MODAL */}
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-edit-user"
                aria-describedby="modal-edit-user-description"
            >
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
                    <Stack spacing={3}>

                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('titleEditUserModal')}
                        </Typography>
                        <form onSubmit={handleSubmit(onEditSubmit)} id='newUserForm'>
                            <Stack spacing={2}>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        defaultValue={user?.name}
                                        rules={{ required: t("errorFirstNameRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("formFirstNameLabel")} {...field} error={!!errors.firstName} helperText={errors.firstName?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        defaultValue={user?.surname}
                                        rules={{ required: t("errorLastNameRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("formLastNameLabel")} {...field} error={!!errors.lastName} helperText={errors.lastName?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="email"
                                        control={control}
                                        defaultValue={user?.email}
                                        rules={{ required: t("errorEmailRequired"), pattern: { value: /^\S+@\S+$/i, message: t("errorEmailInvalid") } }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("formEmailLabel")} {...field} error={!!errors.email} helperText={errors.email?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    {user?.birthday_date &&
                                        <Controller
                                            name="birthDate"
                                            control={control}
                                            defaultValue={formatDateInput(user?.birthday_date)}
                                            rules={{ required: t("errorBirthdayRequired"), pattern: { value: /^[^.]+$/, message: t("errorBirthdayRequired") } }}
                                            render={({ field }) => (
                                                <TextField InputLabelProps={{ shrink: true }} disabled={editUserIsLoading} label={t("formBirthdayLabel")} type="date" lang={localStorage.getItem('language') || i18n.language} {...field} error={!!errors.birthDate} helperText={errors.birthDate?.message} />
                                            )}
                                        />}
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="address"
                                        control={control}
                                        defaultValue={user?.address}
                                        rules={{ required: t("errorAddressRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("formAddressLabel")} {...field} error={!!errors.address} helperText={errors.address?.message} />
                                        )}
                                    />
                                </FormControl>
                                <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
                                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="outlined" sx={{ px: 3, borderRadius: 3 }} onClick={handleCloseEditModal} color="secondary">
                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                            {/* <EditIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} /> */}
                                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("closeButton")}</Box>
                                        </Stack>
                                    </Button>
                                    <Button type="submit" disabled={getUserIsLoading || !isDirty || editUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} color="primary">
                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                            {
                                                !editUserIsLoading ?
                                                    <>
                                                        {/* <EditIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} /> */}
                                                        <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("confirmEditUserButton")}</Box>
                                                    </> :
                                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("loading")}</Box>
                                            }
                                        </Stack>
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Modal>

            {/* DIALOG CONFIRM DELETE USER */}
            {!getUserIsLoading && !getUserIsError && user &&
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseEditModalDialog}
                    sx={{ '& > * > :first-of-type': { borderRadius: 3, p: 1 } }}
                >
                    <DialogTitle>
                        {`${t("tileDialogDeleteUser")} "${user.email}"?`}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t("descDialogDeleteUser")}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={{ borderRadius: 3, bgcolor: 'white' }} variant="outlined" onClick={() => handleCloseEditModalDialog(false, user.id)}>{t("cancelButton")}</Button>
                        <Button sx={{ borderRadius: 3 }} variant="contained" color="error" onClick={() => handleCloseEditModalDialog(true, user.id)} autoFocus>
                            {t("deleteUserButton")}
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}