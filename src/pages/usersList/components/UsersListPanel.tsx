import { Avatar, Box, Button, Checkbox, Collapse, Fade, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Stack, Typography, useTheme } from "@mui/material";
import { User } from "../../../models/user";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from "react-i18next";
import { TransitionGroup } from "react-transition-group";
import { deleteUsersById } from "../../../service/users/users.api";
import { useQueryClient } from "react-query";
import useAlertsStore from "../../../shared/alerts/alertsStore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { setRowsPerPage } from "../../../state/pagination/paginationSlice";
import { AboveBreakpoint, BelowBreakpoint, BreakpointRange } from "../../../service/responsive/breakpoints";

interface UsersRawData {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    items: User[];
}

interface PropsUsersListPanel {
    usersRawData: UsersRawData | undefined;
    isLoadingUsers: boolean;
    isError: boolean;
    changePage: (newPage: number) => void;
}

export function UsersListPanel(props: PropsUsersListPanel) {
    const { isLoading: deleteUserIsLoading, mutateAsync: mutateDeleteUser } = deleteUsersById();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addAlert } = useAlertsStore();

    const [selectedUsersId, setSelectedUsers] = useState<string[]>([]);

    const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);
    const totalPages = useSelector((state: RootState) => state.pagination.totalPages);
    const usersList = useSelector((state: RootState) => state.usersList.usersList);
    const dispatch = useDispatch();

    const theme = useTheme();

    // FUNCTIONS---------------
    const isUserSelected = (userId: string) => selectedUsersId.includes(userId);

    async function deleteUsersSelected() {
        addAlert(t("messages.deletingSelectedUsers"), 'info');
        const selectedUsersSaved = [...selectedUsersId];
        try {
            await mutateDeleteUser(selectedUsersId);
            addAlert(t("messages.selectedUsersDeletedSuccess"), 'success');
            queryClient.invalidateQueries('users');
            queryClient.clear();
            setSelectedUsers([]);
        } catch (error) {
            addAlert(t("errors.selectedUsersDeletion"), 'error');
            setSelectedUsers(selectedUsersSaved);
        }
    }

    // HANDLERS-----------------
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

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => props.changePage(newPage);

    function handleChangeRowsPerPage(event: SelectChangeEvent) {
        dispatch(setRowsPerPage(Number(event.target.value)));
    }

    return (
        <>
            <List sx={{ pb: 17.7 }}>
                <TransitionGroup>
                    {(() => {
                        switch (true) {
                            case props.isLoadingUsers:
                                return (
                                    <Collapse>
                                        <ListItem sx={{ borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                            <ListItemText primary={t('messages.loading')} />
                                        </ListItem>
                                    </Collapse>
                                );
                            case props.usersRawData != undefined && props.usersRawData.items.length > 0:
                                return (
                                    usersList.map((user: User) => (
                                        <Collapse key={user.id}>
                                            <ListItem
                                                secondaryAction={
                                                    <Checkbox disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)}
                                                        edge="end"
                                                        onChange={() => handleToggleUser(user.id)}
                                                        inputProps={{ 'aria-labelledby': user.id }}
                                                    />
                                                }
                                                sx={{ borderRadius: 3, overflow: 'hidden', my: .5 }}
                                                disablePadding
                                            >
                                                <AboveBreakpoint breakpoint="sm" style={{ display: 'none' }}>
                                                    <ListItemButton disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)} onClick={() => navigate(`/user-info/${user.id}`)} selected={isUserSelected(user.id)}>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={`${user.name} ${user.surname}`} sx={{ width: .5 }} />
                                                    </ListItemButton>
                                                </AboveBreakpoint>
                                                <BelowBreakpoint breakpoint="md" style={{ display: 'none' }}>
                                                    <ListItemButton disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)} onClick={() => navigate(`/user-info/${user.id}`)} selected={isUserSelected(user.id)}>
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={`${user.name} ${user.surname}`} secondary={user.address} sx={{ width: .5 }} />
                                                        <ListItemText secondary={user.email} />
                                                    </ListItemButton>
                                                </BelowBreakpoint>
                                                <BreakpointRange from="sm" to="md" reverse style={{ display: 'none' }}>
                                                        <ListItemButton disabled={deleteUserIsLoading && selectedUsersId.includes(user.id)} onClick={() => navigate(`/user-info/${user.id}`)} selected={isUserSelected(user.id)}>
                                                            <ListItemAvatar>
                                                                <Avatar>
                                                                    {user.name.charAt(0).toUpperCase()}{user.surname.charAt(0).toUpperCase()}
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText primary={`${user.name} ${user.surname}`} sx={{ width: .5 }} />
                                                            <ListItemText secondary={user.email} />
                                                        </ListItemButton>
                                                </BreakpointRange>
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
                                            <ListItem sx={{ borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                                <ListItemText primary={t('messages.noUsersFound')} />
                                            </ListItem>
                                        </Collapse>
                                    );
                                }
                                break;
                            case props.isError:
                            default:
                                return (
                                    <Collapse>
                                        <ListItem sx={{ borderRadius: 3, overflow: 'hidden', my: .5, textAlign: 'center' }}>
                                            <ListItemText primary={t('error.uknownError')} />
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
                    <Stack direction={'row'} spacing={2}>
                        <Button disabled={deleteUserIsLoading} variant="contained" sx={{ px: 3, borderRadius: 3 }} onClick={deleteUsersSelected} color="error">
                            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                                {
                                    !deleteUserIsLoading ?
                                        <>
                                            <DeleteIcon sx={{ fontSize: 30, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                                            <Box sx={{ fontSize: 20, whiteSpace: 'noWrap' }}>{t("buttons.deleteUsers")}</Box>
                                        </>
                                        : <Box sx={{ fontSize: 20, whiteSpace: 'noWrap' }}>{t("messages.deleting")}</Box>
                                }

                            </Stack>
                        </Button>
                    </Stack>
                </Fade >
            </Box>
            {
                props.usersRawData && props.usersRawData.items.length > 0 && selectedUsersId.length == 0 &&
                <Stack alignItems={'center'} sx={{ position: 'fixed', bottom: 50, left: 0, width: 1 }}>
                    {/* PAGINATION */}
                    <Fade in={selectedUsersId.length == 0}>
                        <Paper elevation={0} sx={{ boxShadow: '0px 0px 13px 1px rgba(0,0,0,0.15)', p: 2, borderRadius: 3 }}>
                            <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'center'}>
                                <BelowBreakpoint breakpoint="md" style={{ display: 'none' }}>
                                    <Typography color='textSecondary' sx={{ whiteSpace: 'noWrap', margin: 0 }}>
                                        {currentPage * rowsPerPage - rowsPerPage + 1}-
                                        {Math.min((currentPage) * rowsPerPage, props.usersRawData.totalItems)}{' '}
                                        {t('text.of')} {props.usersRawData.totalItems} {t('text.users')}
                                    </Typography>
                                </BelowBreakpoint>
                                <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} sx={{ margin: '0 !important' }} />
                                <BelowBreakpoint breakpoint="md" style={{ display: 'none' }}>
                                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                        <Typography color='textSecondary' sx={{ borderRadius: 3, whiteSpace: 'noWrap' }} id="rows-label">{t('labels.rowsPerPage')}:</Typography>
                                        <Select
                                            labelId="rows-label"
                                            value={rowsPerPage.toString()}
                                            label="Rows"
                                            onChange={handleChangeRowsPerPage}
                                        >
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={7}>7</MenuItem>
                                            <MenuItem value={15}>15</MenuItem>
                                        </Select>
                                    </Stack>
                                </BelowBreakpoint>
                            </Stack>
                        </Paper>
                    </Fade >
                </Stack>
            }
        </>
    )
}