const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(process.env.UPLOADS_DIR || path.join(__dirname, '..', '..', 'uploads'));

const ensureSeedImage = () => {
  const imagesDir = path.join(uploadsDir, 'seed');
  fs.mkdirSync(imagesDir, { recursive: true });
  const imagePath = path.join(imagesDir, 'service.png');
  if (!fs.existsSync(imagePath)) {
    const image = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAALElEQVQoU2NkIBIwEqmOYcAEYBxVSFGRw0EwCoYE0bFIEgggGhiEAFn6AqEj5pOoAAAAASUVORK5CYII=',
      'base64'
    );
    fs.writeFileSync(imagePath, image);
  }
  return '/uploads/seed/service.png';
};

module.exports = { uploadsDir, ensureSeedImage };
