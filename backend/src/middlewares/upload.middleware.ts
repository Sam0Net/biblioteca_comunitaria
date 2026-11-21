import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.jpg';
    const cleanBase = path.basename(file.originalname, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 40); // Limitar longitud de nombre base
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanBase || 'portada'}-${uniqueSuffix}${safeExt}`);
  }
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Validación doble: extensión física en whitelist Y mimetype verificado
  if (ALLOWED_MIMES.has(file.mimetype) && ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido. Solo se aceptan imágenes JPG, JPEG, PNG o WEBP'));
  }
};

export const uploadCover = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB máx
  }
});
