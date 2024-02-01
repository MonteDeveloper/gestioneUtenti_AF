import AddIcon from '@mui/icons-material/Add';
import { Button, Box, Container } from '@mui/material';
import { SearchBar } from './components/SearchBar';
import { UsersListPanel } from './components/UsersListPanel';
import { getUsers } from '../../service/users/users.api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HeaderFixed from '../../shared/components/HeaderFixed';

export function UsersListPage() {
    const [searchParameter, setSearchParameter] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data: usersListRawData, isLoading: isGetUsersLoading, isError: isGetUsersError } = getUsers(currentPage, searchParameter);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOnSearch = (searchValue: string) => setSearchParameter(searchValue);
    const handleChangePage = (newPage: number) => setCurrentPage(newPage);

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

