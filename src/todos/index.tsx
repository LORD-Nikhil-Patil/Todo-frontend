import { useEffect, useRef, useState } from 'react';
import TodoForm, { TodoComponentHandles } from './addTodoModal';
import DeleteTodo, { ErrorComponentHandles } from './deleteTodoModa';
import { postTodo, getTodos, gtTodoById, patchTodo, deleteTodo } from './hooks'
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Todos = () => {
    const todoComponentRef = useRef<TodoComponentHandles>(null);
    const ErrorComponentRef = useRef<ErrorComponentHandles>(null);
    const addTodo = postTodo();
    const todoList = getTodos();
    const getTodo = gtTodoById();
    const updateTodo = patchTodo();
    const removeTodo = deleteTodo()
    const [todo, setTodo] = useState({
        title: "",
        description: "",
    });

    const [select, setSelect] = useState('pending');
    const [method, setMethod] = useState('');
    const [deleteTodoId, setDeleteTodo] = useState("")
    useEffect(() => {
        todoList.execute()
    }, [addTodo.data, updateTodo.data, removeTodo.data,]);

    useEffect(() => {
        toast.error(todoList?.errorData, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        console.log("useEffect",  todoList.errorData)

    }, [addTodo.error, updateTodo.error, removeTodo.error, todoList.error]);

    useEffect(() => {
        setTodo({ title: getTodo.data.title, description: getTodo.data.description });
        setSelect(getTodo.data.status)
    }, [getTodo.data])

    const handleAddTodo = () => {
        handleTodoModal()
        setMethod("add")
    }

    const handleTodoModal = () => {
        if (todoComponentRef.current) {
            todoComponentRef.current.toggleOpen();
        }
    };

    const handleErrorModal = (id: string) => {
        if (ErrorComponentRef.current) {
            ErrorComponentRef.current.toggleOpen();
        }
        setDeleteTodo(id)
    } 

    const handleSubmit = async () => {
        if (todo.title.length > 100 || todo.description.length > 500) {
            toast.error("Title must be less than 100 and description must be less than 500", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return
        } else if (todo.title.length <= 0 || todo.description.length <= 0) {
            toast.error("Input field must not be empty.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return
        }

        const userId = localStorage.getItem('userId')

        if (method === 'add') {
            let postParams = {
                data: {
                    ...todo,
                    status: select,
                    user: userId
                }
            }
            await addTodo.execute(postParams)
        } else {
            let patchParams = {
                data: {
                    ...todo,
                    status: select
                },
                id: getTodo.data.id
            }
            await updateTodo.execute(patchParams)
        }
        setTodo({title:'', description: ""})
        handleTodoModal()
    };

    const handleSelect = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setSelect(e.target.value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const { name, value } = e.target;
        setTodo({
            ...todo,
            [name]: value
        });
    }

    const handleTodoUpdate = async (todoId: string) => {
        const parameters = {
            id: todoId
        }
        await getTodo.execute(parameters)
        setMethod("update")
        handleTodoModal()
    }

    const handleTodoDelete = async () => {

        let deleteParams = {
            id: deleteTodoId
        }
        removeTodo.execute(deleteParams)
    }
    return (<div className="w-full bg-white">
        <TodoForm ref={todoComponentRef} todo={todo} select={select} handleSubmit={handleSubmit} handleChange={handleChange} handleSelect={handleSelect} />
        <DeleteTodo ref={ErrorComponentRef} handleTodoDelete={handleTodoDelete} cancel={setDeleteTodo} />
        <div className="w-full max-h-20 text-right align-middle bg-slate-500 py-4 px-10">
            <button onClick={handleAddTodo} className=" bg-dark_pink hover:bg-white_pink text-white border border-0 text-base font-semibold py-1 px-3 border rounded">
                + Add Todo
            </button>
        </div>
        <div className="w-full min-h-svh bg-slate-300">
            <div className="p-10">
                {!todoList.loading ? todoList.data.results && todoList.data.results.map((todo: any) => <article key={todo.id} className="p-6 my-3 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className='flex justify-between'>
                        <div className="flex justify-between items-center mb-5 text-gray-500">
                            <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                                <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path></svg>
                                {todo.status}
                            </span>
                            <span className="text-sm">{todo.createdAt}</span>
                        </div>
                        <div className='cursor-pointer' onClick={() => handleTodoUpdate(todo.id)}>
                            <span className="material-symbols-outlined text-gray-500">
                                edit
                            </span>
                        </div>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">{todo.title}</a></h2>
                    <p className="mb-5 font-light text-gray-500 dark:text-gray-400">{todo.description}</p>
                    <div className="w-full flex items-end">
                        <div onClick={() => handleErrorModal(todo.id)} className="inline-flex ml-auto mr-0 left-auto right-0 cursor-pointer">
                            <span className="material-symbols-outlined text-2xl border-0 font-semibold text-pink-900">
                                delete_forever
                            </span>
                        </div>
                    </div>
                </article>) :
                    <div className="flex items-center justify-center h-screen">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 bg-slate-500"></div>
                            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                            </div>
                        </div>
                    </div>
                }
            </div>

        </div>
        <ToastContainer />
    </div>)
}

export default Todos;