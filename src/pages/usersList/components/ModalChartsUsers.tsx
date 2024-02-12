import React, { useState } from 'react';
import { addWeeks, endOfWeek, format, startOfMonth, endOfMonth, parseISO, startOfWeek, isAfter, isSameMonth, eachDayOfInterval, isSameYear, addMonths, addYears, eachMonthOfInterval, startOfYear, endOfYear, getYear } from 'date-fns';
import { LineChart } from '@mui/x-charts/LineChart';
import { Button, Modal, Paper, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAllUsers } from "../../../service/users/users.api";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { getCurrentLocale } from '../../../locales/i18n';
import { toCapitalize } from '../../../shared/utility';

interface PropsModalChartsUsers {
    setIsModalOpen: (isOpen: boolean) => void;
    isModalOpen: boolean;
}

interface NewUserCount {
    [key: string]: number;
}

export function ModalChartsUsers(props: PropsModalChartsUsers) {
    const { setIsModalOpen, isModalOpen } = props;
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<string>('weekly');

    const { data: allUsers } = getAllUsers();

    const handlePrevious = () => {
        if (canPreviousDate()) {
            switch (viewMode) {
                case 'weekly':
                    setSelectedDate(prevDate => addWeeks(prevDate, -1));
                    break;
                case 'monthly':
                    setSelectedDate(prevDate => addMonths(prevDate, -1));
                    break;
                case 'yearly':
                    setSelectedDate(prevDate => addYears(prevDate, -1));
                    break;
                default:
                    throw new Error('Modalità non valida.');
            }
        }

    };

    const handleNext = () => {
        if(canNextDate()){
            let nextDate;
            switch (viewMode) {
                case 'weekly':
                    nextDate = addWeeks(startOfWeek(selectedDate, { weekStartsOn: 1 }), 1);
                    break;
                case 'monthly':
                    nextDate = addMonths(startOfMonth(selectedDate), 1);
                    break;
                case 'yearly':
                    nextDate = addYears(startOfYear(selectedDate), 1);
                    break;
                default:
                    throw new Error('Modalità non valida.');
            }
    
            setSelectedDate(nextDate);
        }
    };

    const canPreviousDate = (): boolean => {
        return getYear(selectedDate) > 2001;
    };

    const canNextDate = (): boolean => {
        const today = new Date();
        let todayStartMode;
        let nextDate;
        
        switch (viewMode) {
            case 'weekly':
                nextDate = addWeeks(startOfWeek(selectedDate, { weekStartsOn: 1 }), 1);
                todayStartMode = startOfWeek(today, { weekStartsOn: 1 });
                break;
            case 'monthly':
                nextDate = addMonths(startOfMonth(selectedDate), 1);
                todayStartMode = startOfMonth(today);
                break;
            case 'yearly':
                nextDate = addYears(startOfYear(selectedDate), 1);
                todayStartMode = startOfYear(today);
                break;
            default:
                throw new Error('Modalità non valida.');
        }
    
        return !isAfter(nextDate, todayStartMode);
    };
    
    

    const handleChangeViewMode = (
        event: React.MouseEvent<HTMLElement>,
        newViewMode: string,
    ) => {
        setViewMode(newViewMode);
        setSelectedDate(new Date());
    };

    const getWeekLabel = () => {
        const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const endOfWeekDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const startDay = format(startOfWeekDate, 'dd/MM/yy', { locale: getCurrentLocale() });
        const endDay = format(endOfWeekDate, 'dd/MM/yy', { locale: getCurrentLocale() });
        return `${startDay} - ${endDay}`;
    };

    const getMonthLabel = () => {
        return toCapitalize(format(selectedDate, 'MMMM yyyy', { locale: getCurrentLocale() }));
    };

    const getYearLabel = () => {
        return format(selectedDate, 'yyyy', { locale: getCurrentLocale() });
    };

    const getLabel = () => {
        switch (viewMode) {
            case 'weekly':
                return getWeekLabel();
            case 'monthly':
                return getMonthLabel();
            case 'yearly':
                return getYearLabel();
            default:
                throw new Error('Modalità non valida.');
        }
    };

    const calculateWeeklyUsersOverTime = () => {

        const newUserCountByDayOfWeek: NewUserCount = {};

        const daysOfWeek = eachDayOfInterval({ start: startOfWeek(selectedDate, { weekStartsOn: 1 }), end: endOfWeek(selectedDate, { weekStartsOn: 1 }) });

        daysOfWeek.forEach(day => {
            newUserCountByDayOfWeek[toCapitalize(format(day, 'EEE', { locale: getCurrentLocale() }))] = 0;
        });

        if (allUsers !== undefined) {
            allUsers.forEach(user => {
                const userCreationDate = parseISO(user.created);
                if (startOfWeek(userCreationDate, { weekStartsOn: 1 }) <= selectedDate && selectedDate <= endOfWeek(userCreationDate, { weekStartsOn: 1 })) {
                    const dayOfWeek = toCapitalize(format(userCreationDate, 'EEE', { locale: getCurrentLocale() }));
                    newUserCountByDayOfWeek[dayOfWeek] += 1;
                }
            });

            const xAxisData = Object.keys(newUserCountByDayOfWeek);
            const seriesData = Object.values(newUserCountByDayOfWeek);

            return { xAxisData, seriesData };
        }
        return { xAxisData: [], seriesData: [] };
    };

    const calculateMonthlyUsersOverTime = () => {
        const newUserCountByDayOfMonth: NewUserCount = {};

        const allDaysOfMonth = eachDayOfInterval({ start: startOfMonth(selectedDate), end: endOfMonth(selectedDate) });

        allDaysOfMonth.forEach(day => {
            newUserCountByDayOfMonth[format(day, 'd', { locale: getCurrentLocale() })] = 0;
        });

        if (allUsers !== undefined) {
            allUsers.forEach(user => {
                const userCreationDate = parseISO(user.created);
                if (isSameMonth(userCreationDate, selectedDate)) {
                    const dayOfMonth = format(userCreationDate, 'd', { locale: getCurrentLocale() });
                    newUserCountByDayOfMonth[dayOfMonth] += 1;
                }
            });
        }

        const xAxisData = Object.keys(newUserCountByDayOfMonth);
        const seriesData = Object.values(newUserCountByDayOfMonth);

        return { xAxisData, seriesData };
    };

    const calculateYearlyUsersOverTime = () => {
        const newUserCountByMonthOfYear: NewUserCount = {};

        const allMonthsOfYear = eachMonthOfInterval({ start: startOfYear(selectedDate), end: endOfYear(selectedDate) });

        allMonthsOfYear.forEach(month => {
            newUserCountByMonthOfYear[toCapitalize(format(month, 'MMMM', { locale: getCurrentLocale() }))] = 0;
        })

        if (allUsers !== undefined) {
            allUsers.forEach(user => {
                const userCreationDate = parseISO(user.created);
                if (isSameYear(userCreationDate, selectedDate)) {
                    const monthOfYear = toCapitalize(format(userCreationDate, 'MMMM', { locale: getCurrentLocale() }));
                    newUserCountByMonthOfYear[monthOfYear] += 1;
                }
            });
        }

        const xAxisData = Object.keys(newUserCountByMonthOfYear);
        const seriesData = Object.values(newUserCountByMonthOfYear);

        return { xAxisData, seriesData };
    };

    const calculateUsersOverTime = () => {
        switch (viewMode) {
            case 'weekly':
                return calculateWeeklyUsersOverTime();
            case 'monthly':
                return calculateMonthlyUsersOverTime();
            case 'yearly':
                return calculateYearlyUsersOverTime();
            default:
                throw new Error('Modalità non valida.');
        }
    };

    const chartData = calculateUsersOverTime();

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-edit-user"
                aria-describedby="modal-edit-user-description"
            >
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
                    <Stack spacing={4} alignItems={'center'}>
                        <Typography variant='h4'>{t('titles.newUsersChart')}</Typography>
                        <Stack spacing={1} alignItems={'center'}>
                            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
                                <ToggleButtonGroup
                                    value={viewMode}
                                    exclusive
                                    onChange={handleChangeViewMode}
                                    aria-label="text alignment"
                                >
                                    <ToggleButton value="weekly">
                                        {t('buttons.week')}
                                    </ToggleButton>
                                    <ToggleButton value="monthly">
                                        {t('buttons.month')}
                                    </ToggleButton>
                                    <ToggleButton value="yearly">
                                        {t('buttons.year')}
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                            {
                                chartData && allUsers &&

                                <LineChart
                                    xAxis={[{
                                        scaleType: 'point',
                                        data: chartData.xAxisData
                                    }]}
                                    series={[{
                                        data: chartData.seriesData
                                    }]}
                                    width={viewMode === 'weekly' ? 500 : 900}
                                    height={300}
                                />
                                //FAKE DATA TESTING------------------------------------
                                // <LineChart
                                //     xAxis={[{
                                //         scaleType: 'point',
                                //         data: Array.from({ length: 31 }, (_, index) => (index + 1).toString()), 
                                //         label: 'Gennaio 2024' 
                                //     }]}
                                //     series={[{
                                //         data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 30)), 
                                //         label: "Nuovi Utenti"
                                //     }]}
                                //     width={1000} 
                                //     height={400}
                                // />
                            }
                            <Stack direction={'row'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                                <Button disabled={!canPreviousDate()} onClick={handlePrevious}><ArrowLeftIcon /></Button>
                                <Typography>{getLabel()}</Typography>
                                <Button disabled={!canNextDate()} onClick={handleNext}><ArrowRightIcon /></Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Modal>
        </>
    )
}
