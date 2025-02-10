import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interfaces';
import { getProductImageAction } from './get-product-immamge.action';

export const getProductById = async (productId: string) => {
  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);
    return {
      ...data,
      image: data.images.map(getProductImageAction),
    };
  } catch (error) {
    console.log(error);
    throw new Error(`Error ${productId}`);
  }
};
