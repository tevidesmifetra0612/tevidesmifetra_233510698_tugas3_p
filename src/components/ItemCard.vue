<script setup>
import { ref, watch, computed } from 'vue';
import Request from './Request.vue';

// Import semua gambar
import nasgor from '@/assets/nasgor.jpg';
import mieayam from '@/assets/mieayam.jpg';
import ayam_penyet from '@/assets/ayam_penyet.jpg';
import sate from '@/assets/sate.jpg';
import sopbuntut from '@/assets/sopbuntut.jpg';

import es_teh from '@/assets/es_teh.jpg';
import jus_alpukat from '@/assets/jus_alpukat.jpg';
import kopi_susu from '@/assets/kopi_susu.jpg';
import mineral from '@/assets/mineral.jpg';

import brownies from '@/assets/brownies.jpg';
import ice from '@/assets/ice.jpg';
import pankek from '@/assets/pankek.jpg';

const props = defineProps({
  item: Object
});

const emit = defineEmits(['itemUpdated']);
const quantity = ref(0);
const currentRequest = ref('Tidak ada catatan');

watch([quantity, currentRequest], () => {
  emitItemUpdate();
});

const incrementQuantity = () => quantity.value++;
const decrementQuantity = () => {
  if (quantity.value > 0) quantity.value--;
};

const handleSpecialRequest = (note) => {
  currentRequest.value = note;
  emitItemUpdate();
};

const normalizeName = (name) => name.toLowerCase().trim();

const imageMap = {
  'nasi goreng spesial': nasgor,
  'mie ayam': mieayam,
  'ayam penyet': ayam_penyet,
  'sate': sate,
  'sop buntut': sopbuntut,
  'es teh': es_teh,
  'jus alpukat': jus_alpukat,
  'kopi susu': kopi_susu,
  'air mineral': mineral,
  'brownies': brownies,
  'ice cream': ice,
  'pancake': pankek
};

const itemImage = computed(() => {
  const key = normalizeName(props.item.name);
  return imageMap[key] || '';
});


const emitItemUpdate = () => {
  emit('itemUpdated', {
    id: props.item.id,
    name: props.item.name,
    price: props.item.price,
    quantity: quantity.value,
    subtotal: props.item.price * quantity.value,
    request: currentRequest.value,
    category: props.item.category
  });
};
</script>

<template>
  <q-card class="q-pa-md q-ma-md menu-item-card">
    <!-- Gambar item -->
    <q-img
      :src="itemImage"
      :alt="item.name"
      ratio="16/9"
      class="rounded-borders"
    />

    <q-card-section>
      <div class="text-h6">{{ item.name }}</div>
      <div class="text-subtitle2 text-primary">
        Rp {{ item.price.toLocaleString('id-ID') }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="row items-center q-gutter-sm">
        <q-btn @click="decrementQuantity" :disable="quantity === 0" round dense icon="remove" color="primary" />
        <div class="text-subtitle1">{{ quantity }}</div>
        <q-btn @click="incrementQuantity" round dense icon="add" color="primary" />
      </div>
    </q-card-section>

    <q-card-section v-if="currentRequest !== 'Tidak ada catatan'" class="bg-grey-2 q-pa-sm">
      <div class="text-caption text-grey-8">
        <strong>Catatan:</strong> <i>{{ currentRequest }}</i>
      </div>
    </q-card-section>

    <q-card-section>
      <Request @requestAdded="handleSpecialRequest" />
    </q-card-section>
  </q-card>
</template>

<style scoped>
.menu-item-card {
  max-width: 300px;
}
</style>
