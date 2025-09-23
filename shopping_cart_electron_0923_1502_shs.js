// 代码生成时间: 2025-09-23 15:02:23
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const cart = []; // 购物车数组，存储商品信息

// 创建购物车窗口
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 打开购物车页面
  win.loadFile('index.html');
  
  // 打开开发者工具
  win.webContents.openDevTools();
}

// 监听应用准备完成事件
app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})

// 添加商品到购物车
function addToCart(product) {
  // 检查商品是否已存在
  const existingProduct = cart.find(p => p.id === product.id);
  if (existingProduct) {
    // 商品存在，增加数量
    existingProduct.quantity += product.quantity;
  } else {
    // 商品不存在，添加到购物车
    cart.push(product);
  }
}

// 从购物车中移除商品
function removeFromCart(productId) {
  const index = cart.findIndex(p => p.id === productId);
  if (index !== -1) {
    cart.splice(index, 1);
  } else {
    console.error('Product not found in cart');
  }
}

// 获取购物车商品总数
function getCartTotal() {
  return cart.reduce((total, product) => total + product.quantity, 0);
}

// 获取购物车中的商品列表
function getCartProducts() {
  return cart;
}

// Example usage:
// addToCart({ id: 1, name: 'Product 1', quantity: 2 });
// removeFromCart(1);
// console.log(getCartTotal());
// console.log(getCartProducts());

// 在index.html中，你可以通过 preload.js 脚本访问这些函数，例如：
// const { addToCart } = require('./preload');
// addToCart(product);
