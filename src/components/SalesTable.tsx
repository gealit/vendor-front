import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TableSortLabel,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Sale } from '../types/inventory.types';
import { SaleItemForm } from './SaleFormItem';

interface SalesTableProps {
  data: Sale[];
  loading?: boolean;
  onAdd: (sale: any) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({ data, loading, onAdd }) => {
  const [openForm, setOpenForm] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof Sale>('saleDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (property: keyof Sale) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const columns = [
    { id: 'image', label: 'Фото', sortable: false },
    { id: 'productName', label: 'Наименование', sortable: true },
    { id: 'quantity', label: 'Кол-во', sortable: true },
    { id: 'productNumber', label: 'Номер товара', sortable: true },
    { id: 'costRub', label: 'Цена (руб)', sortable: true },
    { id: 'costCurrency', label: 'Цена (валюта)', sortable: true },
    { id: 'salePlace', label: 'Место продажи', sortable: true },
    { id: 'saleDate', label: 'Дата продажи', sortable: true },
    { id: 'additionalExpenses', label: 'Доп. расходы', sortable: true },
    { id: 'comment', label: 'Комментарий', sortable: true },
    { id: 'actions', label: 'Действия', sortable: false },
  ];

  const handleAddClick = () => {
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
  };

  const handleFormSubmit = (data: any) => {
    onAdd(data);
    setOpenForm(false);
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Продажи</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Добавить продажу
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    position: column.id === 'actions' ? 'sticky' : 'static',
                    right: column.id === 'actions' ? 0 : 'auto',
                    backgroundColor: column.id === 'actions' ? 'primary.main' : 'inherit',
                    zIndex: column.id === 'actions' ? 1 : 0
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id as keyof Sale)}
                      sx={{ color: 'white !important', '& .MuiTableSortLabel-icon': { color: 'white !important' } }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Avatar src={row.image} alt={row.productName} variant="rounded" />
                </TableCell>
                <TableCell>{row.productName}</TableCell>
                <TableCell>{row.quantity}</TableCell>
                <TableCell>{row.productNumber}</TableCell>
                <TableCell>{row.costRub.toLocaleString()} ₽</TableCell>
                <TableCell>{row.costCurrency} {row.currency}</TableCell>
                <TableCell>{row.salePlace}</TableCell>
                <TableCell>{new Date(row.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>{row.additionalExpenses?.toLocaleString()} ₽</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {row.comment}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ position: 'sticky', right: 0, backgroundColor: 'white', minWidth: 100 }}>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SaleItemForm
        open={openForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};