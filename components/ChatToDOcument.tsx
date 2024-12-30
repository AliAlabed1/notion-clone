import * as Y from 'yjs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { FormEvent, useEffect, useState, useTransition } from 'react'
import { Input } from './ui/input'
import { BotIcon, MessageCircleCode } from 'lucide-react'
import Markdown from 'react-markdown'
import { toast } from 'sonner'
const ChatToDOcument = ({doc}:{doc:Y.Doc}) => {
    const [isOpen,setIsopen] = useState<boolean>(false);
    const [isPending,startTransition] = useTransition();
    const [question,setQuestion] = useState<string>('');
    const [summary,setSummary] = useState<string>('')
    const handleSubmit = ((e:FormEvent)=>{
        e.preventDefault()
        startTransition(async()=>{
            const documentData = doc.get('document-store').toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        documentData,
                        question
                    })
                }
            )
            if(res.ok){
                const {message} = await res.json();
                setSummary(message)
                setQuestion('')
                toast.success('Question asked successfully!')
            }
        })
    })
    useEffect(()=>{
        if(!isOpen){
            setQuestion('');
            setSummary('');
        }
    },[isOpen])
  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
        <Button asChild variant={'outline'}>
            <DialogTrigger><MessageCircleCode className='mr-2'/> <p className='hidden md:block'>Chat to Document</p> </DialogTrigger>
        </Button>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Chat to document!</DialogTitle>
            <DialogDescription>
                Ask a question and chat to the document with AI.
            </DialogDescription>
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
                        {isPending ? <p>Thinking...</p>:<Markdown>{summary}</Markdown>}
                    </div>
                )
            }
            <form onSubmit={handleSubmit}  className="flex flex-col gap-2">
                <Input
                    type="text"
                    placeholder="i.e What is this about?"
                    className="w-full"
                    value={question}
                    onChange={(e)=>setQuestion(e.target.value)}
                />
                <Button 
                    type="submit"
                    disabled ={isPending || !question.length}
                >
                    {isPending?"Asking..." : "Ask"}
                </Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default ChatToDOcument
