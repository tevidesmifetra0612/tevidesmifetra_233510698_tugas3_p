<script setup>
import { ref } from 'vue';
import Request from './Request.vue';

const emit = defineEmits(['itemSelected']);

const foods = [
  { id: 1, name: 'Nasi Goreng Spesial', price: 13000 },
  { id: 2, name: 'Mie Goreng Ayam', price: 15000 },
  { id: 3, name: 'Sop Buntut', price: 25000 },
  { id: 4, name: 'Ayam Penyet', price: 20000 }
];

const selectedItem = ref(null);
const currentRequest = ref('');

const emitItem = () => {
  const itemData = {
    category: 'Makanan',
    name: selectedItem.value?.name || '',
    request: currentRequest.value || 'Tidak ada catatan'
  };
  emit('itemSelected', itemData);
  console.log('Food emitted:', itemData);
};

const handleSpecialRequest = (note) => {
  currentRequest.value = note;
  emitItem();
};
</script>

<template>
  <q-card class="q-pa-md q-ma-md food-bg">
    <q-card-section>
      <div class="text-h6">Pilih Makanan</div>
      <q-select
        filled
        v-model="selectedItem"
        label="Pilih Makanan"
        :options="foods"
        option-label="name"
        emit-value
        map-options
        @update:model-value="emitItem"
      >
        <template #option="scope">
          <q-item>
            <q-item-section>
              {{ scope.opt.name }} (Rp {{ scope.opt.price }})
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>

    <q-card-section>
      <Request @requestAdded="handleSpecialRequest" />
    </q-card-section>
  </q-card>
</template>

<style scoped>
.food-bg {
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  border-radius: 12px;
}
</style>
