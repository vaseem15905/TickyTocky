import React from 'react'
import { IoMdHeart } from 'react-icons/io'

export default function Footer() {
  return (
    <footer className='bottom-0 text-center flex  my-3 flex-col items-center w-full gap-2'>
        <h1>&copy; 2025 TickyTocky. All rights reserved.</h1>
        <h1 className='flex flex-row gap-2'>Crafted with<IoMdHeart className='size-5 text-[var(--tertiary-color)]'></IoMdHeart>   by  <a href="https://mohammedvaseemportfolio.pages.dev" className=''> Vaseem</a></h1>
    </footer>
  )
}
