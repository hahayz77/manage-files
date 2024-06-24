import { Storage } from '@google-cloud/storage'
import { File } from 'formidable'
import mime from 'mime-types'
import fs from 'fs'

const credentials = JSON.parse(
  Buffer.from(process.env.JSON_KEYS ? process.env.JSON_KEYS : "", "base64").toString()
);

console.log(credentials)

export const storage: Storage = new Storage({
  projectId: credentials.projectId || "",
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key
  }
})

export const bucket = storage.bucket(process.env.BUCKET_NAME || "")

const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blobName = `${process.env.BUCKET_FOLDER_NAME}/${file.originalFilename}-${file.newFilename}`
    const blob = bucket.file(blobName)

    const contentType = mime.lookup(file.originalFilename ?? "") || 'application/octet-stream'
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType
    })

    fs.createReadStream(file.filepath)
      .on('error', err => {
        console.log('Error reading file:', err)
        reject(err)
      })
      .pipe(blobStream)
      .on('error', err => {
        console.log('Error uploading file:', err)
        reject(err)
      })
      .on('finish', () => {
        resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`)
      })
  })
}

export default uploadFile
