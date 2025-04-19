"use client"

import React, { useEffect, useState } from 'react'
import { IoIosArrowForward } from "react-icons/io"; 
import { useRouter } from 'next/navigation'; 
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';


export default function Onboard() {
  const router = useRouter();
  const [user,setUser] = useState(null);

  useEffect(()=>{
    console.log("User from onAuthStateChanged:", user);
    const unsubscribe = onAuthStateChanged(auth, (user) =>{
      setUser(user)
    });

    return ()=> unsubscribe()
  },[]);


  const handleSignIn = () => {
    console.log("handleSignIn triggered, user is:", user);
            if (user) {
              router.push('/dashboard');
            } else {
              router.push('/signUp');
            }
          };


  return (
    <div className='flex flex-col  items-center mt-20  text-[var(--tertiary-color)]  font-lateef justify-center'>
        <h1 className='text-6xl mb-2'>TickyTocky</h1>
        <p className='text-xl  mb-20'>Tick it. Tock it. Use it</p>
        <h1 className='text-8xl  mb-16'>Welcome!</h1>
        <h1 className='text-4xl mb-6'>Let's Get Started!</h1>
        <button
      onClick={handleSignIn}
      className="flex items-center shadow-[1px_1px_5px_rgba(0,0,0,0.2)] bg-[var(--secondary-color)] text-[#fff] p-4 rounded-full hover:scale-105 transition-transform duration-200 ease-in-out">
        <IoIosArrowForward size={50} />
    </button>

    </div>

  )
}
