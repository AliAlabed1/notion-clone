'use client'

import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Fragment, useEffect } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/firebase";

const Breadcrumbs = () => {
    const path = usePathname()
    const segments = path.split('/');
    
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {
                    segments.map((segment,index)=>{
                        if(!segment) return null;
                        const href = `/${segments.slice(0,index+1).join('/')}`;
                        const isLast = index ===segments.length - 1;
                        return(
                            <Fragment key = {segment}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    {
                                        isLast || index ===1 ? (
                                            <BreadcrumbPage>{segment}</BreadcrumbPage>
                                        ):(
                                            <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                                        )
                                    }
                                </BreadcrumbItem>
                            </Fragment>

                        )
                    })
                }
                
            </BreadcrumbList>
        </Breadcrumb>

    )
}

export default Breadcrumbs
