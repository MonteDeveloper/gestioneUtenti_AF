import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

export function ChangeLanguageSelect() {
  const { t, i18n } = useTranslation();

  const [lng, setLng] = useState(localStorage.getItem('language') || i18n.language);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedLanguage = event.target.value;
    setLng(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  useEffect(() => {
    i18n.changeLanguage(lng);
  }, [])

  return (
    <>
      <FormControl sx={{ minWidth: 85 }}>
        <InputLabel sx={{ borderRadius: 3 }} id="language-label">{t('languageLabelSelect')}</InputLabel>
        <Select
          labelId="language-label"
          id="language-simple"
          value={lng}
          label={t("languageLabelSelect")}
          onChange={handleChange}
        >
          <MenuItem value={'en'}>EN</MenuItem>
          <MenuItem value={'it'}>IT</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
