// Типы для продаж
export interface Sale {
  id: string;
  productName: string;
  quantity: number;
  link: string;
  productNumber: string;
  image: string;
  costRub: number;
  costCurrency: number;
  currency?: string;
  salePlace: string;
  additionalExpenses?: number;
  saleDate: string;
  updatedAt: string;
  comment?: string;
}

// Типы для склада
export interface StoreItem {
  id: string;
  productName: string;
  quantity: number;
  link: string;
  productNumber: string;
  image: string;
  purchaseCostRub: number;
  purchaseCostCurrency: number;
  currencyRate: number;
  purchasePlace: string;
  sellerLink: string;
  purchaseDate: string;
  updatedAt: string;
  comment?: string;
  status: 'in_stock';
}

export interface ArchivedItem {
  id: string;
  productName: string;
  quantity: number;
  link: string;
  productNumber: string;
  image: string;
  purchaseCostRub: number;
  purchaseCostCurrency: number;
  currencyRate: number;
  purchasePlace: string;
  sellerLink: string;
  purchaseDate: string;
  updatedAt: string;
  comment?: string;
  archivedAt: string;
}

// Общий тип для отображения в таблице
export type TableItem = StoreItem | ArchivedItem;

// Type guard функции для проверки типа
export const isStoreItem = (item: TableItem): item is StoreItem => {
  return 'status' in item && item.status === 'in_stock';
};

export const isArchivedItem = (item: TableItem): item is ArchivedItem => {
  return 'archivedAt' in item;
};

// Тип для архивного элемента (по сути тот же StoreItem, но с другим статусом)
export interface ArchivedItem extends Omit<StoreItem, 'status'> {
  archivedAt: string;
}

// Форма для создания продажи
export interface CreateSaleDto {
  productName: string;
  quantity: number;
  link: string;
  productNumber: string;
  image: string;
  costRub: number;
  costCurrency: number;
  salePlace: string;
  additionalExpenses?: number;
  saleDate: string;
  comment?: string;
}

// Форма для создания товара на складе
export interface CreateStoreItemDto {
  productName: string;
  quantity: number;
  link: string;
  productNumber: string;
  image: string;
  purchaseCostRub: number;
  purchaseCostCurrency: number;
  currencyRate: number;
  purchasePlace: string;
  sellerLink: string;
  purchaseDate: string;
  comment?: string;
}