export default function Home() {
  return (
    <>
      <div className="main_container min-h-screen w-screen flex gap-10 flex-col justify-center items-center bg-gradient-radial from-slate-900 to-neutral-950">
        <h1 className="text-2xl font-semibold">File Management</h1>
        <div className="file_container grid">
          <label id="file_input_label" htmlFor="file"> Adicionar arquivos ao relatório </label>
          <input id="file" className="file_input" accept="image/*,application/pdf" multiple name="file" type="file" />
        </div>
      </div>
    </>
  )
}
