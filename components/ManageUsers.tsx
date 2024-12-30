'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FormEvent, useState, useTransition } from "react"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { inviteUserTodocument, removerUserFromDocument } from "@/actions/actions"
import { useUser } from "@clerk/nextjs"
import isOwner from "@/lib/useOwner"
import { useRoom } from "@liveblocks/react/suspense"
import { useCollection } from "react-firebase-hooks/firestore"
import { collectionGroup, query, where } from "firebase/firestore"
import { db } from "@/firebase"
  
const ManageUsers = () => {
    const[isOpen,setIsopen] = useState(false)
    const [isPending,startTransition] = useTransition();
    const {user} = useUser()
    const isowner = isOwner();
    const room = useRoom()

    const [usersInRoom] = useCollection(
        user && query(collectionGroup(db,'rooms'),where('roomId','==',room.id))
    )
    const handleDelete  = (userId:string) =>{
    startTransition(async()=>{
        if(!user) return;
        const {success} = await removerUserFromDocument(room.id,userId)

        if(success){
            toast.success('User Removed Successfully!');
        }else{
            toast.error('Failed to remove the user');
        }
    })
    }
      
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
        <Button asChild variant={'outline'}>
            <DialogTrigger>Users</DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Users With Access</DialogTitle>
            <DialogDescription>
                Bellow is a list of users who have access to this document.
            </DialogDescription>
            </DialogHeader>
            <hr className="my-2"/>
            <div className="flex flex-col space-y-2">
                {
                    usersInRoom?.docs.map((doc)=>(
                        <div 
                            key = {doc.data().userId}
                            className="flex items-center justify-between"
                        >
                            <p className="font-light">
                                {
                                    doc.data().userId === user?.emailAddresses[0].toString()? `You (${doc.data().userId})`:doc.data().userId
                                }
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant={'outline'}>{doc.data().role}</Button>
                                {
                                    isowner && doc.data().userId !== user?.emailAddresses[0].toString() && (
                                        <Button 
                                            variant={'destructive'}
                                            onClick={()=>handleDelete(doc.data().userId)}
                                            disabled={isPending}
                                            size={'sm'}
                                        >
                                            {isPending?'Removing..':'X'}
                                        </Button>


                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
            
        </DialogContent>
    </Dialog>

  )
}

export default ManageUsers
