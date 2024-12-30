'use client'
import { Button } from "./ui/button"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { createNewDocument } from "@/actions/actions"
const NewDocumentButton = () => {
    const router = useRouter();
    const [isPending,startTransition] = useTransition();
    const handleCreatenewDocument= ()=>{
        startTransition(async ()=>{
            const {docId} = await createNewDocument();
            router.push(`/doc/${docId}`)
        })
    }
    return (
        <Button disabled={isPending} onClick={handleCreatenewDocument}>
            {isPending ? "creating..." : "New Document"}
        </Button>
    )
}

export default NewDocumentButton
