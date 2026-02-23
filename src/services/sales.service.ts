import { apiService } from './api.service';
import { Sale, CreateSaleDto } from '../types/inventory.types';

// Моковые данные для продаж
const mockSales: Sale[] = [
  {
    id: '1',
    productName: 'iPhone 13 Pro Max',
    quantity: 2,
    link: 'https://example.com/iphone13',
    productNumber: 'IP13PM-256-GOLD',
    image: 'https://placehold.net/product-400x400.png',
    costRub: 189990,
    costCurrency: 2100,
    currency: 'USD',
    salePlace: 'Avito',
    additionalExpenses: 500,
    saleDate: '2024-01-15',
    updatedAt: '2024-01-15',
    comment: 'Продано с небольшой уценкой'
  },
  {
    id: '2',
    productName: 'Samsung Galaxy S23 Ultra',
    quantity: 1,
    link: 'https://example.com/s23ultra',
    productNumber: 'SM-S918B',
    image: 'https://placehold.net/product-400x400.png',
    costRub: 109990,
    costCurrency: 1200,
    currency: 'USD',
    salePlace: 'Wildberries',
    additionalExpenses: 300,
    saleDate: '2024-01-14',
    updatedAt: '2024-01-14',
    comment: 'Новый, запечатанный'
  },
  {
    id: '3',
    productName: 'MacBook Pro 14"',
    quantity: 1,
    link: 'https://example.com/mbp14',
    productNumber: 'MBP14-M3-16-512',
    image: 'https://placehold.net/product-400x400.png',
    costRub: 259990,
    costCurrency: 2800,
    currency: 'USD',
    salePlace: 'Ozon',
    additionalExpenses: 1000,
    saleDate: '2024-01-13',
    updatedAt: '2024-01-13',
    comment: 'Продажа корпоративному клиенту'
  },
  {
    id: '4',
    productName: 'AirPods Pro 2',
    quantity: 3,
    link: 'https://example.com/airpods2',
    productNumber: 'APP2-USB-C',
    image: 'https://placehold.net/product-400x400.png',
    costRub: 54990,
    costCurrency: 600,
    currency: 'USD',
    salePlace: 'Яндекс Маркет',
    additionalExpenses: 200,
    saleDate: '2024-01-12',
    updatedAt: '2024-01-12',
    comment: 'Комплект из 3 штук'
  }
];

class SalesService {
  private useMock = true; // Флаг для переключения между моком и реальным API

  async getSales(): Promise<Sale[]> {
    if (this.useMock) {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSales;
    }

    try {
      return await apiService.get<Sale[]>('/sales');
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  async createSale(data: CreateSaleDto): Promise<Sale> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSale: Sale = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString().split('T')[0],
        currency: 'USD'
      };
      mockSales.unshift(newSale);
      return newSale;
    }

    try {
      return await apiService.post<Sale>('/sales', data);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }
}

export const salesService = new SalesService();