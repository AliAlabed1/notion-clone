import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { useRoom } from "@liveblocks/react/suspense";
import { collectionGroup, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

function isOwner(){
    const {user} = useUser();
    console.log('user',user)
    const room = useRoom();
    const [isOwner,setIsowner] = useState<boolean>(false)
    const [userInRoom] = useCollection(
        user && query(collectionGroup(db,'rooms'),where('roomId','==',room.id))
    );

    useEffect(()=>{
        if(userInRoom?.docs && userInRoom.docs.length>0){
            const owners = userInRoom.docs.filter((doc)=>doc.data().role === 'owner');
            if(owners.some((owner)=>owner.data().userId === user?.emailAddresses[0].toString())){
                setIsowner(true)
            }
        }
    },[userInRoom,user])
    return isOwner;
}
export default isOwner;