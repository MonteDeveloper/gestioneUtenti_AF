import AddIcon from '@mui/icons-material/Add';
import { Button, Box, Container, Stack } from '@mui/material';
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
import { BelowBreakpoint } from '../../service/responsive/breakpoints';
import BarChartIcon from '@mui/icons-material/BarChart';
import { ModalChartsUsers } from './components/ModalChartsUsers';

export function UsersListPage() {
    const [searchParameter, setSearchParameter] = useState<string>('');

    const dispatch = useDispatch();

    const currentPage = useSelector((state: RootState) => state.pagination.currentPage);
    const rowsPerPage = useSelector((state: RootState) => state.pagination.rowsPerPage);

    const { data: usersListRawData, isLoading: isGetUsersLoading, isError: isGetUsersError } = getUsers(currentPage, rowsPerPage, searchParameter);

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleOnSearch = (searchValue: string) => setSearchParameter(searchValue);
    const handleChangePage = (newPage: number) => dispatch(goToPage({ newCurrentPage: newPage }));

    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const handleClickInfoChart = () => handleOpenChartModal();
    function handleOpenChartModal() {
        setIsChartModalOpen(true);
    }

    return (
        <>
            <HeaderFixed components={[
                <SearchBar onSearch={handleOnSearch} />,
                <Stack direction='row' spacing={2}>
                    <Button sx={{ borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: 15 }} variant="contained" color="primary" onClick={handleClickInfoChart}>
                        <BarChartIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                        <BelowBreakpoint breakpoint='sm' style={{ display: 'none' }}>
                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>
                                {t('buttons.infoChart')}
                            </Box>
                        </BelowBreakpoint>
                    </Button>
                    <Button sx={{ borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1, fontSize: 15 }} variant="contained" color="primary" onClick={() => navigate('/create-user')}>
                        <AddIcon sx={{ fontSize: 20, paddingBottom: .2, whiteSpace: 'noWrap' }} />
                        <BelowBreakpoint breakpoint='sm' style={{ display: 'none' }}>
                            <Box sx={{ fontSize: 15, whiteSpace: 'noWrap' }}>
                                {t('buttons.newUser')}
                            </Box>
                        </BelowBreakpoint>
                    </Button>
                </Stack>
            ]} />
            <Container maxWidth="md">
                <Box sx={{ px: 3, width: 1 }}>
                    <UsersListPanel isLoadingUsers={isGetUsersLoading} isError={isGetUsersError} usersRawData={usersListRawData} changePage={handleChangePage} />
                </Box>

                <ModalChartsUsers isModalOpen={isChartModalOpen} setIsModalOpen={setIsChartModalOpen} />
            </Container>
        </>
    )
}

