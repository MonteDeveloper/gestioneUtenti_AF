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
            addAlert(`'${user.email}': ${t("messages.creatingUser")}`, 'info');
            await mutateCreateUser(user);
            addAlert(`'${user.email}': ${t("messages.userCreatedSuccess")}`, 'success');
            queryClient.clear();
            navigate('/');
        } catch (error) {
            addAlert(`'${user.email}': ${t("errors.userCreation")}`, 'error');
        }
    };

    return (
        <>
            <HeaderFixed components={[
                <Button variant="outlined" sx={{ px: 3, py: 2, borderRadius: 3 }} onClick={() => navigate('/')}>
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <ArrowBackIosNewIcon sx={{ fontSize: 15, paddingBottom: .1 }} />
                        <Box sx={{ fontSize: 15 }}>{t("buttons.userList")}</Box>
                    </Stack>
                </Button>,
                <Button disabled={createUserIsLoading} variant="contained" sx={{ px: 3, py: 2, borderRadius: 3 }} type='submit' form="newUserForm" color="primary">
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        {
                            !createUserIsLoading ?
                                <>
                                    <AddIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("buttons.createUser")}</Box>
                                </> :
                                <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("messages.loading")}</Box>
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
                                rules={{ required: t("formValidations.firstNameRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} label={t("labels.formFirstName")} {...field} error={!!errors.firstName} helperText={errors.firstName?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="lastName"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("formValidations.lastNameRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} label={t("labels.formLastName")} {...field} error={!!errors.lastName} helperText={errors.lastName?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("formValidations.emailRequired"), pattern: { value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, message: t("formValidations.emailInvalid") } }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} label={t("labels.formEmail")} {...field} error={!!errors.email} helperText={errors.email?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="birthDate"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("formValidations.birthdayRequired") }}
                                render={({ field }) => (
                                    <TextField InputLabelProps={{ shrink: true }} disabled={createUserIsLoading} label={t("labels.formBirthday")} type="date" lang={localStorage.getItem('language') || i18n.language} {...field} error={!!errors.birthDate} helperText={errors.birthDate?.message} />
                                )}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                rules={{ required: t("formValidations.addressRequired") }}
                                render={({ field }) => (
                                    <TextField disabled={createUserIsLoading} label={t("labels.formAddress")} {...field} error={!!errors.address} helperText={errors.address?.message} />
                                )}
                            />
                        </FormControl>
                    </Stack>
                </form>

            </Container>
        </>
    );
};
