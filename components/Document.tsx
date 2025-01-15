'use client'

import { FormEvent, useEffect, useState, useTransition } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import Editor from "./Editor"
import isOwner from "@/lib/useOwner"
import DeleteDocument from "./DeleteDocument"
import InviteUsers from "./InviteUsers"
import ManageUsers from "./ManageUsers"
import Avatars from "./Avatars"
import { CircleFadingArrowUp } from "lucide-react"


const Document = ({id}:{id:string}) => {

    const [data,loading,error] = useDocumentData(doc(db,'documents',id))
    const [input,setInput] = useState('')
    const [isUpdating,startTransition] = useTransition()

    useEffect(()=>{
        if(data){
            setInput(data.title)
        }
    },[data])
    const updateTitle = (e:FormEvent)=>{
        e.preventDefault();
        if(input.trim()){
            startTransition(
                async()=>{
                    await updateDoc(doc(db,'documents',id),{title:input})
                }
            )
        }
    }
    const isowner = isOwner()
    return (
        <div className="flex-1 h-full bg-white p-5">
            <div className="flex max-w-6xl mx-auto justify-between">
                <form onSubmit={updateTitle} className="flex items-center justify-between space-x-2 flex-1">
                    <Input 
                        value = {input}
                        onChange={(e)=>setInput(e.target.value)}
                        placeholder="Update title"
                    />
                    <Button disabled = {isUpdating} type="submit">
                        {isUpdating?<><p className="hidden md:block">Updating..</p><p className="block md:hidden">...</p></>:<><p className="hidden md:block">Update</p><CircleFadingArrowUp className="block md:hidden"/></>}
                    </Button>
                    {
                        isowner && (
                            <>
                                <InviteUsers />
                                <DeleteDocument />
                                
                            </>
                        )
                    }

                </form>
            </div>
            <div className="flex mt-2 max-w-6xl gap-2 mx-auto justify-between items-center mb-5">
                <ManageUsers />

                <Avatars />
            </div>

            <hr  className="pb-10"/>
            <Editor />
        </div>
    )
}

export default Document
