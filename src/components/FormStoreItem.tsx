import React, { useState, useEffect } from 'react';
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
import { CreateStoreItemDto } from '../types/inventory.types';

interface StoreItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoreItemDto) => void;
  initialData?: any;
}

export const StoreItemForm: React.FC<StoreItemFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreateStoreItemDto>(
    initialData || {
      productName: '',
      quantity: 1,
      link: '',
      productNumber: '',
      image: '',
      purchaseCostRub: 0,
      purchaseCostCurrency: 0,
      currencyRate: 90,
      purchasePlace: '',
      sellerLink: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      comment: '',
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        productName: '',
        quantity: 1,
        link: '',
        productNumber: '',
        image: '',
        purchaseCostRub: 0,
        purchaseCostCurrency: 0,
        currencyRate: 90,
        purchasePlace: '',
        sellerLink: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        comment: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('cost') || name === 'quantity' || name === 'currencyRate'
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
        {initialData ? 'Редактировать товар' : 'Добавить товар на склад'}
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
          {/* Исправлено: заменены все item на size */}
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="purchaseCostRub"
                label="Цена покупки (руб)"
                type="number"
                value={formData.purchaseCostRub}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="purchaseCostCurrency"
                label="Цена покупки (валюта)"
                type="number"
                value={formData.purchaseCostCurrency}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                name="currencyRate"
                label="Курс валюты"
                type="number"
                value={formData.currencyRate}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="purchasePlace"
                label="Место покупки"
                value={formData.purchasePlace}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="sellerLink"
                label="Ссылка на продавца"
                value={formData.sellerLink}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="purchaseDate"
                label="Дата покупки"
                type="date"
                value={formData.purchaseDate}
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

export default StoreItemForm;