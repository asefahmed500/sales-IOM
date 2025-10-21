import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export async function uploadImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'sales-commission',
        transformation: {
          width: 500,
          height: 500,
          crop: 'fill',
          quality: 'auto',
          format: 'auto'
        }
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result?.secure_url || '')
        }
      }
    ).end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
