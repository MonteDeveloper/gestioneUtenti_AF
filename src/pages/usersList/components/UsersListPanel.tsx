import { Avatar, Box, Button, Checkbox, Collapse, Fade, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Pagination, Paper, Stack } from "@mui/material";
import { User } from "../../../models/user";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { TransitionGroup } from "react-transition-group";
import { deleteUsersById } from "../../../service/users/users.api";
import { useQueryClient } from "react-query";
import useAlertsStore from "../../../shared/alerts/alertsStore";

interface UsersData {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: User[];
}

interface PropsUsersListPanel {
    usersRawData: UsersData | undefined;
    isLoadingUsers: boolean;
    isError: boolean;
    changePage: (newPage: number) => void;
}

export function UsersListPanel(props: PropsUsersListPanel) {
    const navigate = useNavigate();
    const [selectedUsersId, setSelectedUsers] = useState<string[]>([]);
    const { t } = useTranslation();
    const { isLoading: deleteUserIsLoading, isError: deleteUserIsError, mutateAsync: mutateDeleteUser } = deleteUsersById();
    const queryClient = useQueryClient();
    const { addAlert } = useAlertsStore();

    function isUserSelected(userId: string) {
        return selectedUsersId.includes(userId);
    }

    function handleToggleUser(userId: string): void {
        const updatedSelectedUsers = [...selectedUsersId];

        const userIndex = updatedSelectedUsers.indexOf(userId);

        if (userIndex !== -1) {
            updatedSelectedUsers.splice(userIndex, 1);
        } else {
            updatedSelectedUsers.push(userId);
        }

        setSelectedUsers(updatedSelectedUsers);
    }

    async function deleteUsersSelected() {
        addAlert(t("deletingSelectedUsers"), 'info');
        try {
            await mutateDeleteUser(selectedUsersId);
            addAlert(t("selectedUsersDeletedSuccess"), 'success');
            queryClient.invalidateQueries('users');
            queryClient.clear();
        } catch (error) {
            addAlert(t("selectedUsersDeletionError"), 'error');
        }
        setSelectedUsers([]);
    }

    function handleChangePage(event: React.ChangeEvent<unknown>, newPage: number) {
        props.changePage(newPage);
    }


    return (
        <>
            <List sx={{ pb: 15 }}>
                <TransitionGroup>
                    {(() => {
                        switch (true) {
                            case props.isLoadingUsers:
                                return (
                                    <Collapse>
                                        <ListItem sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                            <ListItemText primary={t('loading')} />
                                        </ListItem>
                                    </Collapse>
                                );
                            case props.usersRawData != undefined && props.usersRawData.items.length > 0:
                                return (
                                    props.usersRawData.items.map((user: User) => (
                                        <Collapse key={user.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Checkbox disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)}
                                                        edge="end"
                                                        onChange={() => handleToggleUser(user.id)}
                                                        inputProps={{ 'aria-labelledby': user.id }}
                                                    />
                                                }
                                                sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden', my: .5 }}
                                                disablePadding
                                            >
                                                <ListItemButton disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)} onClick={() => navigate(`/user-info/${user.id}`)} selected={isUserSelected(user.id)}>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`${user.name} ${user.surname}`} secondary={user.address} sx={{ width: .5 }} />
                                                    <ListItemText secondary={user.email} />
                                                </ListItemButton>
                                            </ListItem>
                                        </Collapse>
                                    ))

                                );
                            case props.usersRawData != undefined && props.usersRawData.items.length == 0:
                                if (props.usersRawData.page > 1) {
                                    props.changePage(props.usersRawData.page - 1);
                                } else {
                                    return (
                                        <Collapse>
                                            <ListItem sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                                <ListItemText primary={t('noUsersFound')} />
                                            </ListItem>
                                        </Collapse>
                                    );
                                }
                                break;
                            case props.isError:
                                return (
                                    <Collapse>
                                        <ListItem sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                            <ListItemText primary={t('uknownError')} />
                                        </ListItem>
                                    </Collapse>
                                );

                            default:
                                return (
                                    <Collapse>
                                        <ListItem sx={{ backgroundColor: 'white', borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                            <ListItemText primary={t('uknownError')} />
                                        </ListItem>
                                    </Collapse>
                                );
                        }
                    })()}
                </TransitionGroup>
            </List>

            {/* FLOATING BOTTOM ELEMENTS ----------------------------------------- */}
            <Box sx={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translate(-50%, 0)' }}>
                {/* DELETE USERS BUTTON */}
                <Fade in={selectedUsersId.length > 0 && props.usersRawData != undefined && props.usersRawData.items.length > 0}>
                    <Button disabled={deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={() => deleteUsersSelected()} color="error">
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                            {
                                !deleteUserIsLoading ?
                                    <>
                                        <DeleteIcon sx={{ fontSize: 30, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                                        <Box sx={{ fontSize: 20, whiteSpace: 'noWrap' }}>{t("deleteUsersButton")}</Box>
                                    </>
                                    : <Box sx={{ fontSize: 20, whiteSpace: 'noWrap' }}>{t("deleteLoading")}</Box>
                            }

                        </Stack>
                    </Button>
                </Fade >
            </Box>
            {
                props.usersRawData && props.usersRawData.items.length > 0 && selectedUsersId.length == 0 &&
                <Box sx={{ position: 'fixed', bottom: 50, left: '50%', transform: 'translate(-50%, 0)' }}>
                    {/* PAGINATION */}
                    <Fade in={selectedUsersId.length == 0 && props.usersRawData.totalPages > 1}>
                        <Paper elevation={0} sx={{ boxShadow: '0px 0px 13px 1px rgba(0,0,0,0.15)', p: 2, borderRadius: 3 }}>
                            <Pagination count={props.usersRawData.totalPages} page={props.usersRawData.page} onChange={handleChangePage} />
                        </Paper>
                    </Fade >
                </Box>
            }
        </>
    )
}