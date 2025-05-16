import React from 'react'
import Image from "next/image"
import {cn} from "@/lib/utils";

enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED',
}

const Agent = ({userName}: AgentProps) => {
    const Callstatus=CallStatus.FINISHED;
    const isSpeaking=true;
    const messages=[
        'whats your name?',
        'my name is umamaheshwar reddy,glad to meet you',
    ];
    const lastMessage=messages[messages.length-1]
    return (
        <>
        <div className="call-view">
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={65} className="object-cover" />
                    {isSpeaking && <span className="animate-speak"/>}
                </div>
                <h3>Ai Interviewer</h3>

            </div>
            <div className="card-border">
                <div className="card-content">
                    <Image src="/user-avatar1.jpg" alt="user profile" width={540} height={520} className="rounded-full object-cover size-[120px]"/>
                    <h3>{userName}</h3>
                </div>

            </div>

        </div>
            {messages.length>0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>{lastMessage}</p>

                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {Callstatus !== 'ACTIVE' ?(
                    <button className="relative btn-call">
                        <span className={cn('absolute animate-ping rounded-full opacity-75',Callstatus!=='CONNECTING' &'hidden')}></span>
                        <span>
                            {Callstatus==='INACTIVE'||Callstatus==='FINISHED'?'call':'......'}
                        </span>
                    </button>
                ):(
                    <button className="btn-disconnect">
                        End
                    </button>
                )

                }
            </div>
        </>
    )
}
export default Agent
