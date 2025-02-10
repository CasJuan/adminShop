import { getProductById } from '@/modules/products/actions';
import { useQuery } from '@tanstack/vue-query';
import { defineComponent, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  props: {
    productId: {
      type: String,
      requeride: true,
    },
  },
  setup() {
    const router = useRouter();

    const { data: product } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductById(props.productId),
      retry: false,
    });

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return;
      }
    });

    return {
      //Prperties

      //Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      //Actions
    };
  },
});
