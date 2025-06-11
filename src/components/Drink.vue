<script setup>
import { ref } from 'vue';
import Request from './Request.vue';

const emit = defineEmits(['itemSelected']);

const drinks = [
  { id: 1, name: 'Es Teh Manis', price: 8000 },
  { id: 2, name: 'Kopi Susu', price: 13000 },
  { id: 3, name: 'Jus Alpukat', price: 10000 },
  { id: 4, name: 'Air Mineral', price: 4000 }
];

const selectedItem = ref(null);
const currentRequest = ref('');

const emitItem = () => {
  const itemData = {
    category: 'Minuman',
    name: selectedItem.value?.name || '',
    request: currentRequest.value || 'Tidak ada catatan'
  };
  emit('itemSelected', itemData);
  console.log('Drink emitted:', itemData);
};

const handleSpecialRequest = (note) => {
  currentRequest.value = note;
  emitItem();
};
</script>

<template>
  <q-card class="q-pa-md q-ma-md drink-bg">
    <q-card-section>
      <div class="text-h6">Pilih Minuman</div>
      <q-select
        filled
        v-model="selectedItem"
        label="Pilih Minuman"
        :options="drinks"
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
.drink-bg {
  background: #eaf9ff;
  border: 1px solid #d0ebff;
  border-radius: 12px;
}
</style>
