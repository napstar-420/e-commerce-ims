/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, Search } from '@mui/icons-material';
import { useTheme } from '@emotion/react';
import { Brand, Category, Product } from '../dto';
import { columns } from '../gridCols/products';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import CreateProduct from '../components/CreateProduct';
import AutoComplete from '../components/AutoComplete';
import config from '../config';

export default function Products() {
  const axios = useAxiosPrivate();
  const theme: Theme = useTheme() as Theme;

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [createProductOpen, setCreateProductOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted: boolean = true;
    const controller = new AbortController();

    const getProducts = async (): Promise<void> => {
      const response = await axios.get(config.API.PRODUCTS);
      const data: Product[] = response.data as Product[];
      isMounted && setProducts(data);
    };

    getProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Box>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateProductOpen(true)}
        >
          Add product
        </Button>
      </Toolbar>
      <Divider />
      <Toolbar
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.spacing(1),
          padding: theme.spacing(2),
        }}
      >
        <TextField
          id="product-search"
          label="Search products"
          variant="outlined"
          type="text"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small">
          <InputLabel id="stock-select-label">Stock</InputLabel>
          <Select
            id="stock-select"
            labelId="stock-select-label"
            label="Stock"
            size="small"
            variant="outlined"
            autoWidth
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          >
            <MenuItem value={1}>In stock</MenuItem>
            <MenuItem value={0}>Out of stock</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="quantity-select-label">Quantity</InputLabel>
          <Select
            id="quantity-select"
            labelId="quantity-select-label"
            label="Quantity"
            variant="outlined"
            size="small"
            autoWidth
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          >
            <MenuItem value={10}>Under 10</MenuItem>
            <MenuItem value={100}>Under 100</MenuItem>
            <MenuItem value={500}>under 500</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel id="price-select-label">Price</InputLabel>
          <Select
            id="price-select"
            labelId="price-select-label"
            label="Quantity"
            variant="outlined"
            size="small"
            autoWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <MenuItem value={10}>under 10$</MenuItem>
            <MenuItem value={50}>under 50$</MenuItem>
            <MenuItem value={100}>under 100$</MenuItem>
            <MenuItem value={500}>under 500$</MenuItem>
            <MenuItem value="">All</MenuItem>
          </Select>
        </FormControl>
        <AutoComplete<Brand>
          id="brand-filter"
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
        <AutoComplete<Category>
          id="category-filter"
          label="Category"
          noOptionsText="No categories found"
          placeholder="Search category"
          query="q"
          setValue={setCategory}
          value={category}
          endpoint={config.API.CATEGORIES}
          getOptionLabel={(option) => option.category_name}
          isOptionEqualToValue={(option, value) =>
            option.category_id === value.category_id
          }
        />
      </Toolbar>
      <Divider />
      <Box sx={{ padding: theme.spacing(4) }}>
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.product_id}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <CreateProduct
        open={createProductOpen}
        handleClose={() => setCreateProductOpen(false)}
      />
    </Box>
  );
}
