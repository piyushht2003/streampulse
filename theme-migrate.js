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
  { regex: /text-white/g, replacement: 'text-foreground' },
  { regex: /bg-\[\#050505\]/g, replacement: 'bg-background' },
  { regex: /border-white\/10/g, replacement: 'border-foreground/10' },
  { regex: /border-white\/20/g, replacement: 'border-foreground/20' },
  { regex: /border-white\/5/g, replacement: 'border-foreground/5' },
  { regex: /border-white\/30/g, replacement: 'border-foreground/30' },
  { regex: /bg-white\/5/g, replacement: 'bg-foreground/5' },
  { regex: /bg-white\/10/g, replacement: 'bg-foreground/10' },
  { regex: /bg-white\/20/g, replacement: 'bg-foreground/20' },
  { regex: /bg-black\/50/g, replacement: 'bg-background/80' },
  { regex: /bg-black\/60/g, replacement: 'bg-background/80' },
  { regex: /bg-black\/20/g, replacement: 'bg-foreground/5' },
  { regex: /bg-black\/40/g, replacement: 'bg-background/60' },
  { regex: /text-black\/50/g, replacement: 'text-background/50' },
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
