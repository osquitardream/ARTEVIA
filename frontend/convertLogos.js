const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convert() {
  const publicDir = path.join(__dirname, 'public');
  const rootDir = path.join(__dirname, '..');

  const files = [
    { svg: 'logo.svg', png: 'logo.png', rootPng: 'logo.png' },
    { svg: 'logo-blanco.svg', png: 'logo-blanco.png', rootPng: 'logo-blanco.png' },
    { svg: 'logo-gold.svg', png: 'logo-gold.png', rootPng: 'logo-dorado.png' },
  ];

  for (const item of files) {
    const svgPath = path.join(publicDir, item.svg);
    const pngPath = path.join(publicDir, item.png);
    const rootPngPath = path.join(rootDir, item.rootPng);

    if (fs.existsSync(svgPath)) {
      const svgBuffer = fs.readFileSync(svgPath);
      await sharp(svgBuffer)
        .resize(1000, 1000)
        .png()
        .toFile(pngPath);
      
      await sharp(svgBuffer)
        .resize(1000, 1000)
        .png()
        .toFile(rootPngPath);

      console.log(`Generated: ${item.png} and ${item.rootPng}`);
    }
  }
}

convert().catch(console.error);
