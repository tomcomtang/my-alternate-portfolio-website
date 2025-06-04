const nodemon = require('nodemon');
const { exec } = require('child_process');
const path = require('path');

// 监听配置文件变化
nodemon({
  watch: ['config/content.json'],
  ext: 'json',
  ignore: ['dist/*', 'node_modules/*'],
  exec: 'npm start'
});

// 监听事件
nodemon.on('start', function () {
  console.log('Watching for changes in config/content.json...');
}).on('quit', function () {
  console.log('Watcher stopped');
  process.exit();
}).on('restart', function (files) {
  console.log('App restarted due to changes in:', files);
}); 