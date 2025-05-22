import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {dummyInterviews} from "@/constants";
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser, getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/auth.action";
const Page = async() => {
    const user=await getCurrentUser();


    const [userInterviews,latestInterviews]=await Promise.all([
        await getInterviewsByUserId(user?.id!),
        await getLatestInterviews({userId:user?.id!})
    ]);

    const hasPastInterviews=userInterviews?.length>0;
    const hasUpcomingInterviews=latestInterviews?.length>0;
    return (
       <>
           <section className="card-cta">
               <div className="flex flex-col gap-6 max-w-lg">
                   <h2>Get ready to test yourself with an AI interview</h2>
                   <p className="text-lg">
                       Practice real interview questions and get instant feedback
                   </p>
                   <Button asChild className="btn-primary max-sm:w-full">
                       <Link href="/interview">Start an Interview</Link>
                   </Button>
               </div>
               <Image src="/robot.png" alt="robot" width={400} height={400} className="max-sm:hidden"/>

           </section>
           <section className="flex flex-col gap-6 mt-8">
               <h2>Your Interviews</h2>
               <div className="interviews-section">
                   {hasPastInterviews?(
                           userInterviews?.map((interview)=>(
                               <InterviewCard {...interview} key={interview.id}/>
                           ))):(
                               <p>you haven&apos;t taken any Interview yet</p>
                       )}
               </div>
           </section>
           <section className="flex flex-col gap-6 mt-8">
               <h2>Take an interview</h2>
               <div className="interviews-section">
                   {hasUpcomingInterviews?(
                       latestInterviews?.map((interview)=>(
                           <InterviewCard {...interview} key={interview.id}/>
                       ))):(
                       <p>there are No Interviews avialable</p>
                   )}

               </div>

           </section>

       </>
    )
}
export default Page

