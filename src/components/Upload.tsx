import { useState, ChangeEvent } from 'react'
import { toast } from 'react-hot-toast'

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(url) {
      e.target.files = null
      setUrl("")
    }
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error(res.statusText)

      const data = await res.json()
      setUrl(data.url)
      toast.success('File uploaded successfully')
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Error uploading file')
    }
  }

  return (
    <div className='grid gap-6 w-[300px]'>
      <label htmlFor="file-input"
        className="upload_label from-blue-950 to to-blue-900/50 bg-gradient-to-tr py-2 rounded-md w-full hover text-center">
        Upload file
      </label>
      <input id="file-input" type="file" accept="image/*, application/pdf" className="sr-only" onChange={handleChange} />
      {(file && !url) &&
        <>
          <p className='text-center'>{file.name}</p>
          <button className="from-teal-800 to-teal-900/50 bg-gradient-to-tr py-2 rounded-md hover" onClick={handleUpload}>Confirm Upload</button>
        </>
      }
      {url &&
        <>
          <button className='main_btn bg-emerald-500 shadow-emerald-400/50 shadow-md rounded-md py-2 hover'
            onClick={() => window.open(url, '_blank')}>
            View File
          </button>
          <p className='text-center'>{file?.name}</p>
        </>
      }
    </div>
  )
}

export default Upload
