type Props = {
  id: string
}

const EditPage = ({ id }: Props) => {
  return (
    <div className="flex justify-center">
      <main className="bg-slate-600 w-full max-w-[600px]">
        <p>WIP</p>
        <p>ID: {id}</p>
      </main>
    </div>
  )
}

export default EditPage
