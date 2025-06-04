const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// 静态文件服务 - 服务 dist 目录
app.use(express.static(path.join(__dirname, 'dist')));

// 静态文件服务 - 服务 assets 目录
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 静态文件服务 - 服务根目录下的其他文件
app.use(express.static(__dirname));

// 所有路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
}); 