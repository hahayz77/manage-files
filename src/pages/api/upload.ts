import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File } from 'formidable'
import uploadFile from '@/utils/googleStorage'

export const config = {
  api: {
    bodyParser: false
  }
}

type ResponseData = {
  url?: string
  error?: string
}

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  const form = new IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing files' })
      return
    }

    try {
      let file: File | undefined
      if (Array.isArray(files.file)) {
        file = files.file[0]
      } else {
        file = files.file
      }

      if (!file) {
        res.status(400).json({ error: 'No file provided' })
        return
      }
      const url = await uploadFile(file)
      res.status(200).json({ url })
    } catch (error) {
      res.status(500).json({ error: 'Error uploading file' })
    }
  })
}

export default uploadHandler