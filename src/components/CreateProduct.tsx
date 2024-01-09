import { ChangeEvent, useState, DragEvent, useEffect } from 'react';
import {
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  Box,
  Grid,
  DialogTitle,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListSubheader,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GridCloseIcon } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import AutoComplete from './AutoComplete';
import { useAlert } from '../hooks/useAlert';
import { Brand, Category } from '../dto';
import { formatFileSize } from '../utils';
import config from '../config';
import { v4 as uuid } from 'uuid';

interface ComponentProps {
  open: boolean;
  handleClose: () => void;
}

interface InputProps {
  id: string;
  label: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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

interface ProductImagesProps {
  images: File[];
  setImages: (images: File[]) => void;
}

function ProductImages({ images, setImages }: ProductImagesProps) {
  const height = 164;
  const theme = useTheme();

  if (!images.length) {
    return;
  }

  const removeImage = (index: number): void => {
    const newImages = images.slice(0, index).concat(images.slice(index + 1));
    setImages(newImages);
  };

  return (
    <ImageList
      cols={3}
      sx={{ paddingTop: theme.spacing(2), paddingBottom: theme.spacing(2) }}
    >
      <ImageListItem key="Subheader" cols={3}>
        <ListSubheader
          component="div"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          Product images
        </ListSubheader>
      </ImageListItem>
      {images.map((image, index) => {
        const imgSrc = URL.createObjectURL(image);
        const fileSize = formatFileSize(image.size);

        return (
          <ImageListItem key={index}>
            <img src={imgSrc} style={{ height: height }} loading="lazy" />
            <ImageListItemBar
              title={image.name}
              subtitle={fileSize}
              actionIcon={
                <IconButton
                  sx={{ color: theme.palette.error.main }}
                  onClick={() => removeImage(index)}
                >
                  <GridCloseIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}

export default function CreateProduct({ open, handleClose }: ComponentProps) {
  const theme = useTheme();
  const { actions: Alert } = useAlert();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragStart = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnd = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;

    if (files) {
      setImages([...images, ...files]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;

    if (files) {
      setImages([...images, ...files]);
    }
  };

  const resetStates = (): void => {
    setName('');
    setPrice(0);
    setQuantity(0);
    setDescription('');
    setBrand('');
    setCategory('');
    setImages([]);
  };

  useEffect(() => {
    if (images.length > 10) {
      setImages(images.slice(0, 10));
      Alert.addAlert({
        id: uuid(),
        text: '10 images are allowed',
        title: 'MAX IMAGES LIMIT',
        type: 'warning',
      });
    }
  }, [images]);

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
            <Grid item xs={12}>
              <FormInput
                id="name"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                id="price"
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormInput
                id="quantity"
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12}>
              <FormInput
                id="description"
                label="Description"
                type="text"
                multiline
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                p={4}
                border={`2px dashed ${theme.palette.grey[400]}`}
                borderRadius={2}
                position="relative"
                display="grid"
                justifyItems="center"
                alignItems="center"
                gap={1}
                color={
                  isDragging
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary
                }
                bgcolor={
                  isDragging
                    ? theme.palette.primary.main
                    : theme.palette.background.default
                }
              >
                <Typography textAlign="center">
                  Drag and drop Images here
                  <br /> Or click to select images
                </Typography>
                <label
                  htmlFor="images-input"
                  onDragOver={handleDragStart}
                  onDragLeave={handleDragEnd}
                  onDrop={handleDrop}
                  className="absolute top-0 left-0 w-full h-full cursor-pointer"
                >
                  <input
                    id="images-input"
                    name="images-input"
                    hidden
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </Box>
            </Grid>
          </Grid>
          {/* To support submit on enter */}
          <button hidden type="submit" />
        </form>
        <ProductImages images={images} setImages={setImages} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetStates();
            handleClose();
          }}
          color="error"
        >
          Cancel
        </Button>
        <Button onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
