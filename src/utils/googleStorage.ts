import { Storage } from '@google-cloud/storage'
import { File } from 'formidable'
import mime from 'mime-types'
import fs from 'fs'

const storage = new Storage({
  keyFilename: 'src/utils/apikey.json',
  projectId: 'masterclindrive'
})

const bucket = storage.bucket('master_clin_bucket')

const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blobName = `test-page/${file.originalFilename}-${file.newFilename}`
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
