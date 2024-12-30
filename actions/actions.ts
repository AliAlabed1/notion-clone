'use server'

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server"
import { User } from "@/types/types";
import liveblocks from "@/lib/liveblocks";
export async function createNewDocument(){
    const {userId,redirectToSignIn} = await auth();  
    if(!userId) redirectToSignIn();
    const {sessionClaims}= await auth();
    
    const documentCollectionRef = adminDb.collection('documents');

    const docRef = await documentCollectionRef.add({
        title:'New Doc',
    });

    await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
        userId:sessionClaims?.email!,
        role:"owner",
        createdAt:new Date(),
        roomId:docRef.id
    });
    return {docId: docRef.id}

}

export async function deleteDocument(roomId:string){
    auth.protect()
    console.log(`deleteDocument`,roomId);
    try {
        await adminDb.collection('documents').doc(roomId).delete();

        const query = await adminDb.collectionGroup('rooms').where('roomId','==',roomId).get();
        const batch = adminDb.batch();

        query.docs.forEach((doc)=>batch.delete(doc.ref));

        await batch.commit();
        await liveblocks.deleteRoom(roomId);

        return{success:true}

    } catch (error) {
        console.error(error);
        return{sucess:false}
    }
}

export async function inviteUserTodocument(roomId:string,email:string) {
    auth.protect();
    console.log(`Invite user `,roomId,email);
    try {
        await adminDb.collection('users').doc(email).collection('rooms').doc(roomId).set({
            userId:email,
            role:'editor',
            createdAt:new Date(),
            roomId
        });

        return {success:true}
    } catch (error) {
        console.error("error",error)
        return{success:false}
    }
}

export async function removerUserFromDocument(roomId:string,userId:string) {
    auth.protect();
    console.log(`removing user`,roomId,userId)

    try {
        await adminDb.collection('users').doc(userId).collection('rooms').doc(roomId).delete();
        return {success:true}
    } catch (error) {
        console.error(error);
        return {success:false}
    }
}