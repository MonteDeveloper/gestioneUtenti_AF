import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUsersById, getUserById } from "../../service/users/users.api";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import HeaderFixed from "../../shared/components/HeaderFixed";
import { useQueryClient } from "react-query";

export function UserInfoPage() {
    const { id } = useParams();
    const { data: user, isLoading: getUserIsLoading, error: getUserIsError } = getUserById(id!);
    const { isLoading: deleteUserIsLoading, error: deleteUserIsError, mutateAsync: mutateDeleteUser } = deleteUsersById();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    }

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClickDeleteUser = () => setIsDialogOpen(true);

    function handleCloseDialog(isDialogConfirmed: boolean, idUser: string) {
        isDialogConfirmed ? deleteUser(idUser) : null;
        setIsDialogOpen(false);
    };

    async function deleteUser (idUser: string) {
        try {
            await mutateDeleteUser([idUser]);
            queryClient.clear();
            navigate('/');
        } catch (error) {
            console.log(error)
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
                    <Button disabled={getUserIsLoading || deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={() => handleClickDeleteUser()} color="error">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>handleClickDeleteUser
                            <DeleteIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                            {
                                deleteUserIsLoading ?
                                <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("deleteUserButtonLoading")}</Box>
                                :
                                <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t("deleteUserButton")}</Box>
                            }
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
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("birthdayDate")} secondary={formatDate(user.birthday_date)} />
                                                            <ListItemText sx={{ whiteSpace: 'noWrap', textAlign: 'center', padding: 2, borderRadius: 3, bgcolor: 'white' }} primary={t("address")} secondary={user.address} />
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                            <Typography variant="caption" color='textSecondary'>{t("userCreatedDate")} {formatDate(user.created)}</Typography>
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


            {!getUserIsLoading && !getUserIsError && user &&
                <Dialog
                    open={isDialogOpen}
                    onClose={handleCloseDialog}
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
                        <Button sx={{ borderRadius: 3, bgcolor: 'white' }} variant="outlined" onClick={() => handleCloseDialog(false, user.id)}>{t("cancelButton")}</Button>
                        <Button sx={{ borderRadius: 3 }} variant="contained" color="error" onClick={() => handleCloseDialog(true, user.id)} autoFocus>
                            {t("deleteUserButton")}
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}