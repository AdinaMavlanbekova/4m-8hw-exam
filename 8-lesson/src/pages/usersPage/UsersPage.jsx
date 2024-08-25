import {useForm} from "react-hook-form";
import {useState, useEffect} from "react";


const URL = "http://localhost:8000/users"
function UsersPage() {

    const {
        register,
        handleSubmit,
        reset
    } = useForm()

    const [users, setUsers] = useState([])
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);


    async function getUser() {
        const response = await fetch(URL)
        const data = await response.json()
        setUsers(data)
    }

    async function createUser(data) {
        // const newUser = {title: table}
        const response = await fetch(URL,{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201){
            getUser()
            showModalWithMessage('Пользователь успешно создан')
        }
    }

    const submit = (data) => {
        createUser(data)
        reset()
    }

    async function deleteUser (id) {
        const response = await fetch(`${URL}/${id}`,{
            method: 'DELETE',
        })
        if(response.status === 200){
            getUser()
            showModalWithMessage('Пользователь удален');
        }
    }

    const showModalWithMessage = (message) => {
        setModalMessage(message)
        setShowModal(true)
        setTimeout(() => {
            setShowModal(false)
            setModalMessage('')
        }, 2000)
    };


    useEffect(() => {
        getUser()
    },[])



    return (
        <>
            <form onSubmit={handleSubmit(submit)}>
                <input type="text" placeholder="name" {...register('name', {required: true})}/>
                <input type="text" placeholder="email" {...register('email', {required: true})}/>
                <input type="text" placeholder="username" {...register('username', {required: true})}/>
                <button>create</button>
            </form>

            {
               users.length > 0 ? (
                    <table>
                        <thead>
                        <tr>
                                <th>name</th>
                                <th>email</th>
                                <th>username</th>
                                <th>actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr>
                            {
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.username}</td>
                                        <td>
                                            <button onClick={() => deleteUser(user.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tr>
                        </tbody>
                    </table>

                ) : (
                    <p>список пуст</p>
                )
            }

            {showModal && (
                <p className={"modal"}>{modalMessage}</p>
            )}

        </>
    );
}

export default UsersPage;