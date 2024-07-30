import React, { useState, forwardRef, useImperativeHandle, Ref } from 'react'
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import { ToastContainer } from "react-toastify";
const options = [
    "pending",
    'in-progress',
    'completed'
]

interface todoField{
    title: string;
    description: string;
}

interface TodoComponentProps {
    todo: todoField;
    select: string;
    handleSubmit: (event: React.FormEvent) => void;
    handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    handleSelect:  React.ChangeEventHandler;
 }

export interface TodoComponentHandles {
    toggleOpen: () => void;
}

const TodoForm = forwardRef<TodoComponentHandles, TodoComponentProps>((props, ref: Ref<TodoComponentHandles>) => {
    const [open, setOpen] = useState(false)
    const {todo, select, handleSubmit, handleChange, handleSelect } = props
   
    useImperativeHandle(ref, () => ({
        toggleOpen() {
            setOpen(!open);
        },
    }));

    return (
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-scroll">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Title
                                </label>
                                <input onChange={handleChange} value={todo.title} minLength={20} maxLength={50} required className="shadow appearance-none border border-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" name="title" type="text" placeholder="Title" />
                            </div>
                            <div className='mb-4'>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea onChange={handleChange} value={todo.description} rows={10} className="resize-y rounded-md shadow appearance-none border border-slate-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="description" id="description"></textarea>
                            </div>
                            <div className="relative h-auto ">
                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select status</label>
                                <select id="status" value={select} name="status" onChange={handleSelect} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    {options.map((option) => <option value={option}>{option}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="inline-flex w-full justify-center rounded-md bg-dark_pink px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
       <ToastContainer />
        </Dialog>
    )
})

export default TodoForm;