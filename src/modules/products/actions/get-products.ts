import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interfaces';
import { getProductImageAction } from './get-product-immamge.action';

export const getProductsAction = async (page: number = 1, limit: number = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${page * limit}`,
    );

    return data.map((product) => ({
      ...product,
      image: product.images.map(getProductImageAction),
    }));
  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');
  }
};
