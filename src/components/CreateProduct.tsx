import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AutoComplete from './AutoComplete';
import config from '../config';
import { Brand, Category } from '../dto';

interface ComponentProps {
  open: boolean;
  handleClose: () => void;
}

interface InputProps {
  id: string;
  label: string;
  type: 'text' | 'number';
  multiline?: boolean;
  rows?: number;
}

function FormInput(props: InputProps) {
  return (
    <TextField
      {...props}
      autoFocus
      fullWidth
      required
      margin="none"
      variant="outlined"
      size="small"
      autoComplete="off"
    />
  );
}

export default function CreateProduct({ open, handleClose }: ComponentProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <DialogTitle textAlign="center">Add Product</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Required fields are marked with <em>*</em>
        </DialogContentText>
        <form>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <FormInput id="name" label="Name" type="text" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormInput id="price" label="Price" type="number" />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormInput id="quantity" label="Quantity" type="number" />
            </Grid>
            <Grid xs={12} sm={6}>
              <AutoComplete<Brand>
                id="brand-search"
                label="Brand"
                noOptionsText="No brands found"
                placeholder="Search brand"
                query="q"
                setValue={setBrand}
                endpoint={config.API.BRANDS}
                value={brand}
                getOptionLabel={(option) => option.brand_name}
                isOptionEqualToValue={(option, value) =>
                  option.brand_id === value.brand_id
                }
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <AutoComplete<Category>
                id="category-search"
                label="Category"
                noOptionsText="No categories found"
                placeholder="Search category"
                query="q"
                clearOnBlur={false}
                setValue={setCategory}
                value={category}
                endpoint={config.API.CATEGORIES}
                getOptionLabel={(option) => option.category_name}
                isOptionEqualToValue={(option, value) =>
                  option.category_id === value.category_id
                }
              />
            </Grid>
            <Grid xs={12}>
              <FormInput
                id="description"
                label="Description"
                type="text"
                multiline
                rows={5}
              />
            </Grid>
            <Grid xs={12}>
              <Box
                component={'div'}
                p={4}
                border={`2px dashed ${theme.palette.grey[400]}`}
                display="grid"
                justifyItems="center"
                gap={1}
              >
                <Typography>Drag and drop Images here</Typography>
                <Button variant="contained" className="relative">
                  <input
                    type="file"
                    multiple
                    className="absolute cursor-pointer opacity-0"
                    onChange={(e) => console.log(e.target.files)}
                  />
                  Select Images
                </Button>
              </Box>
            </Grid>
          </Grid>
          {/* To support submit on enter */}
          <button hidden type="submit" />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
