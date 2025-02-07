<template>
  <!-- Header Navbar -->
  <top-menu />

  <!-- Tab Menu -->
  <router-view />

  <!-- Footer -->
  <CustomFooter />
</template>

<script setup lang="ts">
import TopMenu from '../components/TopMenu.vue';
import CustomFooter from '../components/CustomFooter.vue';
</script>
