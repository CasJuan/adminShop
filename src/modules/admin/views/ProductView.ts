import { createUpdateProductAction, getProductById } from '@/modules/products/actions';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from '@/modules/commmon/components/CustomInput.vue';
import CustomTextarea from '@/modules/commmon/components/CustomTextarea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required('Este campo es super importante').min(3, 'Mínimo de 3 letras!!!'),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().required().min(1),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextarea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductById(props.productId),
      retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdatesuccess,
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
      // initialValues: product.value,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');
    const { fields: images } = useFieldArray<string>('images');

    const imageFiles = ref<File[]>([]);

    const onSubmit = handleSubmit((values) => {
      const formvalues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };

      mutate(formvalues);
    });

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const filesList = fileInput.files;

      if (!filesList) return;
      if (filesList.length === 0) return;

      for (const imageFile of filesList) {
        imageFiles.value.push(imageFile);
      }
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return;
      }
    });

    watch(
      product,
      () => {
        if (!product) return;

        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(isUpdatesuccess, (value) => {
      if (!value) return;
      toast.success('Producto actualizado correctamente');
      router.replace(`/admin/products/${updatedProduct.value!.id}`);

      resetForm({
        values: updatedProduct.value,
      });
      imageFiles.value = [];
    });

    watch(
      () => props.productId,
      () => {
        refetch();
      },
    );

    return {
      // Properties
      values,
      errors,
      meta,

      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      imageFiles,

      sizes,
      images,

      isPending,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Actions
      onSubmit,
      toggleSize,
      onFileChanged,

      hasSize: (size: string) => {
        const currentSizes = sizes.value.map((s) => s.value);
        return currentSizes.includes(size);
      },
      temporalImageUrl: (imageFile: File) => {
        return URL.createObjectURL(imageFile);
      },
    };
  },
});
