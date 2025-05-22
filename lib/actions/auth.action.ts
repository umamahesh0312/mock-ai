'use server';
import {db,auth} from "@/firebase/admin";
import {cookies} from "next/headers";

export async function signUp(params:SignUpParams){
    const {uid,name,email}=params;

    try{
        const userRecord=await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return{
                success:false,
                message:'User already exists'
            }
        }
        await db.collection('users').doc(uid).set({
            name,email,
        })
        return{
            success:true,
            message:'User created successfully'
        }
    }
    catch(e:any){
        console.error('Error creating a user');
        if(e.code==='auth/email-already-exists'){
            return{
                success:false,
                message:'This email already in use.'
            }
        }
    }
}

export async function signIn(params:SignInParams){
    const {email,idToken}=params;
   try{
       const userRecord=await auth.getUserByEmail(email);
       if(!userRecord){
           return{
               success:false,
               message:'User does not exist. Please sign up'
           }
       }
       await setSessionCookie(idToken);
   }
   catch (e) {
       console.log(e);
       return{
           success:false,
           message:'Invalid email or password'
       }

   }
}

export async function setSessionCookie(idToken:string){
    const cookieStore=await cookies();
    const seesionCookie=await auth.createSessionCookie(idToken,{
        expiresIn:60*60*24*7*1000,
    })

    cookieStore.set('session',seesionCookie,{
       maxAge:60*60*24*7*1000,
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        path:'/',
        sameSite:'lax'
    })
}

export async function getCurrentUser(): Promise<User|null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie){
        return null;
    }
    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if(!userRecord.exists){return null}
        return {
            ...userRecord.data(),
            id:userRecord.id,
        } as User;
    }
    catch (e) {
        console.log(e);
        return null;
    }

    // const idToken = await auth.verifySessionCookie(sessionCookie,true);
    // return idToken;
}

export async function isAuthenticated(){
    const user=await getCurrentUser();
    return !!user;
}
