import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, FormControl, Stack, Box, } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import { createUser } from '../../service/users/users.api';
import { User } from '../../models/user';
import HeaderFixed from '../../shared/components/HeaderFixed';
import { useQueryClient } from 'react-query';
import useAlertsStore from '../../shared/alerts/alertsStore';
import { FormUserData } from '../../models/form';

export function CreateNewUserPage() {
    const { handleSubmit, control, formState: { errors } } = useForm<FormUserData>();
    const { isLoading: createUserIsLoading, mutateAsync: mutateCreateUser } = createUser();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const queryClient = useQueryClient();
    const {addAlert} = useAlertsStore();

    async function onCreateUserSubmit(data: FormUserData) {
        const user: Partial<User> = {
            address: data.address,
            birthday_date: data.birthDate,
            email: data.email,
            name: data.firstName,
            surname: data.lastName,
        }
        try {
            addAlert(`'${user.email}': ${t("creatingUser")}`, 'info');
            await mutateCreateUser(user);
            addAlert(`'${user.email}': ${t("userCreatedSuccess")}`, 'success');
            queryClient.clear();
            navigate('/');
        } catch (error) {
            addAlert(`'${user.email}': ${t("userCreationError")}`, 'error');
        }
    };

    return (
        <>
            <HeaderFixed components={[
                <Button variant="outlined" sx={{ px: 3, py: 2, borderRadius: 3, bgcolor: 'white' }} onClick={() => navigate('/')}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <ArrowBackIosNewIcon sx={{ fontSize: 15, paddingBottom: .1 }} />
                        <Box sx={{ fontSize: 15 }}>{t("usersListPageButton")}</Box>
                    </Stack>
                </Button>,
                <Button disabled={createUserIsLoading} variant="contained" sx={{ px: 3, py: 2, borderRadius: 3 }} type='submit' form="newUserForm" color="primary">
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        {
                            !createUserIsLoading ?
                                <>
                                    <AddIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("createUserButton")}</Box>
                                </> :
                                <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("loading")}</Box>
                        }
                    </Stack>
                </Button>
            ]} />

            <Container maxWidth="sm" sx={{ py: 3 }}>
                <form onSubmit={handleSubmit(onCreateUserSubmit)} id='newUserForm'>
                    <Stack spacing={2}>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="firstName"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("errorFirstNameRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} sx={{ '& > * > :first-child': { bgcolor: 'white' } }} label={t("formFirstNameLabel")} {...field} error={!!errors.firstName} helperText={errors.firstName?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("errorLastNameRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} sx={{ '& > * > :first-child': { bgcolor: 'white' } }} label={t("formLastNameLabel")} {...field} error={!!errors.lastName} helperText={errors.lastName?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("errorEmailRequired"), pattern: { value: /^\S+@\S+$/i, message: t("errorEmailInvalid") } }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} sx={{ '& > * > :first-child': { bgcolor: 'white' } }} label={t("formEmailLabel")} {...field} error={!!errors.email} helperText={errors.email?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="birthDate"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("errorBirthdayRequired"), pattern: { value: /^[^.]+$/, message: t("errorBirthdayRequired") } }}
                                render={({ field }) => (
                                    <TextField InputLabelProps={{ shrink: true }} disabled={createUserIsLoading} sx={{ '& > * > :first-child': { bgcolor: 'white' } }} label={t("formBirthdayLabel")} type="date" lang={localStorage.getItem('language') || i18n.language} {...field} error={!!errors.birthDate} helperText={errors.birthDate?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("errorAddressRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} sx={{ '& > * > :first-child': { bgcolor: 'white' } }} label={t("formAddressLabel")} {...field} error={!!errors.address} helperText={errors.address?.message} />
                                )}
                            />
                        </FormControl>
                    </Stack>
                </form>

            </Container>
        </>
    );
};
