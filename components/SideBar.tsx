'use client'
import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {useCollection} from 'react-firebase-hooks/firestore'
import { useUser } from "@clerk/nextjs"
import { collectionGroup, DocumentData, query, where } from "firebase/firestore"
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import SidebarOption from "./SidebarOption"

interface RoomDocument extends DocumentData{
  createdAt:string;
  role:'owner' | 'editor';
  roomId:string;
  userId:string;
}
const SideBar = () => {

  const [groupedData,setGroupedData] = useState<{
    owner: RoomDocument[];
    editor:RoomDocument[];
  }>({
    owner:[],
    editor:[]
  })
  const {user} = useUser();
  const [data,loading,error] = useCollection(
    user && (
      query(collectionGroup(db,'rooms'),where('userId','==',user.emailAddresses[0].toString())
    ))
  );
  useEffect(()=>{
    if(!data)
      return;
    if(!user) {
        setGroupedData({
        owner:[],
        editor:[]
      })
      return;
    }
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor:RoomDocument[];
    }>(
      (acc,curr) => {
        const roomData = curr.data() as RoomDocument;
        console.log(`rooms`,roomData)
        if (roomData.role === 'owner'){
          acc.owner.push({
            id:curr.id,
            ...roomData
          })
        }else{
          acc.editor.push({
            id:curr.id,
            ...roomData
          })
        }
        return acc; 
      },{
        owner:[],
        editor:[]
      }
    )
    setGroupedData(grouped)
  },[data,user])

  const menuOptions = (
    <>
      <NewDocumentButton />
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {
          groupedData.owner.length > 0 ? (
            <>
              <h2 className="text-gray-500 font-semibold text-sm">My Documents</h2>
              {
                groupedData.owner.map((doc)=>(
                  // <p key={doc.roomId}>{doc.roomId}</p>
                  <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                ))
              } 
            </>
            
          ):(
            <h2 className="text-gray-500 font-semibold text-sm">No Documents found</h2>
          )
        }
      </div>

      <div className="flex py-4 flex-col space-y-4 md:max-w-36" >
        {
          groupedData.editor.length>0  && (
            <>
              <h2 className="text-gray-500 font-semibold text-sm">Shared with Me</h2>
              {
                groupedData.editor.map((doc) =>(
                  <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
                ))
              }
            </>
          )
        }
      </div>
    </>
  ) 
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="hidden md:inline">
        {menuOptions}
      </div>
      <div className="inline md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon size={40} className="p-2 hover:opacity-30 rounded-lg"/>
          </SheetTrigger>
          <SheetContent side={'left'}>
            <SheetHeader>
              <SheetTitle>Menue</SheetTitle>
              <div>
                {menuOptions}
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default SideBar
