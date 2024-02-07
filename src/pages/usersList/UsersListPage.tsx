import AddIcon from '@mui/icons-material/Add';
import { Button, Box, Container } from '@mui/material';
import { SearchBar } from './components/SearchBar';
import { UsersListPanel } from './components/UsersListPanel';
import { getUsers } from '../../service/users/users.api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HeaderFixed from '../../shared/components/HeaderFixed';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { goToPage } from '../../state/pagination/paginationSlice';

export function UsersListPage() {
    const [searchParameter, setSearchParameter] = useState<string>('');

    const dispatch = useDispatch();

    const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);

    const { data: usersListRawData, isLoading: isGetUsersLoading, isError: isGetUsersError } = getUsers(currentPage, rowsPerPage, searchParameter);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOnSearch = (searchValue: string) => setSearchParameter(searchValue);
    const handleChangePage = (newPage: number) => dispatch(goToPage({newCurrentPage: newPage}));

    return (
        <>
            <HeaderFixed components={[
                <SearchBar onSearch={handleOnSearch} />,
                <Button sx={{ borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: 15 }} variant="contained" color="primary" onClick={() => navigate('/create-user')}>
                    <AddIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                    <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>{t('buttons.newUser')}</Box>
                </Button>
            ]} />
            <Container maxWidth="md">
                <Box sx={{ px: 3, width: 1 }}>
                    <UsersListPanel isLoadingUsers={isGetUsersLoading} isError={isGetUsersError} usersRawData={usersListRawData} changePage={handleChangePage} />
                </Box>
            </Container>
        </>
    )
}

