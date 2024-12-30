'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useState, useTransition } from "react"
import { Button } from "./ui/button"
import { usePathname, useRouter } from "next/navigation"
import { deleteDocument } from "@/actions/actions"
import { toast } from "sonner"
import { DeleteIcon, TrashIcon } from "lucide-react"
  
const DeleteDocument = () => {
    const[isOpen,setIsopen] = useState(false)
    const [isPending,startTransition] = useTransition();
    const pathname = usePathname();
    const router  = useRouter();
    const handleDelete = async () =>{
        const roomId = pathname.split('/').pop();
        if(!roomId) return;
        startTransition((async()=>{
            const {success} = await deleteDocument(roomId);
            if(success){
                setIsopen(false);
                router.replace('/');
                toast.success( 'Room Deleted successfully!');
            }else{
                toast.error('Field to delete room!');
            }
        }))
    }
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
        <Button asChild variant={'destructive'}>
            <DialogTrigger><p className="hidden md:block">Delete</p><TrashIcon className="block md:hidden"/></DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action will delete the document and all its contents, removing all users from the document.. 
            </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-end gap-2">
                <Button 
                    type="button"
                    variant={'destructive'}
                    onClick={handleDelete}
                    disabled ={isPending}
                >
                    {isPending ?"Deleting .. ":"Delete"}
                </Button>
                <DialogClose asChild>
                    <Button type="button" variant={'secondary'}>Cancle</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>

  )
}

export default DeleteDocument
