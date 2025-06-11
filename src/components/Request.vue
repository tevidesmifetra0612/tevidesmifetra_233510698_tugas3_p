<script setup>
import { ref } from 'vue';

const emit = defineEmits(['requestAdded']);
const requestNote = ref('');
const isEmpty = ref(false);

const emitRequest = () => {
  const trimmed = requestNote.value.trim();
  if (trimmed) {
    emit('requestAdded', trimmed);
    console.log('Request emitted:', trimmed);
    requestNote.value = '';
    isEmpty.value = false;
  } else {
    isEmpty.value = true;
  }
};
</script>

<template>
  <q-card flat class="q-pa-md q-my-md">
    <q-card-section>
      <div class="text-subtitle1 q-mb-sm">Tambahkan Catatan Khusus</div>
      <q-input
        v-model="requestNote"
        label="Contoh: Tanpa saus, es terpisah..."
        outlined
        :error="isEmpty"
        error-message="Catatan tidak boleh kosong"
        @keyup.enter="emitRequest"
      />
      <q-btn
        label="Tambah Catatan"
        color="primary"
        class="q-mt-sm"
        @click="emitRequest"
      />
    </q-card-section>
  </q-card>
</template>
