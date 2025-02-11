import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interfaces';

export const createUpdateProduct = async (product: Partial<Product>) => {
  if (product.id && product.id !== '') {
    return await updateProduct(product);
  }

  throw new Error('Product ID is required');
};

const updateProduct = async (product: Partial<Product>) => {
  const images: string[] =
    product.images?.map((image) => {
      if (image.startsWith('http')) {
        const imageName = image.split('/').pop();
        return imageName ? image : '';
      }
      return image;
    }) ?? [];

  const productId = product.id;
  delete product.id;
  delete product.user;
  product.images = images;

  try {
    const { data } = await tesloApi.patch<Product>(`/products/${productId}`, product);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating product');
  }
};
