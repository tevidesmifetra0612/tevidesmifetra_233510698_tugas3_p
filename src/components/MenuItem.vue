<script setup>
import { ref, computed } from 'vue';
import ItemCard from './ItemCard.vue';
import { menuItems } from '@/data/menuData.js'; // array semua item

const emit = defineEmits(['orderItemUpdated']);

const selectedCategory = ref(null);

const categoryOptions = [
  { label: 'Makanan', value: 'Makanan' },
  { label: 'Minuman', value: 'Minuman' },
  { label: 'Dessert', value: 'Dessert' }
];

// Filter item berdasarkan kategori yang dipilih
const filteredItems = computed(() =>
  selectedCategory.value
    ? menuItems.filter(item => item.category === selectedCategory.value)
    : []
);

const handleItemUpdate = (itemData) => {
  emit('orderItemUpdated', itemData);
  console.log('MenuItem update:', itemData);
};
</script>

<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <h3 class="text-h6">Pilih Kategori Menu</h3>
      <q-select
        v-model="selectedCategory"
        :options="categoryOptions"
        label="Kategori"
        outlined
        emit-value
        map-options
        dense
        clearable
      />
    </q-card-section>

    <q-card-section v-if="filteredItems.length > 0">
      <div class="menu-items-grid">
        <ItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @itemUpdated="handleItemUpdate"
        />
      </div>
    </q-card-section>

    <q-card-section v-else>
      <p class="text-grey">Silakan pilih kategori menu di atas.</p>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.menu-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 1rem;
}
</style>
