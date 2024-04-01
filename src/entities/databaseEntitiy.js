class LocalDatabase {
    constructor() {
      this.products = [];
    }
  
    addProduct(product) {
      this.products.push(product);
    }
  
    getAllProducts() {
      return this.products;
    }
  }
  
  export default new LocalDatabase()