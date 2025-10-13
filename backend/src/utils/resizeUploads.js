import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import os from 'os';
import { renameSync } from 'fs';

// Resolve the absolute path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the 'uploads' directory
const uploadsDir = path.resolve(__dirname, '../../uploads');

// Check if the 'uploads' directory exists
if (!fs.existsSync(uploadsDir)) {
  console.error(`❌ The 'uploads' directory does not exist at: ${uploadsDir}`);
  process.exit(1);
}

// Resize settings
const targetWidth = 1200;
const targetHeight = 800;
const quality = 80;

async function resizeImage(filePath) {
  const tempFilePath = path.join(os.tmpdir(), `${Date.now()}-${path.basename(filePath)}`);
  try {
    // Resize and write to a temporary file
    await sharp(filePath)
      .resize(targetWidth, targetHeight, { fit: 'cover' })
      .jpeg({ quality })
      .toFile(tempFilePath);

    // Replace the original file with the resized image
    renameSync(tempFilePath, filePath);
    console.log(`✅ Resized and overwritten: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`❌ Failed to resize ${filePath}:`, err.message);
  }
}

async function processUploads() {
  console.log('Reading images from:', uploadsDir);

  const files = fs.readdirSync(uploadsDir);

  for (const file of files) {
    const inputPath = path.join(uploadsDir, file);
    const stat = fs.statSync(inputPath);

    // Skip directories and non-image files
    if (stat.isDirectory() || !/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      console.log(`⏭️ Skipping: ${file}`);
      continue;
    }

    await resizeImage(inputPath);
  }

  console.log('\n🎉 All done! Original images resized and overwritten.');
}

processUploads();


