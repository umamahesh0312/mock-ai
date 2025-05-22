"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import {toast} from "sonner"
import FormField from "@/components/FormField"
import  {useRouter}  from "next/navigation"
import {createUserWithEmailAndPassword} from "firebase/auth";
import {signIn, signUp} from "@/lib/actions/auth.action";
import {auth} from "@/firebase/client";
import {signInWithEmailAndPassword} from "firebase/auth";
type FormType = 'sign-in' | 'sign-up'



const authFormSchema=(type: FormType)=>{
    return z.object({
        name:type==='sign-up'?z.string().min(3):z.string().optional(),
        email:z.string().email(),
        password:z.string().min(6),
    })
}

const Authform = ({ type }:{type: FormType}) => {
    const router=useRouter();
    const formSchema = authFormSchema(type)
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email:"",
            password:"",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try{
            if(type==='sign-up'){
                const {name,email,password}=values;
                const userCredentials=await createUserWithEmailAndPassword(auth,email,password);
                const result=await signUp({
                    uid:userCredentials.user.uid,
                    name:name!,
                    email,
                    password,
                })
                if(!result?.success){
                    toast.error(result?.message);
                    return;
                }
                toast.success('Registration successful. Please login to continue.');
                router.push('/sign-in')
            }
            else{
                const {email,password}=values;

                const userCredentials=await signInWithEmailAndPassword(auth,email,password);

                const idToken=await userCredentials.user.getIdToken();
                if(!idToken){
                    toast.error('There is an error logging in');
                    return;
                }
                await signIn({
                    email,
                    idToken,
                })


                toast.success('login successful');
                router.push('/')
            }

        }catch(error){
            console.log(error);
            toast.error(`there is an error:${error}`)
        }
    }
    const isSignIn =type==='sign-in';
    return  (

        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38}/>
                    <h2 className="text-primary-100">Prepwise</h2>
                </div>
                <h3>practise job interview with Ai</h3>
                <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className=" w-full space-y-6 mt-4 form">
                            {!isSignIn && (
                                <FormField
                                    control={form.control}
                                    name="name"
                                    label="Name"
                                    placeholder="your name"/>
                            )}
                            <FormField
                                control={form.control}
                                name="email"
                                label="email"
                                placeholder="enter your email address"/>
                            <FormField
                                control={form.control}
                                name="password"
                                label="password"
                                placeholder="enter your password"/>
                            <Button type="submit">{isSignIn?'Sign in':'create an account'}</Button>
                        </form>
                </Form>
                <p className="text-center">
                {isSignIn?'no account yet?':'already have an account?'}
                <Link href={isSignIn?'/sign-up':'/sign-in'} className="font-bold text-user-primary ml-1">
                    {!isSignIn?"sign-in":"sign-up"}
                </Link>
                </p>
            </div>
        </div>
    )

}
export default Authform
