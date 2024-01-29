import { Stack, Box, Typography, Container, Paper } from '@mui/material';
import { ChangeLanguageSelect } from '../../shared/ChangeLanguageSelect';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';
import React from 'react';
import { useLocation } from 'react-router-dom';

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

    const titlesPages: TitlesPages = {
        "users-list": "usersList",
        "user-info": "userInfo",
        "create-user": "newUser",
    }

    return (
        <>
            <Box sx={{ position: 'fixed', start: 0, top: 0, zIndex: 99, width: 1 }}>
                <Stack spacing={2} alignItems={'center'}>
                    <Paper elevation={0} sx={{ boxShadow: '0px 0px 13px 1px rgba(0,0,0,0.10)', backgroundColor: 'white', width: 1, py: 2, px: 3, borderRadius: 0 }}>
                        <Container>
                            <Stack width={1} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                <Box>
                                    <Typography variant="h4">
                                        {t(`${titlesPages[page]}PageTitle`)}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" gutterBottom>
                                        {t(`${titlesPages[page]}PageSubtitle`)}
                                    </Typography>
                                </Box>
                                <ChangeLanguageSelect />
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

