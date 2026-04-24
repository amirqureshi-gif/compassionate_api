const cloudinary = require('cloudinary').v2;

function isConfigured() {
  return Boolean((process.env.CLOUDINARY_URL || '').trim());
}

if (isConfigured()) {
  cloudinary.config({ secure: true });
}

/**
 * Upload a single file buffer; returns https URL. Preserves quality (no heavy compression).
 * @param {Buffer} buffer
 * @param {string} originalName
 * @param {string} folder e.g. 'cai/membership'
 */
function uploadBuffer(buffer, originalName, folder) {
  if (!isConfigured()) {
    return Promise.reject(new Error('CLOUDINARY_URL is not set'));
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'cai/forms',
        use_filename: true,
        unique_filename: true,
        resource_type: 'image',
        quality: 'auto:best',
        fetch_format: 'auto',
        flags: 'progressive'
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        if (!result || !result.secure_url) {
          reject(new Error('Cloudinary did not return a URL'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.on('error', reject);
    stream.end(buffer);
  });
}

module.exports = { uploadBuffer, isConfigured };
