<script setup>
import order from './components/order.vue';
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="justify-center">
        <q-toolbar-title class="text-center">Sistem Pemesanan Temu Nyaman Cafe</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-pa-md">
      <order />
    </q-page-container>
  </q-layout>
</template>
