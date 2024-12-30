'use client'
import { LiveList, LiveObject } from "@liveblocks/client"
import { ClientSideSuspense,RoomProvider as RoomProviderWrapper } from "@liveblocks/react/suspense"
import LoadingSpinner from "./LoadingSpinner"
import LiveCursorProvider from "./LiveCursorProvider"
const RoomProvider = ({roomId,children}:{roomId:string,children:React.ReactNode}) => {
  return (
    <RoomProviderWrapper 
        initialPresence={{
            cursor:null
        }} 
        id={roomId}
        
    >
        <ClientSideSuspense fallback={<LoadingSpinner/>}>
            <LiveCursorProvider>
                {children}
            </LiveCursorProvider>
        </ClientSideSuspense>
    </RoomProviderWrapper>
  )
}

export default RoomProvider
