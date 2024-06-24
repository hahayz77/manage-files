import { NextApiRequest, NextApiResponse } from 'next'
import { bucket } from '@/utils/googleStorage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { fileName } = req.body

  try {
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' })
    }

    await bucket.file(fileName).delete()
    res.status(200).json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: 'Error deleting file' })
  }
}
