import { Stack, Box, Typography, Container, Paper, Button, Switch } from '@mui/material';
import { ChangeLanguageSelect } from './ChangeLanguageSelect';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../state/theme/themeSlice';
import { RootState } from '../../state/store';

interface PropsHeaderFixed {
    components: ReactElement[];
}

interface TitlesPages {
    [key: string]: string;
}

export default function HeaderFixed(props: PropsHeaderFixed) {
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    const page = pathParts[1];

    const { t } = useTranslation();

    const currentTheme = useSelector((state: RootState) => state.theme.currentTheme)

    const dispatch = useDispatch();

    const titlesPages: TitlesPages = {
        "users-list": "userList",
        "user-info": "userInfo",
        "create-user": "newUser",
    }

    return (
        <>
            <Box sx={{ position: 'fixed', start: 0, top: 0, zIndex: 99, width: 1 }}>
                <Stack spacing={2} alignItems={'center'}>
                    <Paper elevation={0} sx={{ boxShadow: '0px 0px 13px 1px rgba(0,0,0,0.10)', width: 1, py: 2, px: 3, borderRadius: 0 }}>
                        <Container>
                            <Stack width={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box>
                                    <Typography variant="h4">
                                        {t(`titles.${titlesPages[page]}Page`)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>
                                        {t(`subtitles.${titlesPages[page]}Page`)}
                                    </Typography>
                                </Box>
                                <Stack direction={'row'} spacing={2} alignItems={'center'}>
                                    <Switch
                                        checked={currentTheme === 'dark'}
                                        onChange={() => dispatch(toggleTheme())}
                                        color="default"
                                        icon={<WbSunnyIcon sx={{bgcolor:'#176ec3', p: .5, borderRadius: "100%", transform: 'translateY(-8%)' }} />}
                                        checkedIcon={<NightsStayIcon sx={{bgcolor:'#7db0d9', color: 'black', p: .5, borderRadius: "100%", transform: 'translateY(-8%)' }} />}
                                    />
                                    <ChangeLanguageSelect />
                                </Stack>
                            </Stack>
                        </Container>
                    </Paper>

                    <Container>
                        <Stack direction={'row'} justifyContent={'space-between'} spacing={2} width={1}>
                            {
                                props.components.map((component, index) => (
                                    <React.Fragment key={index}>
                                        {component}
                                    </React.Fragment>
                                ))
                            }
                        </Stack>
                    </Container>
                </Stack>
            </Box>
        </>
    )
}

