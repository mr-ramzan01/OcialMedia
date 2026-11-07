const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

/** True when Cloudinary credentials are present in the environment. */
function isConfigured() {
  return Boolean(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);
}

/**
 * Uploads an in-memory file (multer memory storage) to Cloudinary.
 * Resolves with the Cloudinary upload result.
 */
function uploadBuffer(buffer, options = {}) {
  if (!isConfigured()) {
    const error = new Error('Image uploads are not configured. Set CLOUD_NAME, CLOUD_API_KEY and CLOUD_API_SECRET in .env');
    error.statusCode = 503;
    return Promise.reject(error);
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) return reject(error || new Error('Upload failed'));
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function destroy(publicId) {
  if (!publicId || !isConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // A missing remote asset should never block the request.
    console.error('cloudinary destroy failed:', error.message);
  }
}

module.exports = { uploadBuffer, destroy, isConfigured };
