import { useTheme } from '@mui/material/styles';

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <img src='assets/saleschatbot_Logo_05_Dark_BG.png'/>
  );
};
