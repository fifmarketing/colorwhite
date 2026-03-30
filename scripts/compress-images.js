import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const images = [
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-img-1536x1014-CkOmSejVnizVUQ1UyCScBkKLcFSiYv.png',
    name: 'hero-img.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lotion-pack-600x440-1-7y4ToK7ZQf7MnrK0aAbrMJjiIUX23t.png',
    name: 'lotion-pack.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-3-OE2PXdZZwm0u79Gul3JyRSsIHU6RCc.jpg',
    name: 'face-wash-1.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Beauty-Serum-600x517-1-7eqfsGeikBXhfdrJWF63EnACij2l1i.png',
    name: 'serum.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-5-3DDheNXBKmVlMCa5y7F2K0Sa7Yy4ZC.jpg',
    name: 'face-wash-cream.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/squire-1-V9VZEVnWJ78xDywYqCxuwqTNmJMc6d.png',
    name: 'bridal-pack.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-1080-x-1080-px-3qp7ZbQ9ssQtajTGwfwH3WtFrcwIyK.png',
    name: 'face-wash-product.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soap-pack-ih6632iMWHLvK9wqqK1jWLT597UjQr.png',
    name: 'soap-pack.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-4-rLu4h7mtPlwoe51MLWz52lT8R6Tu5Z.jpg',
    name: 'face-wash-single.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/colorwhite-logo%20%281%29-4SNzcAGal7UofJoBsdMqWxtS7qqrW3.png',
    name: 'logo.png',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-10-8RAwcqvdzXgBxOpblGuE7wotpnG1CM.jpg',
    name: 'product-serum.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-6-3bCTQ6yb1ErxhY9pR9X9T3YID7gf9l.jpg',
    name: 'product-package.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-7-jHAYHizIYYR5J2FbwU6doEg6N9p7ui.jpg',
    name: 'beauty-soap.jpg',
  },
  {
    url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blue-Skincare-Routine-Facebook-Post-8-sD32E9HlSmBmRucq6C8WGpyd4xGUnR.jpg',
    name: 'beauty-cream.jpg',
  },
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(__dirname, '../public/images', filename);
    const dir = path.dirname(filepath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function compressImage(filepath) {
  const filename = path.basename(filepath);
  const tempPath = filepath + '.temp';

  try {
    await sharp(filepath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 75, progressive: true })
      .toFile(tempPath);

    const originalSize = fs.statSync(filepath).size;
    const compressedSize = fs.statSync(tempPath).size;

    fs.unlinkSync(filepath);
    fs.renameSync(tempPath, filepath);

    console.log(`✓ ${filename}: ${(originalSize / 1024).toFixed(2)}KB → ${(compressedSize / 1024).toFixed(2)}KB`);
  } catch (error) {
    console.error(`✗ Failed to compress ${filename}:`, error.message);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  }
}

async function main() {
  console.log('Starting image download and compression...\n');

  for (const image of images) {
    try {
      console.log(`Downloading ${image.name}...`);
      const filepath = await downloadImage(image.url, image.name);
      console.log(`Compressing ${image.name}...`);
      await compressImage(filepath);
    } catch (error) {
      console.error(`Error processing ${image.name}:`, error.message);
    }
  }

  console.log('\n✓ All images processed!');
}

main().catch(console.error);
