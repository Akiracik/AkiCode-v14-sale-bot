const { QuickDB } = require('quick.db');
const db = new QuickDB();

async function getProducts() {
  return await db.get('products') || [];
}

async function addProduct(name, price, category) {
  const products = await getProducts();
  products.push({ name, price, category });
  await db.set('products', products);
}

async function getProduct(name) {
  const products = await getProducts();
  return products.find(p => p.name.toLowerCase() === name.toLowerCase());
}

async function getProductsByCategory(category) {
  const products = await getProducts();
  return products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
}

async function getCategories() {
  console.log('getCategories fonksiyonu çağrıldı');
  const products = await getProducts();
  console.log('Alınan ürünler:', products);
  const categories = products
    .map(p => p.category)
    .filter(category => category !== undefined && category !== null && category !== '');
  console.log('Filtrelenmiş kategoriler:', categories);
  return [...new Set(categories)];
}

async function createOrder(userId, product) {
  const orderId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  await db.set(`orders.${orderId}`, {
    userId,
    product,
    status: 'pending',
    createdAt: Date.now()
  });
  await addOrder(userId, product);
  return orderId;
}

async function completeOrder(orderId) {
  const order = await db.get(`orders.${orderId}`);
  if (!order) return null;

  order.status = 'completed';
  order.completedAt = Date.now();
  await db.set(`orders.${orderId}`, order);
  return order;
}

async function addOrder(userId, product) {
  await db.add(`totalSales`, 1);
  await db.add(`totalRevenue`, product.price);
  await db.add(`productSales.${product.name}`, 1);
}

async function getStats() {
  const totalSales = await db.get(`totalSales`) || 0;
  const totalRevenue = await db.get(`totalRevenue`) || 0;
  const productSales = await db.get(`productSales`) || {};
  
  let bestSeller = null;
  if (Object.keys(productSales).length > 0) {
    bestSeller = Object.keys(productSales).reduce((a, b) => productSales[a] > productSales[b] ? a : b);
  }

  return { totalSales, totalRevenue, bestSeller };
}

async function setConfig(key, value) {
  await db.set(`config.${key}`, value);
}

async function getConfig(key) {
  return await db.get(`config.${key}`);
}

async function updateProduct(name, newData) {
  const products = await getProducts();
  const index = products.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
  if (index !== -1) {
    products[index] = { ...products[index], ...newData };
    await db.set('products', products);
    return true;
  }
  return false;
}

async function deleteProduct(name) {
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.name.toLowerCase() !== name.toLowerCase());
  if (filteredProducts.length < products.length) {
    await db.set('products', filteredProducts);
    return true;
  }
  return false;
}

module.exports = { 
  getProducts, 
  addProduct, 
  getProduct, 
  getProductsByCategory,
  getCategories,
  createOrder,
  completeOrder,
  addOrder, 
  getStats, 
  setConfig, 
  getConfig,
  updateProduct,
  deleteProduct
};