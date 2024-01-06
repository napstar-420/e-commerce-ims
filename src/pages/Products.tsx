/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
import { debounce } from '@mui/material/utils';
import { useTheme } from '@emotion/react';
import { Brand, Category, Product } from '../dto';
import { columns } from '../gridCols/products';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
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
  const [brandsLoading, setBrandsLoading] = useState<boolean>(false);
  const [brandOptions, setBrandOptions] = useState<Brand[]>([]);
  const [brandController, setBrandController] =
    useState<AbortController | null>(null);
  const [category, setCategory] = useState<string>('');
  const [categoryLoading, setCategoryLoading] = useState<boolean>(false);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [categoryController, setCategoryController] =
    useState<AbortController | null>(null);

  const getBrands = useMemo(() => {
    return debounce(async (name) => {
      // If there's an ongoing request, cancel it
      if (brandController) {
        brandController.abort();
        setBrandController(null);
      }

      if (!name) {
        setBrandOptions([]);
        setBrandsLoading(false);
        return;
      }

      // Create a new AbortController for the current request
      const controller = new AbortController();
      setBrandController(controller);
      setBrandsLoading(true);

      try {
        const response = await axios.get(config.API.GET_BRANDS, {
          params: { name },
          signal: controller.signal,
        });

        const data: Brand[] = response.data as Brand[];
        setBrandOptions(data);
      } finally {
        setBrandsLoading(false);
      }
    }, 500);
  }, [axios]);

  const getCategories = useMemo(() => {
    return debounce(async (name) => {
      // If there's an ongoing request, cancel it
      if (categoryController) {
        categoryController.abort();
        setCategoryController(null);
      }

      if (!name) {
        setCategoryOptions([]);
        setCategoryLoading(false);
        return;
      }

      // Create a new AbortController for the current request
      const controller = new AbortController();
      setCategoryController(controller);
      setCategoryLoading(true);

      try {
        const response = await axios.get(config.API.GET_CATEGORIES, {
          params: { name },
          signal: controller.signal,
        });

        const data: Category[] = response.data as Category[];
        setCategoryOptions(data);
      } finally {
        setCategoryLoading(false);
      }
    }, 500);
  }, [axios]);

  useEffect(() => {
    let isMounted: boolean = true;
    const controller = new AbortController();

    const getProducts = async (): Promise<void> => {
      const response = await axios.get(config.API.GET_PRODUCTS);
      const data: Product[] = response.data as Product[];
      isMounted && setProducts(data);
    };

    getProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    getBrands(brand);

    return brandController?.abort();
  }, [brand]);

  useEffect(() => {
    getCategories(category);

    return categoryController?.abort();
  }, [category]);

  return (
    <Box>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" component="h1">
          Products
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
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
        <Autocomplete
          size="small"
          id="brand-search"
          autoComplete
          includeInputInList
          options={brandOptions}
          inputValue={brand}
          loading={brandsLoading}
          noOptionsText="No brands found"
          filterOptions={(x) => x}
          getOptionLabel={(option) => option.brand_name}
          onInputChange={(_, value) => setBrand(value)}
          isOptionEqualToValue={(option, value) =>
            option.brand_id == value.brand_id
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Brand"
              placeholder="Brand name"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {brandsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        <Autocomplete
          size="small"
          id="category-search"
          autoComplete
          includeInputInList
          options={categoryOptions}
          inputValue={category}
          loading={categoryLoading}
          noOptionsText="No categories found"
          filterOptions={(x) => x}
          getOptionLabel={(option) => option.category_name}
          onInputChange={(_, value) => setCategory(value)}
          isOptionEqualToValue={(option, value) =>
            option.category_id == value.category_id
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              placeholder="Category name"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {brandsLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
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
    </Box>
  );
}
