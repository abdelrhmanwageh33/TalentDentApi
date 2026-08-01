export interface Product {
  src: string;
  title: string;
  price: number;
  quantity: number;
  inStock: boolean;
}
export interface ProductQuery {
  page?: string;
  limit?: string;
  keyword?: string;
  category?: string;
  featured?: string;
  isBestSeller?: string;
  isNewArrival?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

