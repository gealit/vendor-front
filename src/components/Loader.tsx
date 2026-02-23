import { CircularProgress, Box, Typography } from '@mui/material';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loader = ({ message = 'Загрузка...', fullScreen = false }: LoaderProps) => {
  const sx = fullScreen
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
    : { display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 };

  return (
    <Box sx={sx}>
      <CircularProgress size={40} />
      {message && (
        <Typography variant="body1" sx={{ ml: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};