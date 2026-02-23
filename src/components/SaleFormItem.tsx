import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CreateSaleDto } from '../types/inventory.types';

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSaleDto) => void;
  initialData?: any;
}

export const SaleItemForm: React.FC<SaleFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateSaleDto>(
    initialData || {
      productName: '',
      quantity: 1,
      link: '',
      productNumber: '',
      image: '',
      costRub: 0,
      costCurrency: 0,
      salePlace: '',
      additionalExpenses: 0,
      saleDate: new Date().toISOString().split('T')[0],
      comment: '',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name === 'quantity' || name === 'additionalExpenses'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? 'Редактировать продажу' : 'Добавить продажу'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {/* Исправлено: используем size вместо item */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="productName"
                label="Наименование товара"
                value={formData.productName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="quantity"
                label="Количество"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="link"
                label="Ссылка на товар"
                value={formData.link}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="productNumber"
                label="Номер товара"
                value={formData.productNumber}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="image"
                label="URL изображения"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="costRub"
                label="Стоимость (руб)"
                type="number"
                value={formData.costRub}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="costCurrency"
                label="Стоимость (валюта)"
                type="number"
                value={formData.costCurrency}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="salePlace"
                label="Место продажи"
                value={formData.salePlace}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="additionalExpenses"
                label="Дополнительные расходы"
                type="number"
                value={formData.additionalExpenses}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="saleDate"
                label="Дата продажи"
                type="date"
                value={formData.saleDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="comment"
                label="Комментарий"
                value={formData.comment}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SaleItemForm;