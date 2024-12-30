import { LiveblocksYjsProvider } from "@liveblocks/yjs"
import * as Y from 'yjs'
import {BlockNoteView} from '@blocknote/shadcn';
import {BlockNoteEditor} from '@blocknote/core';
import { useCreateBlockNote } from "@blocknote/react";
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css'
import { useSelf } from "@liveblocks/react/suspense";
import stringToColor from "@/lib/stringToColor";
const BlockNote = ({provider,doc,drarkmode}:{provider:LiveblocksYjsProvider,doc:Y.Doc,drarkmode:boolean}) => {
    const userInfo = useSelf((me)=>me.info)
    const editor : BlockNoteEditor = useCreateBlockNote({
        collaboration:{
            provider,
            fragment:doc.getXmlFragment('document-store'),
            user:{
                name:userInfo.name,
                color:stringToColor(userInfo.emmail)
            }
        }
    })
    return (
        <div className="relative max-w-6xl mx-auto">
            <BlockNoteView 
                editor={editor}
                theme={drarkmode? 'dark':'light'}
                className="min-h-screen "

            />
        </div>
    )
}

export default BlockNote
