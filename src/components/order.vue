<template>
  <q-card class="order-confirmation-container">
    <q-card-section class="text-center">
      <div class="text-h5 text-blue-grey-10">Konfirmasi Pesanan Kafe Anda</div>
    </q-card-section>

    <template v-if="!orderConfirmed">
      <q-card-section>
        <MenuItemSelector @orderItemUpdated="updateOrderItem" />
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="text-h6 text-blue-grey-10 q-pb-md text-center">Detail Pesanan Anda:</div>
        <q-list bordered v-if="Object.keys(orderedItemsMap).length > 0">
          <q-item v-for="item in filteredOrderedItems" :key="item.id">
            <q-item-section avatar>
               <q-icon name="restaurant_menu" color="primary" v-if="item.category === 'Makanan'" />
               <q-icon name="local_cafe" color="orange-8" v-else-if="item.category === 'Minuman'" />
               <q-icon name="cake" color="pink-5" v-else-if="item.category === 'Dessert'" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
              <q-item-label caption v-if="item.request && item.request !== 'Tidak ada catatan'">
                Catatan: {{ item.request }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ item.quantity }} x Rp {{ item.price.toLocaleString('id-ID') }}
              </q-item-label>
              <q-item-label class="text-weight-bold text-deep-orange-9">
                Rp {{ item.subtotal.toLocaleString('id-ID') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="q-pa-md text-center text-grey-7">
          <p>Belum ada item yang dipesan.</p>
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="text-h6 text-blue-grey-9 q-pb-md text-center">Pilih Metode Pembayaran:</div>
        <q-select
          outlined
          v-model="selectedPaymentMethod"
          :options="paymentMethods"
          label="Metode Pembayaran"
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right" class="total-summary q-pa-md">
        <q-btn
          v-if="lastTransactionDetails"
          color="info"
          label="Lihat Pesanan Terakhir"
          icon="history"
          class="q-mr-md"
          @click="showLastOrderDialog"
        />
        <div class="text-h6 text-weight-bold text-indigo-10">
          Total Pembayaran: Rp {{ totalOrderPrice.toLocaleString('id-ID') }}
        </div>
        <q-btn
          color="primary"
          label="Pesan Sekarang"
          class="q-ml-md"
          :disable="totalOrderPrice === 0 || !selectedPaymentMethod"
          @click="confirmOrder"
        />
      </q-card-actions>
    </template>

    <template v-else>
      <q-card-section class="text-center bg-green-1 text-green-10 q-py-lg">
        <q-icon name="check_circle" size="xl" class="q-mb-md" />
        <div class="text-h5 text-weight-bold">Pesanan Berhasil Dikonfirmasi!</div>
        <div class="text-subtitle1 q-mt-sm">Terima kasih atas pesanan Anda.</div>
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-h6 text-blue-grey-9 q-mb-md">Detail Transaksi:</div>
        <q-list bordered separator>
          <q-item>
            <q-item-section>Nomor Transaksi:</q-item-section>
            <q-item-section side class="text-weight-bold">{{ transactionDetails.transactionId }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Tanggal:</q-item-section>
            <q-item-section side>{{ transactionDetails.date }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Waktu:</q-item-section>
            <q-item-section side>{{ transactionDetails.time }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Total Pembayaran:</q-item-section>
            <q-item-section side class="text-h6 text-deep-orange-9 text-weight-bold">
              Rp {{ transactionDetails.totalPrice.toLocaleString('id-ID') }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Metode Pembayaran:</q-item-section>
            <q-item-section side class="text-weight-bold text-blue-grey-8">
              {{ transactionDetails.paymentMethod }}
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-subtitle1 text-blue-grey-9 q-mt-lg q-mb-md">Item yang Dipesan:</div>
        <q-list bordered v-if="transactionDetails.items.length > 0">
          <q-item v-for="item in transactionDetails.items" :key="item.id">
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
              <q-item-label caption v-if="item.request && item.request !== 'Tidak ada catatan'">
                Catatan: {{ item.request }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ item.quantity }} x Rp {{ item.price.toLocaleString('id-ID') }}
              </q-item-label>
              <q-item-label class="text-weight-bold text-deep-orange-9">
                Rp {{ item.subtotal.toLocaleString('id-ID') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md bg-grey-2">
        <q-btn
          color="secondary"
          label="Pesan Lagi"
          icon="add_shopping_cart"
          @click="startNewOrder"
        />
      </q-card-actions>
    </template>
  </q-card>

  <q-dialog v-model="showLastOrderDialogState">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Detail Pesanan Terakhir</div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="lastTransactionDetails">
        <q-list bordered separator>
          <q-item>
            <q-item-section>Nomor Transaksi:</q-item-section>
            <q-item-section side class="text-weight-bold">{{ lastTransactionDetails.transactionId }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Tanggal:</q-item-section>
            <q-item-section side>{{ lastTransactionDetails.date }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Waktu:</q-item-section>
            <q-item-section side>{{ lastTransactionDetails.time }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Total Pembayaran:</q-item-section>
            <q-item-section side class="text-h6 text-deep-orange-9 text-weight-bold">
              Rp {{ lastTransactionDetails.totalPrice.toLocaleString('id-ID') }}
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Metode Pembayaran:</q-item-section>
            <q-item-section side class="text-weight-bold text-blue-grey-8">
              {{ lastTransactionDetails.paymentMethod }}
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-subtitle1 text-blue-grey-9 q-mt-md q-mb-sm">Item yang Dipesan:</div>
        <q-list bordered v-if="lastTransactionDetails.items.length > 0">
          <q-item v-for="item in lastTransactionDetails.items" :key="item.id">
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
              <q-item-label caption v-if="item.request && item.request !== 'Tidak ada catatan'">
                Catatan: {{ item.request }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                {{ item.quantity }} x Rp {{ item.price.toLocaleString('id-ID') }}
              </q-item-label>
              <q-item-label class="text-weight-bold text-deep-orange-9">
                Rp {{ item.subtotal.toLocaleString('id-ID') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Tutup" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import MenuItemSelector from './MenuItem.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const orderedItemsMap = ref({});
const selectedPaymentMethod = ref(null);
const orderConfirmed = ref(false);
const transactionDetails = ref(null); // Detail transaksi saat ini (setelah konfirmasi)
const lastTransactionDetails = ref(null); // Detail transaksi terakhir yang disimpan

const showLastOrderDialogState = ref(false); // State untuk mengontrol visibilitas dialog

const paymentMethods = [
  'Tunai',
  'Transfer Bank',
  'Kartu Kredit/Debit',
  'E-Wallet (GoPay, OVO, Dana)'
];

const updateOrderItem = (itemData) => {
  if (itemData.quantity === 0 && itemData.request === 'Tidak ada catatan') {
    delete orderedItemsMap.value[itemData.id];
  } else if (itemData.quantity === 0 && itemData.request !== 'Tidak ada catatan') {
      orderedItemsMap.value = {
        ...orderedItemsMap.value,
        [itemData.id]: { ...itemData, quantity: 0 }
      };
  }
  else {
    orderedItemsMap.value = {
      ...orderedItemsMap.value,
      [itemData.id]: itemData
    };
  }
};

const filteredOrderedItems = computed(() => {
  return Object.values(orderedItemsMap.value).filter(item => item.quantity > 0 || item.request !== 'Tidak ada catatan');
});

const totalOrderPrice = computed(() => {
  return filteredOrderedItems.value.reduce((sum, item) => sum + item.subtotal, 0);
});

const confirmOrder = () => {
  if (totalOrderPrice.value > 0 && selectedPaymentMethod.value) {
    const transactionId = 'TRX-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
    const now = new Date();
    const date = now.toLocaleDateString('id-ID');
    const time = now.toLocaleTimeString('id-ID');

    const currentOrderDetails = {
      transactionId: transactionId,
      date: date,
      time: time,
      items: JSON.parse(JSON.stringify(filteredOrderedItems.value)), // Deep copy untuk menyimpan state saat ini
      totalPrice: totalOrderPrice.value,
      paymentMethod: selectedPaymentMethod.value
    };

    transactionDetails.value = currentOrderDetails; // Untuk tampilan konfirmasi saat ini
    lastTransactionDetails.value = currentOrderDetails; // Simpan sebagai transaksi terakhir

    orderConfirmed.value = true;

    $q.notify({
      message: `Pesanan Anda sebesar Rp ${totalOrderPrice.value.toLocaleString('id-ID')} berhasil dikonfirmasi!`,
      caption: `Metode Pembayaran: ${selectedPaymentMethod.value}`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    });

  } else {
    $q.notify({
      message: 'Mohon lengkapi pesanan dan pilih metode pembayaran.',
      color: 'negative',
      icon: 'warning',
      position: 'top',
      timeout: 2000
    });
  }
};

const startNewOrder = () => {
  orderedItemsMap.value = {};
  selectedPaymentMethod.value = null;
  transactionDetails.value = null;
  orderConfirmed.value = false;
  // lastTransactionDetails TIDAK direset di sini, agar tetap tersedia
};

// Fungsi untuk menampilkan dialog pesanan terakhir
const showLastOrderDialog = () => {
  showLastOrderDialogState.value = true;
};
</script>

<style scoped>
.order-confirmation-container {
  max-width: 800px;
  margin: 30px auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  border-radius: 12px;
}
.total-summary {
  background-color: #e8eaf6;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>