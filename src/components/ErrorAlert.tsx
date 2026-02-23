import { Alert, AlertProps, Button } from '@mui/material';

interface ErrorAlertProps extends AlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry, ...props }: ErrorAlertProps) => {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Повторить
          </Button>
        )
      }
      sx={{ mb: 2 }}
      {...props}
    >
      {message}
    </Alert>
  );
};