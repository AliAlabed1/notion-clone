
import Document from "@/components/Document"

const DocumentPage = async({params}:{params:Promise<{id:string}>}) => {
    const id = (await params).id
    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    )
}

export default DocumentPage
