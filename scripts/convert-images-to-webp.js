import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageDir = path.join(__dirname, '../public/images');
const supportedFormats = ['.png', '.jpg', '.jpeg'];

async function convertImageToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    
    console.log(`✅ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ Failed to convert ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      
      if (supportedFormats.includes(ext)) {
        const webpPath = fullPath.replace(new RegExp(`${ext}$`), '.webp');
        
        // Skip if WebP version already exists
        if (!fs.existsSync(webpPath)) {
          await convertImageToWebP(fullPath, webpPath);
        } else {
          console.log(`⏭️  Skipped: ${path.basename(webpPath)} already exists`);
        }
      }
    }
  }
}

async function main() {
  console.log('🔄 Starting image conversion to WebP...');
  console.log(`📁 Processing directory: ${imageDir}`);
  
  if (!fs.existsSync(imageDir)) {
    console.error(`❌ Images directory not found: ${imageDir}`);
    process.exit(1);
  }
  
  await processDirectory(imageDir);
  console.log('✨ Image conversion completed!');
}

main().catch(console.error);