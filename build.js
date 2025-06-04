const fs = require('fs');
const path = require('path');

// 读取配置文件
const content = JSON.parse(fs.readFileSync('./config/content.json', 'utf8'));

// 读取模板文件
const template = fs.readFileSync('./index.html', 'utf8');

// 替换内容
let html = template;

// 替换网站基本信息
html = html.replace(/<title>.*?<\/title>/, `<title>${content.site.title}</title>`);
html = html.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${content.site.description}">`);
html = html.replace(/<meta name="keywords" content=".*?">/, `<meta name="keywords" content="${content.site.keywords}">`);

// 替换头部信息
html = html.replace(/<span class="site-title">.*?<\/span>/, `<span class="site-title">${content.header.name}</span>`);
html = html.replace(/<span class="site-description">.*?<\/span>/, `<span class="site-description">${content.header.title}</span>`);

// 替换导航链接
const headerLinks = content.header.links.map(link => 
  `<a class="link" href="${link.href}" data-scroll>${link.text}</a>`
).join('\n');
html = html.replace(/<div class="header-links">[\s\S]*?<\/div>/, 
  `<div class="header-links">\n${headerLinks}\n</div>`);

// 替换社交媒体链接
const socialLinks = content.header.social.map(social => 
  `<a aria-label="${social.label}" target="_blank" href="${social.url}">\n<i class="icon fa ${social.icon}" aria-hidden="true"></i>\n</a>`
).join('\n');
html = html.replace(/<div class="header-icons">[\s\S]*?<\/div>/, 
  `<div class="header-icons">\n${socialLinks}\n</div>`);

// 生成技能 HTML
const skillsHtml = Object.entries(content.skills).map(([key, skill]) => `
        <!-- Technology Stack #${key === 'languages' ? '1' : key === 'frontend' ? '2' : key === 'backend' ? '3' : '4'}: ${skill.title} -->
        <div class="tech">
          <h2>${skill.title}</h2>
          ${skill.icons.map(icon => `<i class="${icon} colored"></i>`).join('\n          ')}
          <p>${skill.description}</p>
        </div>
`).join('\n');

// 精确替换 about section，只保留 user-details 和新 user 块
html = html.replace(
  /(<section id="about">[\s\S]*?<div class="user-details">[\s\S]*?<\/div>)([\s\S]*?)(<\/section>)/,
  (_, head, _old, tail) => `${head}\n<div class="user">\n${skillsHtml}\n      </div>\n${tail}`
);

// 替换项目部分
const projectsHtml = content.projects.items.map(project => `
  <div class="user-projects">
    <div class="images-right">
      <picture>
        <source type="image/webp" srcset="${project.image.webp}" alt="${project.title}" />
        <img alt="${project.title}" src="${project.image.jpg}" />
      </picture>
    </div>
    <div class="contents" style="text-align: center">
      <h3>${project.title}</h3>
      <div>
        ${project.technologies.map(tech => 
          `<img height="32" width="32" src="${tech.icon}" ${tech.style ? `style="${tech.style}"` : ''} />`
        ).join('\n')}
      </div>
      <p style="text-align: justify">${project.description}</p>
      <a class="project-link" target="_blank" href="${project.link}">Check it out!</a>
    </div>
  </div>
`).join('\n');
html = html.replace(/<section id="projects">[\s\S]*?<\/section>/, 
  `<section id="projects">\n<div class="user-details">\n<h1>${content.projects.title}</h1>\n</div>\n${projectsHtml}\n</section>`);

// 确保 dist 目录存在
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

// 复制 assets 目录到 dist
if (!fs.existsSync('./dist/assets')) {
  fs.mkdirSync('./dist/assets', { recursive: true });
}

// 复制所有资源文件
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// 复制 assets 目录
copyDir('./assets', './dist/assets');

// 写入生成的文件
fs.writeFileSync('./dist/index.html', html);

console.log('Build completed successfully!'); 