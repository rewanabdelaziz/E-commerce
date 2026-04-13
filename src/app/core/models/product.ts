export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string
  };
  images: string[];
  creationAt: string;
  updatedAt: string
}
export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  images: string[];
}

