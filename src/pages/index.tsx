import { useRouter } from "next/router";

export const Home: React.FC<{}> = () => {
  
  const router = useRouter();

  return (
    <div className="index_container grid place-content-center h-screen">
      <h1 className="index_container text-4xl text-center py-1 font-bold bg-gradient-to-tr from-blue-200/90 to to-blue-300/80 bg-clip-text text-transparent">
        Google Cloud Storage <br /> File Uploader
      </h1>
      <div className="options_container flex flex-col gap-5 py-10 justify-center items-center">
        <button className='main_btn bg-blue-500 shadow-blue-400/50 w-[300px] shadow-md rounded-md py-2 hover'
          onClick={() => router.push("/upload")}>
          Upload
        </button>
        <button className='main_btn bg-blue-500 shadow-blue-400/50 w-[300px] shadow-md rounded-md py-2 hover'
          onClick={() => router.push("/show")}>
          View Files
        </button>
      </div>
    </div>
  )
}

export default Home;