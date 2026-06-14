const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const mappings = [
  { regex: /bg-\[\#020202\]/g, replacement: 'bg-background' },
  { regex: /bg-\[\#0a0a0a\]/g, replacement: 'bg-card' },
  { regex: /bg-\[\#111\]/g, replacement: 'bg-secondary' },
  { regex: /hover:bg-\[\#111\]/g, replacement: 'hover:bg-secondary' },
  { regex: /from-\[\#111\]/g, replacement: 'from-secondary' },
  { regex: /to-black/g, replacement: 'to-background' },
  { regex: /\bbg-black\b/g, replacement: 'bg-background' },
];

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    mappings.forEach(m => {
      content = content.replace(m.regex, m.replacement);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
