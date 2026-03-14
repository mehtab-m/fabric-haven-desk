# Cloudinary Integration Guide

## Overview
The project has been configured to use Cloudinary for image storage and retrieval instead of local file system storage. This ensures images are stored securely in the cloud and are accessible from anywhere.

## Backend Changes

### 1. Environment Variables
Add these to your `.env` file in the `/server` directory:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Packages Installed
```bash
npm install cloudinary multer-storage-cloudinary multer
```

### 3. Updated Files

#### `/server/routes/uploadRoutes.js`
- Replaced local disk storage with Cloudinary storage
- Images are now uploaded to Cloudinary's cloud
- Returns `secure_url` (HTTPS URL) for uploaded images
- Images are stored in the `fabric-haven` folder in Cloudinary

#### `/server/server.js`
- Removed local `/uploads` static file serving
- No longer needs to serve local upload directory

### 4. Image Upload Flow
```
Frontend (Admin) → POST /api/uploads → Backend (Multer + Cloudinary) → Cloudinary Cloud → Returns HTTPS URL
```

## Frontend Changes

### 1. Image URL Handling
The frontend already has built-in support for both local and Cloudinary URLs:

- **Local URLs** (format: `/uploads/filename`): Automatically prefixed with API origin
- **Cloudinary URLs** (format: `https://res.cloudinary.com/...`): Used directly as-is
- **Other URLs**: Used as-is

### 2. Utility Function
A new utility function `normalizeImageUrl()` has been added in `/src/lib/imageUtils.ts` to handle image URL normalization:

```typescript
import { normalizeImageUrl } from '@/lib/imageUtils';

const imageUrl = normalizeImageUrl(product.image);
```

### 3. Automatic Handling
No changes needed in existing components. The URL handling is automatic:
- If backend returns Cloudinary URL → Used directly
- If backend returns `/uploads/...` → Automatically converted to full URL

## Production Deployment

### 1. Environment Setup
Ensure Cloudinary credentials are set in your production environment:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 2. Benefits
- ✅ No local file system storage needed
- ✅ Images accessible from anywhere
- ✅ Automatic CDN distribution
- ✅ Built-in image optimization
- ✅ Scalable storage
- ✅ Backup and reliability

### 3. Image Management
Access your Cloudinary dashboard to:
- View all uploaded images
- Manage image folders
- Set up auto-optimization
- Configure transformations

## Migration from Local Storage

If you have existing images stored locally:

1. Create a migration script to:
   - Read local images from `/server/uploads/`
   - Upload to Cloudinary
   - Update product records with new Cloudinary URLs

2. Use Cloudinary's upload API to batch upload images:
```javascript
const cloudinary = require('cloudinary').v2;

const result = await cloudinary.uploader.upload(localFilePath, {
  folder: 'fabric-haven'
});

console.log(result.secure_url);
```

## API Endpoints

### Upload Image
```
POST /api/uploads
Headers: Authorization: Bearer {token}
Body: FormData with 'image' field
Response: { url: "https://res.cloudinary.com/..." }
```

## Troubleshooting

### Images not loading
- Verify Cloudinary credentials in `.env`
- Check image URL format (should start with `https://`)
- Ensure API is running with updated code

### Upload fails
- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- Check file size limits (Cloudinary free tier: 100MB per file)
- Ensure file format is supported (jpg, jpeg, png, gif, webp)

### Performance
- Cloudinary automatically optimizes images
- Use Cloudinary's built-in transformations for different image sizes
- Images are cached by CDN for faster delivery

## Resources
- Cloudinary Documentation: https://cloudinary.com/documentation
- Multer Storage Cloudinary: https://github.com/afzalsiddiqui/multer-storage-cloudinary
