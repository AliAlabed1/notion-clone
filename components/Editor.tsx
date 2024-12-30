'use client'
import { useRoom } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from 'yjs';
import {LiveblocksYjsProvider} from '@liveblocks/yjs'
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import BlockNote from "./BlockNote";
import TranslateDocument from "./TranslateDocument";
import ChatToDOcument from "./ChatToDOcument";
const Editor = () => {
    const room = useRoom();
    const [doc,setDoc] = useState<Y.Doc>();
    const [provider,setProvider] =useState<LiveblocksYjsProvider>()
    const [darkmode,setDarkmode] = useState<boolean>(false)

    const style = `hover:text-white ${
        darkmode ?
        'text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700':
        'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
    }`

    useEffect(()=>{
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksYjsProvider(room,yDoc);
        setDoc(yDoc);
        setProvider(yProvider);


        return ()=>{
            yDoc?.destroy();
            yProvider?.destroy();
        }
    },[room])

    if(!doc ||!provider){
        return null
    }
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 justify-end mb-10">
                <TranslateDocument doc={doc} />
                <ChatToDOcument doc={doc} />
                <Button className={style} onClick={()=>setDarkmode(!darkmode  )}>
                    {
                        darkmode ? (<SunIcon />):(<MoonIcon/>  )
                    }
                </Button>
            </div> 
            <BlockNote doc={doc} provider={provider} drarkmode={darkmode} /> 
        </div>
    )
}

export default Editor
