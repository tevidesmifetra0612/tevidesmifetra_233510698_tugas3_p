<script setup>
import { ref } from 'vue';
import Request from './Request.vue';

const emit = defineEmits(['itemSelected']);

const desserts = [
  { id: 1, name: 'Brownies Coklat', price: 15000 },
  { id: 2, name: 'Ice Cream coklat', price: 12000 },
  { id: 3, name: 'Pancake Sirup', price: 15000 }
];

const selectedItem = ref(null);
const currentRequest = ref('');

const emitItem = () => {
  const itemData = {
    category: 'Dessert',
    name: selectedItem.value?.name || '',
    request: currentRequest.value || 'Tidak ada catatan'
  };
  emit('itemSelected', itemData);
  console.log('Dessert emitted:', itemData);
};

const handleSpecialRequest = (note) => {
  currentRequest.value = note;
  emitItem();
};
</script>

<template>
  <q-card class="q-pa-md q-ma-md dessert-bg">
    <q-card-section>
      <div class="text-h6">Pilih Dessert</div>
      <q-select
        filled
        v-model="selectedItem"
        label="Pilih Dessert"
        :options="desserts"
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
.dessert-bg {
  background: #fff7f0;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
}
</style>
