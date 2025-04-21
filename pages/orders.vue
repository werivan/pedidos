<template>
  <div id="order_index">
    <div>
      <v-breadcrumbs :items="items" large></v-breadcrumbs>
    </div>
    <div>
      <v-card>
        <v-card-title color="primary">
          Pedidos
          <v-spacer></v-spacer>
          <v-text-field
            v-if="!isLoading"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <div class="btn-link mr-9" @click="goToCreateOrder()">
            <v-icon>mdi-plus</v-icon>
            <span>Crear pedido</span>
          </div>
        </v-card-title>
        <div class="center-container" v-if="isLoading">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>Cargando...</span>
        </div>
        <div v-if="!isLoading && this.resultItems.length > 0">
          <v-data-table
            fixed-header
            height="56vh"
            class="max-height-table-orders ma-3"
            :headers="headers"
            :items="resultItems"
            :search="search"
            :expanded="expandedTable"
          >
            <template v-slot:item="{ item }">
              <tr
                @click="toggleRow(item)"
                :class="expandedTable.includes(item.id) ? 'expand-row cursor' : 'cursor'"
              >
                <td>{{ item.userID }}</td>
                <td>
                  <div :class="item.estado + '_status'">
                    <v-icon>mdi-circle</v-icon>
                    <span>{{ getTextByValue(item.estado) }}</span>
                  </div>
                </td>
                <td>{{ item.cliente }}</td>
                <td>{{ formatDate(item.fechaOrden) }}</td>
                <td>
                  <div class="actions">
                    <div class="icon-see" @click="goToSeeAction(item)">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on">mdi-eye</v-icon>
                        </template>
                        <span>Ver mas Detalles</span>
                      </v-tooltip>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="expandedTable.includes(item.id)" style="background: #eee">
                <td :colspan="headers.length">
                  <v-data-table
                    :headers="subHeaders"
                    :items="[item.producto]"
                    hide-default-footer
                    class="ma-5"
                  >
                    <template v-slot:[`item.sku`]="{ item }">
                      {{ item.sku }}
                    </template>
                    <template v-slot:[`item.nombre`]="{ item }">
                      {{ item.nombre }}
                    </template>
                    <template v-slot:[`item.cantidad`]="{ item }">
                      {{ item.cantidad }}
                    </template>
                    <template v-slot:[`item.precioUnitario`]="{ item }">
                      {{ formatMoney(item.precioUnitario) }}
                    </template>
                  </v-data-table>
                </td>
              </tr>
            </template>
            <template v-slot:expanded-item="{}"> </template>
            <template v-slot:no-results>
              <v-alert :value="true" color="error" icon="mdi-alert">
                Tu busqueda para "{{ search }}" no obtuvo resultados.
              </v-alert>
            </template>
          </v-data-table>
        </div>
        <div class="center-container" v-if="!isLoading && this.resultItems.length === 0">
          <v-icon>mdi-alert-circle-outline</v-icon>
          <span>No hay resultados</span>
        </div>
      </v-card>
    </div>
    <v-dialog v-model="dialog" width="500">
      <v-card class="modal-mod">
        <v-card-title class="title-modal-mod"> Creación de pedidos</v-card-title>
        <v-divider style="margin-bottom: 20px"></v-divider>
        <div class="text-modal-mod">
          <v-form @submit.prevent="submitForm" ref="form">
            <v-text-field v-model="newOrder.userID" label="ID de Usuario" required></v-text-field>
            <v-text-field v-model="newOrder.email" label="Email" required></v-text-field>
            <v-text-field v-model="newOrder.cliente" label="Cliente" required></v-text-field>
            <v-text-field
              v-model="newOrder.direccionEnvio"
              label="Dirección de Envío"
              required
            ></v-text-field>
            <v-select
              v-model="newOrder.metodoPago"
              :items="metodosPago"
              label="Método de Pago"
              required
            ></v-select>
            <!-- producto -->
            <v-card class="pa-3 mt-4">
              <v-card-title class="mb-4" style="width: 100%">Producto</v-card-title>
              <v-select
                v-model="newOrder.producto.sku"
                :items="dummyProducts"
                item-text="sku"
                item-value="sku"
                label="SKU"
                required
                @change="onSkuSelected"
              />
              <v-text-field
                v-model="newOrder.producto.nombre"
                label="Nombre del producto"
                disabled
                required
              ></v-text-field>
              <v-text-field
                v-model.number="newOrder.producto.cantidad"
                label="Cantidad"
                type="number"
                required
              ></v-text-field>
            </v-card>
          </v-form>
        </div>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="postOrder()" :disabled="!isOrderValid">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogNewOrder" max-width="400">
      <v-card
        :color="dialogNewOrderMessage.orderId ? 'green lighten-4' : 'red lighten-4'"
        class="pa-4"
      >
        <v-card-title class="headline">
          {{ dialogNewOrderMessage.orderId ? 'Éxito' : 'Error' }}
        </v-card-title>
        <v-card-text>
          {{ dialogNewOrderMessage.message }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialogNewOrders()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogOrder" max-width="600px">
      <v-card>
        <v-card-title class="headline">
          {{
            isLoadingProductComplete
              ? 'Detalle del Producto'
              : productComplete.producto.sku + ' - ' + productComplete.producto.nombre
          }}
        </v-card-title>
        <div class="center-container" v-if="isLoadingProductComplete">
          <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>Cargando...</span>
        </div>
        <v-card-text v-if="!isLoadingProductComplete">
          <v-list dense>
            <v-list-item>
              <v-list-item-content
                ><strong>SKU:</strong> {{ productComplete.producto.sku }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Nombre:</strong> {{ productComplete.producto.nombre }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Cantidad:</strong>
                {{ productComplete.producto.cantidad }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <strong>Precio Unitario:</strong>
                {{ formatMoney(productComplete.producto.precioUnitario) }}
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Método de Pago:</strong>
                {{ productComplete.metodoPago }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Cliente:</strong> {{ productComplete.cliente }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Dirección de Envío:</strong>
                {{ productComplete.direccionEnvio }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Usuario:</strong> {{ productComplete.userID }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Email:</strong> {{ productComplete.email }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Fecha de Orden:</strong>
                {{ productComplete.fechaOrden }}</v-list-item-content
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-content
                ><strong>Estado:</strong>
                <div :class="productComplete.estado + '_status'">
                  <v-icon>mdi-circle</v-icon>
                  <span>{{ getTextByValue(productComplete.estado) }}</span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogOrder = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import OrdersServices from '~/services/OrdersServices'
import DummyApiServices from '~/services/DummyApiServices'

export default {
  name: 'orders-index-page',
  data: () => ({
    items: [
      {
        text: 'Home',
        disabled: false,
        href: '/'
      },
      {
        text: 'orders',
        disabled: true,
        href: '/'
      }
    ],
    currentOrder: {},
    currentOrderExpand: {},
    isLoading: false,
    isLoadingProductComplete: false,
    dialog: false,
    dialogOrder: false,
    dialogNewOrder: false,
    dialogNewOrderMessage: '',
    dummyProducts: [],
    search: '',
    error: '',
    headers: [
      { text: 'User Id', value: 'userID' },
      { text: 'Estado', value: 'estado' },
      { text: 'Cliente', value: 'cliente' },
      { text: 'Fecha orden', value: 'fechaOrden' },
      { text: 'Acciones', value: 'actions', class: 'center-header' }
    ],
    expandedTable: [],
    subHeaders: [
      { text: 'SKU', value: 'sku' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Cantidad', value: 'cantidad' },
      { text: 'Precio Unitario', value: 'precioUnitario' }
    ],
    stateList: [
      { text: 'Producto No encontrado', value: 'producto-no-encontrado' },
      { text: 'Pedido exitoso', value: 'pedido-exitoso' },
      { text: 'Stock Confirmado', value: 'stock-confirmado' },
      { text: 'Stock Insuficiente', value: 'stock-insuficiente' }
    ],
    resultItems: [],
    productComplete: {
      producto: {
        sku: '',
        nombre: '',
        cantidad: 0,
        precioUnitario: 0
      },
      metodoPago: '',
      id: '',
      cliente: '',
      fechaOrden: '',
      userID: '',
      email: '',
      direccionEnvio: '',
      estado: ''
    },
    expanded: true,
    newOrder: {
      userID: '',
      email: '',
      cliente: '',
      direccionEnvio: '',
      metodoPago: '',
      producto: {
        sku: '',
        nombre: '',
        cantidad: 1
      }
    },
    metodosPago: ['Nequi', 'Efectivo', 'Tarjeta', 'Transferencia']
  }),
  computed: {
    rol() {
      return this.$store.state.auth.user.profile
    },
    isOrderValid() {
      const o = this.newOrder
      return (
        o.userID.trim() !== '' &&
        o.email.trim() !== '' &&
        o.cliente.trim() !== '' &&
        o.direccionEnvio.trim() !== '' &&
        o.metodoPago.trim() !== '' &&
        o.producto.sku.trim() !== '' &&
        o.producto.nombre.trim() !== '' &&
        o.producto.cantidad > 0
      )
    }
  },
  mounted() {
    moment.locale('es') // Establece la localización en español
    this.getOrders()
    this.getProductsAPI()
  },
  methods: {
    async goToOrders() {
      this.$router.push('/orders')
    },
    async getProductsAPI() {
      try {
        const productos = await DummyApiServices.getAllProducts(this.$axios)
        console.log('Productos dummy:', productos)
        this.dummyProducts = productos
      } catch (e) {
        console.error('Error cargando productos dummy', e)
      }
    },
    onSkuSelected(sku) {
      const selected = this.dummyProducts.find((product) => product.sku === sku)
      if (selected) {
        this.newOrder.producto.nombre = selected.title
      } else {
        this.newOrder.producto.nombre = ''
      }
    },
    async getOrders() {
      try {
        this.isLoading = true
        this.resultItems = await OrdersServices.getAllOrders(this.$axios)
        console.log('this.resultItems')
        console.log(this.resultItems)
        this.isLoading = false
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    async postOrder() {
      try {
        console.log('this.newOrder')
        console.log(this.newOrder)
        this.dialogNewOrderMessage = await OrdersServices.postOrder(this.$axios, this.newOrder)
        this.dialogNewOrder = true
      } catch (err) {
        console.log(err)
        this.dialogNewOrder = true
      }
    },
    goToCreateOrder() {
      console.log('createOrder')
      this.dialog = true
    },
    async goToSeeAction(item) {
      console.log('item goToSeeAction')
      console.log(item)
      try {
        this.dialogOrder = true
        this.isLoadingProductComplete = true
        this.productComplete = await OrdersServices.getOrderById(this.$axios, item.userID, item.id)
        console.log('this.productComplete')
        console.log(this.productComplete)
        this.isLoadingProductComplete = false
      } catch (err) {
        console.log(err)
        this.isLoadingProductComplete = false
      }
    },
    toggleRow(item) {
      this.currentOrder = item
      const index = this.expandedTable.indexOf(item.id)
      if (index === -1) {
        this.expandedTable = []
        this.expandedTable.push(item.id)
        this.currentOrderExpand = item
      } else {
        this.expandedTable.splice(index, 1)
      }
    },
    formatMoney(amount) {
      if (!isNaN(amount)) {
        amount = parseFloat(amount)
        return typeof amount !== 'undefined'
          ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
          : null
      } else {
        return null
      }
    },
    formatDate(dateItem) {
      return moment(dateItem).format('DD [de] MMMM [de] YYYY HH:mm:ss')
    },
    getTextByValue(value) {
      const found = this.stateList.find((item) => item.value === value)
      return found ? found.text : 'Valor no encontrado'
    },
    closeDialogNewOrders() {
      this.dialogNewOrder = false
      this.dialog = false
      this.getOrders()
    }
  }
}
</script>
<style lang="scss">
.stock-insuficiente_status {
  i {
    color: #ef5350 !important; // Rojo
  }
  span {
    color: #ef5350;
    font-weight: 600;
  }
}

.producto-no-encontrado_status {
  i {
    color: #8a100e !important; // Rojo
  }
  span {
    color: #8a100e;
    font-weight: 600;
  }
}

.stock-confirmado_status {
  i {
    color: #a1f700 !important; // Amarillo
  }
  span {
    color: #a1f700;
    font-weight: 600;
  }
}

.pedido-exitoso_status {
  i {
    color: #66bb6a !important; // Verde
  }
  span {
    color: #66bb6a;
    font-weight: 600;
  }
}

.expand-row {
  background: $red-high-color !important;
  color: $white-color;
  &:hover {
    background: $red-high-color-hover !important;
  }
}

.modal-mod {
  border-radius: 20px !important;
  .text-modal-mod {
    display: inline-block;
    width: 100%;
    padding: 5px 20px;
    div {
      float: left;
      padding: 0px 5px;
    }
    .text-title-modal-mod {
      font-weight: 600;
    }
  }
}
.table_filters {
  margin: 0px 0px 20px 0px;
  padding: 10px 20px;
  .select_container {
    display: inline-block;
    .item_select_container {
      float: left;
      padding: 0px 10px;
    }
  }
}
.field_red {
  background: $red-color;
  width: 100%;
  height: 30px;
}
.disclaimer {
  font-size: 10px;
  padding: 2px 15px;
  color: $grey-color;
}
.errorField {
  font-size: 10px;
  width: 100%;
  color: $red-color;
}

.button_clear {
  position: initial;
  float: left;
  margin: 0px 25px 0px 0px;
  button {
    padding-right: 0px !important;
    padding-left: 0px !important;
    max-height: 15px !important;
    max-width: 245px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    span {
      max-width: 7px;
    }
  }
}

.cursor {
  cursor: pointer;
}
</style>
