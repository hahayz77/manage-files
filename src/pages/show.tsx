import { GetStaticProps } from 'next'
import { bucket } from "@/utils/googleStorage"
import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = async () => {
    const [bucketFiles] = await bucket.getFiles({ prefix: process.env.BUCKET_FOLDER_NAME })

    const fileUrls = bucketFiles.slice(1).map(file => ({
        name: file.name,
        url: `https://storage.googleapis.com/${process.env.BUCKET_NAME}/${file.name}`
    }))

    return {
        props: {
            fileUrls,
            folderName: process.env.BUCKET_FOLDER_NAME
        },
        revalidate: 30
    }
}

type FileData = {
    name: string,
    url: string
}

type Props = {
    fileUrls: FileData[],
    folderName: string,
}

const ImageList: React.FC<Props> = ({ fileUrls, folderName }) => {
    const [files, setFiles] = useState<FileData[]>(fileUrls)

    const handleDelete = async (event: React.MouseEvent<HTMLSpanElement>, fileName: string) => {
        event.preventDefault()

        try {
            const response = await fetch('/api/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName }),
            })
            if (response.ok) {
                setFiles(files.filter(file => file.name !== fileName))
                toast.success('File deleted successfully')
            } else {
                console.error('Failed to delete file')
                toast.error('Failed to delete file')
            }
        } catch (error) {
            console.error('Error deleting file:', error)
            toast.error('Error deleting file')
        }
    }

    return (
        <div className="main_container min-h-screen w-screen flex gap-10 flex-col justify-center items-center">
            <h2 className='text-4xl text-center py-1 font-bold bg-gradient-to-tr from-blue-200/90 to to-blue-300/80 bg-clip-text text-transparent'>
                Images from <br /> {folderName} Cloud Folder
            </h2>
            <div className="files_container flex justify-center gap-6 w-full">
                {files?.map(({ name, url }, index) => (
                    <div className='file_wrapper relative' key={index}>
                        <Link href={url} target="_blank" passHref>
                            <figure className='h-40 w-60'>
                                <img className='w-full h-full object-cover' src={url} alt={`Image ${index}`} />
                            </figure>
                        </Link>
                        <div className="hover controls_wrapper flex justify-evenly text-sm absolute top-0 right-0 p-2">
                            <span className="bg-white/90 p-[5px] rounded-full cursor-pointer" title='Deletar Imagem'
                                onClick={e => handleDelete(e, name)}>
                                🗑️
                            </span>
                        </div>
                    </div>
                ))}
                {files.length === 0 && (
                    <p className='flex gap-2 opacity-70'>⛔ Nenhuma imagem por aqui...</p>
                )}
            </div>
            <Link href={"/"} className='flex justify-start opacity-50'>⬅️ Voltar</Link>
        </div>
    )
}

export default ImageList
