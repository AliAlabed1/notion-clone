'use client '

import { useMyPresence,useOthers } from "@liveblocks/react/suspense"
import FollowPointer from "./FollowPointer";

const LiveCursorProvider = ({children}:{children:React.ReactNode}) => {
    const [myPresence,updateMyPresence]= useMyPresence();
    const others = useOthers();
    function  handlePointerMove(e:any){
        const cursor = {x:Math.floor(e.pageX),y:Math.floor(e.pageY)};
        updateMyPresence({cursor})
    }
    function  handlePointerLeave(e:any){
        updateMyPresence({cursor:null})
    }
    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {others.filter((other)=>other.presence.cursor !==null).map(({connectionId,presence,info})=>(
                <FollowPointer
                    key = {connectionId} 
                    info = {info}
                    x = {presence.cursor!.x}
                    y = {presence.cursor!.y}
                />
            ))}
            {children}
        </div>
    )
}

export default LiveCursorProvider
