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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { TableItem, isStoreItem } from '../types/inventory.types';
import { StoreItemForm } from './FormStoreItem';

interface StoreTableProps {
  data: TableItem[]; // Используем общий тип
  loading?: boolean;
  type: 'stock' | 'archive';
  onAdd: (item: any) => void;
  onEdit: (id: string, item: any) => void;
  onMoveToArchive: (id: string) => void;
  onMoveFromArchive?: (id: string) => void;
}

export const StoreTable: React.FC<StoreTableProps> = ({
  data,
  loading,
  type,
  onAdd,
  onEdit,
  onMoveToArchive,
  onMoveFromArchive,
}) => {
  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TableItem | null>(null);
  const [orderBy, setOrderBy] = useState<keyof TableItem>('purchaseDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (property: keyof TableItem) => {
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
    { id: 'purchaseCostRub', label: 'Цена покупки (руб)', sortable: true },
    { id: 'purchaseCostCurrency', label: 'Цена (валюта)', sortable: true },
    { id: 'currencyRate', label: 'Курс', sortable: true },
    { id: 'purchasePlace', label: 'Место покупки', sortable: true },
    { id: 'purchaseDate', label: 'Дата покупки', sortable: true },
    ...(type === 'archive' ? [{ id: 'archivedAt', label: 'Дата архивации', sortable: true }] : []),
    { id: 'comment', label: 'Комментарий', sortable: true },
    { id: 'actions', label: 'Действия', sortable: false },
  ];

  const handleAddClick = () => {
    setEditingItem(null);
    setOpenForm(true);
  };

  const handleEditClick = (item: TableItem) => {
    if (isStoreItem(item)) {
      setEditingItem(item);
      setOpenForm(true);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (data: any) => {
    if (editingItem && isStoreItem(editingItem)) {
      onEdit(editingItem.id, data);
    } else {
      onAdd(data);
    }
    setOpenForm(false);
    setEditingItem(null);
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {type === 'stock' ? 'Склад' : 'Архив'}
        </Typography>
        {type === 'stock' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Добавить на склад
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: type === 'archive' ? 1500 : 1400 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: type === 'stock' ? 'success.main' : 'grey.600' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    position: column.id === 'actions' ? 'sticky' : 'static',
                    right: column.id === 'actions' ? 0 : 'auto',
                    backgroundColor: column.id === 'actions' ? (type === 'stock' ? 'success.main' : 'grey.600') : 'inherit',
                    zIndex: column.id === 'actions' ? 1 : 0
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id as keyof TableItem)}
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
                <TableCell>
                  <Box>
                    <Typography variant="body2">{row.productName}</Typography>
                    {isStoreItem(row) && row.sellerLink && (
                      <Typography variant="caption" color="primary" component="a" href={row.sellerLink} target="_blank">
                        Ссылка на продавца
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.quantity}
                    size="small"
                    color={row.quantity > 5 ? 'success' : row.quantity > 0 ? 'warning' : 'error'}
                  />
                </TableCell>
                <TableCell>{row.productNumber}</TableCell>
                <TableCell>{row.purchaseCostRub.toLocaleString()} ₽</TableCell>
                <TableCell>{row.purchaseCostCurrency} USD</TableCell>
                <TableCell>{row.currencyRate}</TableCell>
                <TableCell>{row.purchasePlace}</TableCell>
                <TableCell>{new Date(row.purchaseDate).toLocaleDateString()}</TableCell>
                {type === 'archive' && 'archivedAt' in row && (
                  <TableCell>{new Date(row.archivedAt).toLocaleDateString()}</TableCell>
                )}
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {row.comment}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ position: 'sticky', right: 0, backgroundColor: 'white', minWidth: 120 }}>
                  {type === 'stock' && isStoreItem(row) ? (
                    <>
                      <IconButton size="small" color="primary" onClick={() => handleEditClick(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="warning" onClick={() => onMoveToArchive(row.id)}>
                        <ArchiveIcon />
                      </IconButton>
                    </>
                  ) : type === 'archive' && onMoveFromArchive && (
                    <IconButton size="small" color="success" onClick={() => onMoveFromArchive(row.id)}>
                      <UnarchiveIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {type === 'stock' && (
        <StoreItemForm
          open={openForm}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingItem}
        />
      )}
    </>
  );
};