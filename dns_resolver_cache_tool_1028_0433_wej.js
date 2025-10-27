// 代码生成时间: 2025-10-28 04:33:59
const { app, BrowserWindow } = require('electron');
const dns = require('dns');
const LRU = require('lru-cache');
const os = require('os');
const path = require('path');
const fs = require('fs');

// 缓存大小设置为100条记录
const cacheSize = 100;
const dnsCache = new LRU({
  max: cacheSize,
  updateAgeOnGet: true,
  dispose(key, nsecRecord) {
    // 这里可以添加清理过期缓存条目的代码，比如删除文件等
  },
  noDisposeOnSet: true
});

class DNSResolverCacheTool {
  // 构造函数，初始化Electron窗口
  constructor() {
    this.app = app;
    this.dnsCache = dnsCache;
    this.initApp();
  }

  // 初始化Electron应用
  initApp() {
    this.app.on('ready', () => {
      this.createWindow();
    });
  }

  // 创建窗口
  createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    win.loadFile('index.html');
  }

  // DNS解析函数，带缓存
  resolveDNS(domain) {
    return new Promise((resolve, reject) => {
      // 检查缓存
      if (dnsCache.has(domain)) {
        resolve(dnsCache.get(domain));
      } else {
        dns.lookup(domain, (error, address, family) => {
          if (error) {
            reject(error);
          } else {
            dnsCache.set(domain, address);
            resolve(address);
          }
        });
      }
    });
  }
}

// 启动DNS解析和缓存工具
const dnsTool = new DNSResolverCacheTool();