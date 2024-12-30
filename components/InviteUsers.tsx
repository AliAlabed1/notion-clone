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
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { inviteUserTodocument } from "@/actions/actions"
import { UserPlusIcon } from "lucide-react"
  
const InviteUsers = () => {
    const[isOpen,setIsopen] = useState(false)
    const [isPending,startTransition] = useTransition();
    const pathname = usePathname();
    const router  = useRouter();
    const [email,setEmail]=useState<string>('')
    const handleSubmit = async (e:FormEvent) =>{
        e.preventDefault()
        const roomId = pathname.split('/').pop();
        if(!roomId) return;
        startTransition((async()=>{
            const {success} = await inviteUserTodocument(roomId,email);
            if(success){
                setIsopen(false);
                setEmail('')
                toast.success( 'User Added Successfuly!');
            }else{
                toast.error('Field to add User!');
            }
        }))
    }
      
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
        <Button asChild variant={'outline'}>
            <DialogTrigger><p className="hidden md:block">Invite</p><UserPlusIcon className="block md:hidden"/></DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Invite a User to collaborate!</DialogTitle>
            <DialogDescription>
                Enter The email of the user you want to invite. 
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}  className="flex flex-col gap-2">
                <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <Button 
                    type="submit"
                    disabled ={isPending || !email.length}
                >
                    {isPending?"Inviting..." : "Invite"}
                </Button>
            </form>
        </DialogContent>
    </Dialog>

  )
}

export default InviteUsers
