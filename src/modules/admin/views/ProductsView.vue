<template>
  <div class="bg-white px-5 py-2 rounded">
    <h1 class="text-3xl">Productos</h1>
    <div class="py-8 w-full">
      <div class="shadow overflow-hidden rounded border-b border-gray-200">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="w-10 text-left py-3 px-4 uppercase font-semibold text-sm">Iamgen</th>
              <th class="flex-1 text-left py-3 px-4 uppercase font-semibold text-sm">Titulo</th>
              <th class="w-28 py-3 px-4 uppercase font-semibold text-sm">Precio</th>
              <th class="w-60 text-left py-3 px-4 uppercase font-semibold text-sm">
                Tallas disponibles
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr
              v-for="(product, index) in products"
              :key="product.id"
              :class="{
                'bg-gray-100': index % 2 === 0,
              }"
            >
              <td class="text-left py-3 px-4">
                <img :src="product.images[0]" :alt="product.title" class="h-10 w-10 object-cover" />
              </td>
              <td class="text-left py-3 px-4">
                <router-link
                  :to="`/admin/products/${products.id}`"
                  class="hover:text-blue-500 hover:underline"
                  >{{ product.title }}</router-link
                >
              </td>
              <td class="text-left py-3 px-4">
                <a class="hover:text-blue-500" href="tel:622322662">
                  <span class="bg-blue-200 text-blue-600 py-1 px-3 rounded-full text-xs">
                    ${{ product.price }}
                  </span>
                </a>
              </td>
              <td class="text-left py-3 px-4">{{ product.size.join(',') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ButtonPagination :page="page" , :has-more-data="!!products && products.length < 10" />
  </div>
</template>

<script lang="ts" setup>
import ButtonPagination from '@/modules/commmon/components/ButtonPagination.vue';
import { usePagination } from '@/modules/commmon/composables/usePagination';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { watchEffect } from 'vue';

const queryCliente = useQueryClient();
const { page } = usePagination();

console.log({ page });

const { data: products = [] } = useQuery({
  queryKey: ['products', { page: page }],
  queryFn: () => getProductsAction(page.value),
});

watchEffect(() => {
  queryCliente.prefetchQuery({
    queryKey: ['products', { page: page.value + 1 }],
    queryFn: () => getProductsAction(page.value),
  });
});
</script>
