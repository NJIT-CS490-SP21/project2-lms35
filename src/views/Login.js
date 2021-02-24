import Board from "../components/Board";
import {useContext, useEffect, useState} from "react";
import {Context, loginAction} from "../context/user";
import '../assets/styles/Login.css';
import {loginApi, getSessionApi} from "../api/api";

const Login = (props) => {
    const {state, dispatch} = useContext(Context)
    const [value, setValue] = useState('')

    useEffect(() => {
        getSessionApi().then(data => dispatch(loginAction(data)))
    }, [])

    const onClick = (e) => {
        e.preventDefault()
        loginApi(value).then(data => dispatch(loginAction(data)))
    }

    return (
        <div>
            <label htmlFor="username">
                Please enter your username:
                <input type="text" name="username" value={value} onChange={(e) => setValue(e.target.value)}/>
                <button type="button" onClick={onClick}>Submit</button>
            </label>
        </div>
    )

}

export default Login