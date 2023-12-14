import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import config from '../config';
import Logo from '../assets/images/logo.png';

export default function LoginPage() {
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  return (
    <Box className='bg-slate-200 min-h-screen grid place-items-center'>
      <Container maxWidth='xs' className='bg-white rounded-lg px-6 py-6 w-96'>
        <Stack spacing={2} alignItems='center' className='py-6'>
          <img src={Logo} alt='logo' width={200} />
          <Typography variant='h5' fontWeight='700'>
            Login to IMS
          </Typography>
        </Stack>
        <Stack spacing={2} component='form' autoComplete='off' className='mb-4'>
          <TextField id='email' label='Email' variant='outlined' />
          <TextField id='password' label='password' variant='outlined' />
          <Button className='self-end' onClick={() => setForgotPassword(true)}>
            <Typography
              textAlign='right'
              variant='body2'
              color='primary'
              className='hover:underline cursor-pointer'
            >
              Forgot password?
            </Typography>
          </Button>
          <Button variant='contained'>Login</Button>
        </Stack>
        <Typography variant='body2' color='grey' textAlign='center'>
          For security purposes we don't allow persistent login.
          Reloading/Closing the IMS Will require you to enter you credentials again.
          ({ config.APP_NAME } - IT support)
        </Typography>
        <Dialog
          open={forgotPassword}
          onClose={() => setForgotPassword(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>
            Forgot Password?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Ask admin for resetting your password
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setForgotPassword(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
