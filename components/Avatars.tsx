import { useOthers, useSelf } from '@liveblocks/react/suspense'
import React from 'react'
import {Avatar,AvatarFallback,AvatarImage} from '@/components/ui/avatar'
import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from './ui/tooltip'
const Avatars = () => {
    const others = useOthers();
    const self =useSelf();
    const all = [self,...others]
  return (
    <div className='flex gap-2 items-centetr  '>
        <p className='font-light text-sm self-center'>Users currently editing this page</p>
        <div className='flex -space-x-5'>
            {
                all.map((other,i)=>(
                    <TooltipProvider key={other?.id + i}>
                        <Tooltip>
                        <TooltipTrigger>
                            <Avatar className='border-2 hover:z-50'>
                                <AvatarImage src={other?.info.avatar} />
                                <AvatarFallback>{other?.info.name}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{self?.id === other?.id ? "You":other?.info.name}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                  
                ))
            }
        </div>
      
    </div>
  )
}

export default Avatars
