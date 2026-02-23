import { apiService } from './api.service';
import { StoreItem, CreateStoreItemDto, ArchivedItem, TableItem } from '../types/inventory.types';

// Моковые данные для склада
const mockStoreItems: TableItem[] = [
  {
    id: '101',
    productName: 'iPhone 14 Pro',
    quantity: 5,
    link: 'https://example.com/iphone14',
    productNumber: 'IP14P-256-DEEP',
    image: 'https://placehold.net/product-400x400.png',
    purchaseCostRub: 89990,
    purchaseCostCurrency: 1000,
    currencyRate: 90,
    purchasePlace: 'AliExpress',
    sellerLink: 'https://aliexpress.com/seller1',
    purchaseDate: '2024-01-10',
    updatedAt: '2024-01-10',
    comment: 'Ожидают проверки',
    status: 'in_stock'
  },
  {
    id: '102',
    productName: 'iPad Air 5',
    quantity: 3,
    link: 'https://example.com/ipadair',
    productNumber: 'IPA5-64-SPACE',
    image: 'https://placehold.net/product-400x400.png',
    purchaseCostRub: 54990,
    purchaseCostCurrency: 600,
    currencyRate: 91.5,
    purchasePlace: 'eBay',
    sellerLink: 'https://ebay.com/seller2',
    purchaseDate: '2024-01-09',
    updatedAt: '2024-01-09',
    comment: 'Отличное состояние',
    status: 'in_stock'
  },
  {
    id: '103',
    productName: 'Apple Watch Ultra 2',
    quantity: 2,
    link: 'https://example.com/awu2',
    productNumber: 'AWU2-49-ORANGE',
    image: 'https://placehold.net/product-400x400.png',
    purchaseCostRub: 69990,
    purchaseCostCurrency: 780,
    currencyRate: 89.7,
    purchasePlace: 'Amazon',
    sellerLink: 'https://amazon.com/seller3',
    purchaseDate: '2024-01-08',
    updatedAt: '2024-01-08',
    comment: 'Новые, запечатанные',
    status: 'in_stock'
  },
  {
    id: '104',
    productName: 'Mac mini M2',
    quantity: 2,
    link: 'https://example.com/macmini',
    productNumber: 'M2-256-8GB',
    image: 'https://placehold.net/product-400x400.png',
    purchaseCostRub: 64990,
    purchaseCostCurrency: 720,
    currencyRate: 90.2,
    purchasePlace: 'Local supplier',
    sellerLink: 'https://example.com/supplier',
    purchaseDate: '2024-01-07',
    updatedAt: '2024-01-07',
    comment: 'Для офиса',
    status: 'in_stock'
  }
];

// Моковые данные для архива
const mockArchivedItems: ArchivedItem[] = [
  {
    id: '201',
    productName: 'iPhone 12',
    quantity: 10,
    link: 'https://example.com/iphone12',
    productNumber: 'IP12-64-BLACK',
    image: 'https://placehold.net/product-400x400.png',
    purchaseCostRub: 45990,
    purchaseCostCurrency: 500,
    currencyRate: 92,
    purchasePlace: 'China',
    sellerLink: 'https://example.com/seller',
    purchaseDate: '2023-12-01',
    updatedAt: '2023-12-01',
    comment: 'Распродажа остатков',
    archivedAt: '2024-01-01',
  }
];

class StorehouseService {
  private useMock = true;

  async getStoreItems(): Promise<TableItem[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStoreItems;
    }

    try {
      return await apiService.get<StoreItem[]>('/storehouse');
    } catch (error) {
      console.error('Error fetching store items:', error);
      throw error;
    }
  }

  async getArchivedItems(): Promise<ArchivedItem[]> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockArchivedItems;
    }

    try {
      return await apiService.get<ArchivedItem[]>('/storehouse/archived');
    } catch (error) {
      console.error('Error fetching archived items:', error);
      throw error;
    }
  }

  async createStoreItem(data: CreateStoreItemDto): Promise<TableItem> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem: TableItem = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        updatedAt: new Date().toISOString().split('T')[0],
        status: 'in_stock'
      };
      mockStoreItems.unshift(newItem);
      return newItem;
    }

    try {
      return await apiService.post<TableItem>('/storehouse', data);
    } catch (error) {
      console.error('Error creating store item:', error);
      throw error;
    }
  }

  async updateStoreItem(id: string, data: Partial<CreateStoreItemDto>): Promise<TableItem> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockStoreItems.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Item not found');

      mockStoreItems[index] = {
        ...mockStoreItems[index],
        ...data,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return mockStoreItems[index];
    }

    try {
      return await apiService.put<StoreItem>(`/storehouse/${id}`, data);
    } catch (error) {
      console.error('Error updating store item:', error);
      throw error;
    }
  }

  async moveToArchive(id: string): Promise<void> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockStoreItems.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Item not found');

      const item = mockStoreItems[index];
      const archivedItem: ArchivedItem = {
        ...item,
        archivedAt: new Date().toISOString().split('T')[0]
      };

      mockStoreItems.splice(index, 1);
      mockArchivedItems.unshift(archivedItem);
      return;
    }

    try {
      await apiService.post(`/storehouse/${id}/archive`, {});
    } catch (error) {
      console.error('Error moving to archive:', error);
      throw error;
    }
  }

  async moveFromArchive(id: string): Promise<void> {
    if (this.useMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockArchivedItems.findIndex(item => item.id === id);
      if (index === -1) throw new Error('Item not found');

      const item = mockArchivedItems[index];
      const storeItem: StoreItem = {
        ...item,
        status: 'in_stock'
      };

      mockArchivedItems.splice(index, 1);
      mockStoreItems.unshift(storeItem);
      return;
    }

    try {
      await apiService.post(`/storehouse/archive/${id}/restore`, {});
    } catch (error) {
      console.error('Error moving from archive:', error);
      throw error;
    }
  }
}

export const storehouseService = new StorehouseService();