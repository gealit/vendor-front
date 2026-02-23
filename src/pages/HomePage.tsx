import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Alert,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { ErrorAlert } from '../components/ErrorAlert';
import { SalesTable } from '../components/SalesTable';
import { StoreTable } from '../components/StoreTable';
import { salesService } from '../services/sales.service';
import { storehouseService } from '../services/storehouse.service';
import { Sale, TableItem } from '../types/inventory.types';

type TabType = 'sales' | 'stock' | 'archive';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('sales');
  const [sales, setSales] = useState<Sale[]>([]);
  const [stock, setStock] = useState<TableItem[]>([]);
  const [archive, setArchive] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState({
    sales: false,
    stock: false,
    archive: false
  });
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadSales = async () => {
    try {
      setLoading(prev => ({ ...prev, sales: true }));
      const data = await salesService.getSales();
      setSales(data);
    } catch (err) {
      setError('Ошибка загрузки продаж');
    } finally {
      setLoading(prev => ({ ...prev, sales: false }));
    }
  };

  const loadStock = async () => {
    try {
      setLoading(prev => ({ ...prev, stock: true }));
      const data = await storehouseService.getStoreItems();
      setStock(data);
    } catch (err) {
      setError('Ошибка загрузки склада');
    } finally {
      setLoading(prev => ({ ...prev, stock: false }));
    }
  };

  const loadArchive = async () => {
    try {
      setLoading(prev => ({ ...prev, archive: true }));
      const data = await storehouseService.getArchivedItems();
      setArchive(data);
    } catch (err) {
      setError('Ошибка загрузки архива');
    } finally {
      setLoading(prev => ({ ...prev, archive: false }));
    }
  };

  useEffect(() => {
    loadSales();
    loadStock();
    loadArchive();
  }, []);

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newTab: TabType) => {
    if (newTab !== null) {
      setActiveTab(newTab);
    }
  };

  const handleAddSale = async (data: any) => {
    try {
      const newSale = await salesService.createSale(data);
      setSales(prev => [newSale, ...prev]);
    } catch (err) {
      setError('Ошибка при добавлении продажи');
    }
  };

  const handleAddStoreItem = async (data: any) => {
    try {
      const newItem = await storehouseService.createStoreItem(data);
      setStock(prev => [newItem, ...prev]);
    } catch (err) {
      setError('Ошибка при добавлении товара');
    }
  };

  const handleEditStoreItem = async (id: string, data: any) => {
    try {
      const updatedItem = await storehouseService.updateStoreItem(id, data);
      setStock(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError('Ошибка при обновлении товара');
    }
  };

  const handleMoveToArchive = async (id: string) => {
    try {
      await storehouseService.moveToArchive(id);
      // Обновляем данные после перемещения
      loadStock();
      loadArchive();
    } catch (err) {
      setError('Ошибка при перемещении в архив');
    }
  };

  const handleMoveFromArchive = async (id: string) => {
    try {
      await storehouseService.moveFromArchive(id);
      // Обновляем данные после перемещения
      loadStock();
      loadArchive();
    } catch (err) {
      setError('Ошибка при восстановлении из архива');
    }
  };

  return (
    <Box>
      <Navbar title="Личный кабинет" />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          {/* <Typography variant="h4">
            Добро пожаловать в личный кабинет!
          </Typography> */}

          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={handleTabChange}
            aria-label="view type"
            size="large"
          >
            <ToggleButton value="sales" aria-label="sales">
              Продажи
            </ToggleButton>
            <ToggleButton value="stock" aria-label="stock">
              Склад
            </ToggleButton>
            <ToggleButton value="archive" aria-label="archive">
              Архив
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
          {user ? `Вы вошли как: ${user.email}` : 'Защищенная страница'}
        </Typography>

        {error && (
          <ErrorAlert
            message={error}
            onRetry={() => {
              setError(null);
              if (activeTab === 'sales') loadSales();
              else if (activeTab === 'stock') loadStock();
              else loadArchive();
            }}
          />
        )}

        <Paper sx={{ p: 3 }}>
          {activeTab === 'sales' && (
            <SalesTable
              data={sales}
              loading={loading.sales}
              onAdd={handleAddSale}
            />
          )}

          {activeTab === 'stock' && (
            <StoreTable
              data={stock}
              loading={loading.stock}
              type="stock"
              onAdd={handleAddStoreItem}
              onEdit={handleEditStoreItem}
              onMoveToArchive={handleMoveToArchive}
            />
          )}

          {activeTab === 'archive' && (
            <StoreTable
              data={archive}
              loading={loading.archive}
              type="archive"
              onAdd={handleAddStoreItem}
              onEdit={handleEditStoreItem}
              onMoveToArchive={handleMoveToArchive}
              onMoveFromArchive={handleMoveFromArchive}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;