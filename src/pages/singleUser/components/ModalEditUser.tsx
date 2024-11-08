import { Box, Button, FormControl, Modal, Paper, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormUserData } from "../../../models/form";
import { User } from "../../../models/user";
import { editUser } from "../../../service/users/users.api";
import useAlertsStore from "../../../shared/alerts/alertsStore";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useDateFns } from "../../../shared/useDateFns";

interface PropsModalEditUser{
    user: User;
    setIsEditModalOpen: (isOpen: boolean) => void;
    isEditModalOpen: boolean;
}

export function ModalEditUser(props: PropsModalEditUser) {
    const { user, setIsEditModalOpen, isEditModalOpen } = props;
    const { isLoading: editUserIsLoading, mutateAsync: mutateEditUser } = editUser(user.id);
    const { addAlert } = useAlertsStore();
    const queryClient = useQueryClient();
    const { handleSubmit, control, formState: { errors, isDirty }, reset: resetEditForm } = useForm<FormUserData>();
    const { t, i18n } = useTranslation();
    const { formatDateInput } = useDateFns();

    async function onEditSubmit(data: FormUserData) {
        const editedUser: Partial<User> = {
            address: data.address,
            birthday_date: data.birthDate,
            email: data.email,
            name: data.firstName,
            surname: data.lastName,
        }
        try {
            console.log(editedUser);
            addAlert(`'${user?.email}': ${t("messages.editingUser")}`, 'info');
            await mutateEditUser(editedUser);
            addAlert(`'${user?.email}': ${t("messages.userEditedSuccess")}`, 'success');
            queryClient.clear();
            setIsEditModalOpen(false);
        } catch (error) {
            addAlert(`'${user?.email}': ${t("errors.userEdit")}`, 'error');
        }
    };

    function handleCloseEditModal(_event?: {}, reason?: string) {
        if (reason == 'backdropClick') {
            return;
        }
        setIsEditModalOpen(false);
        resetEditForm();
    }

    return (
        <>
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-edit-user"
                aria-describedby="modal-edit-user-description"
            >
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
                    <Stack spacing={3}>

                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {t('titles.editUserModal')}
                        </Typography>
                        <form onSubmit={handleSubmit(onEditSubmit)} id='newUserForm'>
                            <Stack spacing={2}>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        defaultValue={user?.name}
                                        rules={{ required: t("formValidations.firstNameRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("labels.formFirstName")} {...field} error={!!errors.firstName} helperText={errors.firstName?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        defaultValue={user?.surname}
                                        rules={{ required: t("formValidations.lastNameRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("labels.formLastName")} {...field} error={!!errors.lastName} helperText={errors.lastName?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="email"
                                        control={control}
                                        defaultValue={user?.email}
                                        rules={{ required: t("formValidations.emailRequired"), pattern: { value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, message: t("formValidations.emailInvalid") } }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("labels.formEmail")} {...field} error={!!errors.email} helperText={errors.email?.message} />
                                        )}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    {user?.birthday_date &&
                                        <Controller
                                            name="birthDate"
                                            control={control}
                                            defaultValue={formatDateInput(user?.birthday_date)}
                                            rules={{ required: t("formValidations.birthdayRequired") }}
                                            render={({ field }) => (
                                                <TextField InputLabelProps={{ shrink: true }} disabled={editUserIsLoading} label={t("labels.formBirthday")} type="date" lang={localStorage.getItem('language') || i18n.language} {...field} error={!!errors.birthDate} helperText={errors.birthDate?.message} />
                                            )}
                                        />}
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Controller
                                        name="address"
                                        control={control}
                                        defaultValue={user?.address}
                                        rules={{ required: t("formValidations.addressRequired") }}
                                        render={({ field }) => (
                                            <TextField disabled={editUserIsLoading} label={t("labels.formAddress")} {...field} error={!!errors.address} helperText={errors.address?.message} />
                                        )}
                                    />
                                </FormControl>
                                <Stack direction={'row'} justifyContent={'space-between'} spacing={2}>
                                    <Button variant="outlined" sx={{ px: 3, borderRadius: 3 }} onClick={handleCloseEditModal} color="secondary">
                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("buttons.closeButton")}</Box>
                                        </Stack>
                                    </Button>
                                    <Button type="submit" disabled={!isDirty || editUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} color="primary">
                                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                            {
                                                !editUserIsLoading ?
                                                    <>
                                                        {/* <EditIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} /> */}
                                                        <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("buttons.confirmEditUser")}</Box>
                                                    </> :
                                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("messages.loading")}</Box>
                                            }
                                        </Stack>
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Stack>
                </Paper>
            </Modal>
        </>
    )
}
