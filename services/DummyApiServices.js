export default {
  async getAllProducts($axios) {
    const url = process.env.API_DUMMY_API
    try {
      const response = await $axios.$get(url)
      const products = response.products || []
      products.push({
        sku: 'no existe',
        title: 'inexistente',
        id: -1,
        nombre: 'inexistente',
        cantidad: 1
      })
      return products
    } catch (error) {
      console.error('Error al obtener productos dummy:', error)
      throw error
    }
  }
}
