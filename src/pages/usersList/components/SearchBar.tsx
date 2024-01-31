import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormSearch } from "../../../models/form";

interface SearchBarProps {
    onSearch: (searchValue: string) => void;
}

export function SearchBar(props: SearchBarProps) {
    const { t } = useTranslation();
    const { onSearch } = props;

    const {
        register,
        handleSubmit,
        setValue,
    } = useForm<FormSearch>();

    const onSearchSubmit = (data: FormSearch) => {
        onSearch(data.searchValue);
    };

    return (
        <Paper
            elevation={0}
            component="form"
            sx={{
                boxShadow: '0px 0px 13px 1px rgba(0,0,0,0.10)',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                flex: 5,
                borderRadius: 3,
            }}
            onSubmit={handleSubmit(onSearchSubmit)}
        >
            <InputBase
                {...register('searchValue')}
                sx={{ ml: 1, flex: 1 }}
                placeholder={t('searchBarPlaceholder')}
                inputProps={{ 'aria-label': 'search-users' }}
                onChange={(e) => setValue('searchValue', e.target.value)}
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}