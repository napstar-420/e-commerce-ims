import { GridColDef, GridValueFormatterParams } from '@mui/x-data-grid';
import { Product } from '../dto';

export const columns: GridColDef<Product>[] = [
  {
    field: 'product_id',
    headerName: 'ID',
    width: 90,
  },
  {
    field: 'product_name',
    headerName: 'Name',
    type: 'string',
    width: 150,
  },
  {
    field: 'product_price',
    headerName: 'Price',
    type: 'number',
    width: 90,
    valueFormatter(params: GridValueFormatterParams<number>) {
      return `${params.value} $`
    },
  },
  {
    field: 'product_quantity',
    headerName: 'Quantity',
    type: 'number',
    width: 110,
  },
  {
    field: 'brand_id',
    headerName: 'Brand ID',
    type: 'number',
    width: 90,
  },
  {
    field: 'category_id',
    headerName: 'Category ID',
    type: 'number',
    width: 90,
  },
  {
    field: 'date_updated',
    headerName: 'Last updated on',
    type: 'datetime',
    width: 150,
    valueGetter: (params) => {
      const { date_updated, date_created } = params.row;
      return new Date(date_updated ? date_updated : date_created);
    },
  },
];
