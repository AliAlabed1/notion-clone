'use client'
import LiveBlocksProvider from '@/components/LiveBlocksProvider'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PageLayout = ({children}:{children:React.ReactNode}) => {
  // const {user} = useUser();
  // const router = useRouter()
  // useEffect(()=>{
  //   console.log('we are in layout')
  //   if(!user) router.replace('/')
  // },[user])
  return (
    <LiveBlocksProvider>
        {children}
    </LiveBlocksProvider>
  )
}

export default PageLayout
