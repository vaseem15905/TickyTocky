"use client"

import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import {FaCheckCircle, FaEdit, FaPlus, FaTrash, FaCheck} from 'react-icons/fa'
import { useRouter } from 'next/navigation';
import { auth,db } from '@/lib/firebase';
import { addDoc,doc, collection, deleteDoc, onSnapshot, orderBy,where, query, updateDoc } from 'firebase/firestore';

export default function Dashboard() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);
    const [user,setUser] = useState(null);
    const [taskInput,setTaskInput] = useState('');
    const [tasks,setTasks] = useState([]);
    const [isEditing,setIsEditing] = useState(false)
    const [editTaskId, setEditTaskId] = useState(null);
    const [currentTime,setCurrentTime] = useState('')
    const completedCount = tasks?.filter(task=>task.completed).length || 0
    const totalCompletedCount = tasks?.length || 0;
    

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if(user){
                const firstName = user.displayName.split(' ')[0]
                setUserInfo({name: firstName, displaypicture:user.photoURL})
            }
            else{
                router.push("/signUp")
            }
        })
        return ()=> unsubscribe();
    },[router])


    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
        })
        return ()=> unsubscribe();
    },[])


    const handleTaskCompleted = async (task) => {
        try{
            updateDoc(doc(db,"tasks",task.id),{
                completed: !task.completed
            })
        }catch(error){
                console.error("error fetching task completed Status",error)
        }
    }

    const handleAddTask = async () => {
        if(!taskInput.trim()) return
        try{
            await addDoc(collection(db,"tasks"),{
                uid: user.uid,
                createdAt: new Date(),
                task: taskInput,
                completed : false,
            })
            setTaskInput("")
        }catch(error){
            console.error("error adding doc : ",error)
        }
    }

    const handleUpdateTask = async () => {
        if(!taskInput.trim() || !editTaskId) return
        console.log("Updating task", taskInput, editTaskId)

        const taskref= doc(db,"tasks",editTaskId)
        try{
            await updateDoc(taskref,{
                task: taskInput
            })
            setIsEditing(false)
            setEditTaskId(null)
            setTaskInput("")
        }catch(error){
            console.log("error updating task",error)
        }
    }

    useEffect(()=>{
        if(!user) return


        const q = query(
            collection(db,"tasks"),
            where("uid","==",user.uid),
            orderBy("createdAt","desc")
        )
        const unsubscribe = onSnapshot(q,(querySnapshot) => {
            const tasksData = [];
            querySnapshot.forEach((doc)=>{
                tasksData.push({...doc.data(),id : doc.id})
            })
            setTasks(tasksData);
        })
        return () => unsubscribe();
    },[user])


    const handleDeleteTask = async (taskId) => {
        try {
            // Create a reference to the document you want to delete
            const taskDoc = doc(db, "tasks", taskId);
            
            // Delete the document
            await deleteDoc(taskDoc);
        } catch (error) {
            console.log("Error deleting task", error);
        }
    };

    useEffect(()=>{
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString())
        }
        updateTime()
        const interval = setInterval(updateTime,1000)
        return ()=> clearInterval(interval)
    },[])

  return (
    <div className='flex flex-col justify-center items-center w-full '>
    <div className='w-full  flex flex-row items-center p-2 text-[var(--tertiary-color)]  font-lateef justify-between'>
        <div className='flex flex-row  justify-start gap-4'>
            <div className='flex flex-col justify-center' >
                <img src={userInfo?.displaypicture} alt="" className='object-fit size-12 rounded-full border-2 ' />
            </div>
            <div>
                <h1 className='text-2xl'>Hey, {userInfo?.name}</h1>
                <a href="/signUp" className='underline text-md'>Log out</a>
            </div>
        </div>
            <div className='flex flex-col justify-end items-center'>
                <h1 className='text-xl'>{new Date().toDateString()}</h1>
                <h1 className='text-xl'>{currentTime}</h1>
            </div>
    </div>
    <div className='flex flex-col w-full items-center justify-center md:w-1/2 p-2 gap-3'>
        <h1 className='text-2xl text-center text-[var(--tertiary-color)] mt-4'>Add your task here</h1>
        <div className='border-2 bg-[var(--taskbox)] border-[var(--tertiary-color)] rounded-full p-2 w-full flex flex-row justify-between items-center'>
        <input
        value={taskInput}
        onChange={(e)=> setTaskInput(e.target.value)}
         type="text" className='focus:outline-none text-xl text-[var(--tertiary-color)] p-2' placeholder='Add your task here' />
        <button
        onClick={isEditing?handleUpdateTask:handleAddTask}
        className='bg-[var(--secondary-color)] text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-150'>{isEditing ? <FaCheck size={25}/> :<FaPlus size={25}/>}</button>
        </div>
        <div className='flex flex-row w-full justify-center items-center'>
        <h1 className=' text-[var(--tertiary-color)] text-3xl'>{completedCount}</h1>
        <h1>/{totalCompletedCount} task(s) completed.</h1>
        </div>
    </div>
    <div className='flex flex-col w-full items-center justify-center md:w-1/2 p-2 gap-3'>
        {tasks.map((task)=>(
            <div key={task.id} className="bg-[var(--taskbox)] rounded-full p-1 w-full flex flex-row justify-between items-center" >
            <button onClick={()=>handleTaskCompleted(task)} className='flex flex-row justify-start items-center gap-4'>
                <div className=' text-[var(--secondary-color)] rounded-full'>{task.completed ? " " :<FaCheckCircle size={40}/>}</div>
                <h1 className={task.completed ? "line-through w-full text-[var(--tertiary-color)] text-xl": "w-full text-[var(--tertiary-color)] text-xl"}>{task.task}</h1>
            </button>
            <div className='flex flex-row gap-1'>
                <button
                onClick={()=>{
                    setTaskInput(task.task)
                    setIsEditing(true)
                    setEditTaskId(task.id)
                }}
                className='bg-[var(--secondary-color)] text-white p-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-150'><FaEdit size={20}/></button>
                <button
                onClick={()=>handleDeleteTask(task.id)}
                 className='bg-red-400 text-white p-2 rounded-full hover:scale-105 active:scale-95 transition-all duration-150'><FaTrash size={20}/></button>
            </div>
        </div>
        ))}
    </div>


    </div>
  )
}
