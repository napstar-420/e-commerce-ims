import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import { v4 as uuid } from "uuid";
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
import axios from '../api/axios';
import { AlertContext } from '../context/Alert';
import Logo from '../assets/images/logo.png';
import Notification from "../components/notification"
import { ApiResponse } from '../dto';

export default function LoginPage() {
  const { actions } = useContext(AlertContext);
  const [email, setEmail] = useState<string>('zohaib@email.com');
  const [password, setPassword] = useState<string>('vsxgvsxhs');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const response: ApiResponse = await axios.login({ email, password });
      console.log(response)
    } catch (error: any) {
      console.log(error);
      actions.addAlert({
        text: error.message,
        type: 'error',
        id: uuid()
      })
    }
  };

  return (
    <Box className='bg-slate-200 min-h-screen grid place-items-center'>
      <Container maxWidth='xs' className='bg-white rounded-lg px-6 py-6 w-96'>
        <Stack spacing={2} alignItems='center' className='py-6'>
          <img src={Logo} alt='logo' width={200} />
          <Typography variant='h5' fontWeight='700'>
            Login to IMS
          </Typography>
        </Stack>
        <Stack
          spacing={2}
          component='form'
          autoComplete='off'
          className='mb-4'
          onSubmit={handleSubmit}
        >
          <TextField
            id='email'
            label='Email'
            variant='outlined'
            type='email'
            required
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
              setEmail(e.target.value)
            }
          />
          <TextField
            id='password'
            label='password'
            variant='outlined'
            type='password'
            required
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
              setPassword(e.target.value)
            }
          />
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
          <Button type='submit' variant='contained'>
            Login
          </Button>
        </Stack>
        <Typography variant='body2' color='grey' textAlign='center'>
          For security purposes we don't allow persistent login.
          Reloading/Closing the IMS Will require you to enter you credentials
          again. ({config.APP_NAME} - IT support)
        </Typography>
        <Dialog
          open={forgotPassword}
          onClose={() => setForgotPassword(false)}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>Forgot Password?</DialogTitle>
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
      <Notification />
    </Box>
  );
}
