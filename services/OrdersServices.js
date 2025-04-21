export default {
  async getAllOrders($axios) {
    console.log('llamando getAllOrders al API Gateway AWS')
    try {
      // Cambiar la URL para apuntar a tu API Gateway en AWS
      const urlApiGateWay = process.env.API_GATEWAY_URL.replace(
        '{{$API_ID}}',
        process.env.API_GATEWAY_ID
      ).replace('{{$ENVIROMENT}}', process.env.API_GATEWAY_ENVIROMENT)
      console.log('urlApiGateWay')
      console.log(urlApiGateWay)
      const response = await $axios.$get(urlApiGateWay)
      return response // Esto debería retornar la respuesta del API Gateway
    } catch (error) {
      console.error('Error al obtener pedidos desde API Gateway:', error)
      throw error // Lanza el error para que sea manejado por el componente que llama a esta función
    }
  },
  async getOrderById($axios, userID, id) {
    console.log(`Obteniendo orden con ID ${id} del usuario ${userID}`)

    try {
      const baseUrl = process.env.API_GATEWAY_URL.replace(
        '{{$API_ID}}',
        process.env.API_GATEWAY_ID
      ).replace('{{$ENVIROMENT}}', process.env.API_GATEWAY_ENVIROMENT)

      const endpoint = `${baseUrl}/${userID}/${id}`

      console.log('URL para getOrderById:')
      console.log(endpoint)

      const response = await $axios.$get(endpoint)
      return response
    } catch (error) {
      console.error(`Error al obtener la orden ${id} del usuario ${userID}:`, error)
      throw error
    }
  },
  async postOrder($axios, data) {
    console.log('Enviando orden al API Gateway AWS')
    try {
      const urlApiGateWay = process.env.API_GATEWAY_URL.replace(
        '{{$API_ID}}',
        process.env.API_GATEWAY_ID
      ).replace('{{$ENVIROMENT}}', process.env.API_GATEWAY_ENVIROMENT)

      console.log('URL para postOrder:')
      console.log(urlApiGateWay)
      console.log('Data enviada:')
      console.log(data)

      const response = await $axios.$post(urlApiGateWay, data)
      return response
    } catch (error) {
      console.error('Error al enviar orden a API Gateway:', error)
      throw error
    }
  }
}
