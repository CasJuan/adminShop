<template>
  <div class="flex justify-center space-x-3 py-10 bg-gray-100">
    <button
      class="flex items-center space-x-1.5 rounded-lg text-white py-1.5 px-4 py bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
    >
      <span>Anteriores</span>
      <ArrowLeftIcon />
    </button>
    <button
      class="flex items-center space-x-1.5 rounded-lg text-white py-1.5 px-4 py bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition-all"
    >
      <span>Siguientes</span>
      <ArrowRightIcon />
    </button>
  </div>
</template>

<script lang="ts">
import ArrowRightIcon from '../../../Icons/ArrowRightIcon.vue;
import ArrowLeftIcon from '../../../Icons/ArrowLeftIcon.vue;

interface Props{

}

defineProps<Props>();
</script>
