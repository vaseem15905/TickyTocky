'use client'; 


import React from 'react'
import { IoLogoGoogle } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

export default function SignUp() {
    const router = useRouter();
    const handleGoogleSignIn = async () => {
      try{
        const result = await signInWithPopup(auth, provider);
        console.log("user signed in Successfully",result.user);
        router.push("/dashboard")
      }catch (error){
        console.log("Sign in error",error );
      }
    };

    
  return (
    <div className='flex flex-col  items-center mt-20  text-[var(--tertiary-color)]  font-lateef justify-center'>
            <h1 className='text-6xl mb-2'>TickyTocky</h1>
            <p className='text-xl  mb-20'>Tick it. Tock it. Use it</p>
            <h1 className='text-6xl mb-6'>Sign In to continue</h1>
            <button
         onClick={handleGoogleSignIn}
          className="flex items-center gap-6 shadow-[1px_1px_5px_rgba(0,0,0,0.2)] bg-[var(--secondary-color)] text-[#fff] p-4 rounded-full hover:scale-105 transition-transform duration-200 ease-in-out">
            <IoLogoGoogle size={50} /> <p className='text-2xl'>Sign In with Google</p>
        </button>
        </div>
)
}
