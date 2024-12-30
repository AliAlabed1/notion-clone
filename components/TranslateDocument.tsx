'use client'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import * as Y from 'yjs'
import { Button } from './ui/button'
import { DialogHeader } from './ui/dialog'
import Markdown from 'react-markdown'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BotIcon, LanguagesIcon } from 'lucide-react'
import { toast } from 'sonner'
  
type Languages  = 
    | "english"
    | "spanish"
    | "portuguese"
    | "french"
    | "german"
    | "arabic"
    | "chinese"
    | "hindi"
    | "russian"
    | "japanese"

const languages:Languages[]=[
    "english"
    , "spanish"
    , "portuguese"
    , "french"
    , "german"
    , "arabic"
    , "chinese"
    , "hindi"
    , "russian"
    , "japanese"
]
const TranslateDocument = ({doc}:{doc:Y.Doc}) => {
    const [isOpen,setIsopen] = useState<boolean>(false);
    const [isPending,startTransition] = useTransition();
    const [language,setLanguage] = useState<string>('');
    const [summary,setSummary] = useState<string>('');
    const [question,setQuestion] = useState<string>('')
    const handleAskQuestion = async (e:FormEvent)=>{
        e.preventDefault();
        startTransition(async()=>{
            const documentData = doc.get('document-store').toJSON();
            console.log(`documentData:`,documentData)
            const request = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    documentData,
                    targetLanguage:language
                })
            });
            console.log(request)

            if(request.ok){
                const {message} = await request.json();
                setSummary(message)
                setQuestion('')
                toast.success('Question asked successfully!')
            }
        })
    }

    useEffect(()=>{
        if(!isOpen){
            setLanguage('');
            setSummary('')
        }
    },[isOpen])
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
        <Button asChild variant={'outline'}>
            <DialogTrigger><LanguagesIcon /><p className='hidden md:block'>Translate</p></DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Translate the Document</DialogTitle>
            <DialogDescription>
                Select a Language and AI will translate a summary of the document to selected language. 
            </DialogDescription>
            <hr className='mt-5'/>
            {question && <p className='mt-5 text-gray-500'>Q: question</p>}
            </DialogHeader>
            {
                summary &&(
                    <div className='flex flex-col items-start max-h-60 overflow-y-scroll gap-2 p-5 bg-gray-100'>
                        <div className='flex'>
                            <BotIcon className='w-10 flex-shrink-0'/>
                            <p className='font-bold'>
                                GPT {isPending?'is thinking...':'says:'}
                            </p>
                        </div>
                        {isPending ? <p>'Thinking...'</p>:<Markdown>{summary}</Markdown>}
                    </div>
                )
            }
            <form onSubmit={handleAskQuestion}  className="flex flex-col gap-2">
            <Select value={language} onValueChange={(value)=>setLanguage(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {
                        languages.map((lang)=>(
                            <SelectItem key={lang} value={lang}>{lang.toLocaleUpperCase()}</SelectItem>
                        ))
                    }
                </SelectContent>
            </Select>

                <Button 
                    type="submit"
                    disabled ={isPending || !language.length}
                >
                    {isPending?"Translating..." : "Translate"}
                </Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default TranslateDocument
