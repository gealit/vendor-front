import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { MainPageData } from '../services/main.service';

interface DataTableProps {
  data: MainPageData[];
  onAddToCart: (id: number) => void;
  emptyMessage?: string;
}

export const DataTable = ({
  data,
  onAddToCart,
  emptyMessage = 'Нет данных'
}: DataTableProps) => {
  if (data.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Цена</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.cost} ₽</TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => onAddToCart(row.id)}
                >
                  В корзину
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};