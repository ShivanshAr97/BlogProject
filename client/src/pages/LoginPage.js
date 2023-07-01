import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('https://blog-backend-14ap.onrender.com/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form className="mx-40 my-32" onSubmit={login}>
      <h1 className="text-4xl my-8 justify-center flex font-bold">Login</h1>
      <input className=" outline-none px-4 py-2 rounded-xl my-4 border-2 w-[80%] flex mx-auto" type="text"
        placeholder="Username"
        value={username}
        onChange={ev => setUsername(ev.target.value)} />
      <input className="  outline-none px-4 py-2 rounded-xl my-2 border-2 w-[80%] flex mx-auto" type="password"
        placeholder="Password"
        value={password}
        onChange={ev => setPassword(ev.target.value)} />
      <button className="w-fit px-8 py-2 rounded-full bg-blue-800 text-white font-medium flex mx-auto my-4 text-lg">Login</button>
    </form>
  );
}