// 代码生成时间: 2025-09-28 16:30:49
// 引入 Electron 主进程模块
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 权限数据存储结构
const permissions = {
  admin: ['addUser', 'removeUser', 'updateUser'],
  user: ['viewUsers']
};

// 用户数据存储结构
let users = [];

// 创建 BrowserWindow 的配置
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // 并加载应用的 index.html
  win.loadFile('index.html');
};

// 预加载脚本中使用的函数
function checkPermission(userId, permission) {
  // 根据 userId 查找用户
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  // 检查用户是否有给定的权限
  return permissions[user.role].includes(permission);
}

// 添加用户
function addUser(user) {
  if (!user.id || !user.name || !user.role) {
    throw new Error('Invalid user data');
  }
  users.push(user);
}

// 删除用户
function removeUser(userId) {
  users = users.filter(u => u.id !== userId);
}

// 更新用户权限
function updateUser(userId, newData) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  Object.assign(user, newData);
}

// 启动 Electron 应用
app.whenReady().then(createWindow);

// 应用的所有窗口都被关闭后退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 重启应用
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 导出用户权限管理相关的函数，以便在预加载脚本中使用
module.exports = {
  addUser,
  removeUser,
  updateUser,
  checkPermission
};