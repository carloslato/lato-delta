import { createLazyFileRoute } from '@tanstack/react-router'
import { AppType, UsersType, AuthType } from "../../functions/api/[[route]]";
import { hc } from "hono/client";
import { useState, useEffect, useLayoutEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {

  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [userslist, setUserslist] = useState<{ name: string; email: string; }[]>();

  async function sendTask() {
  //e.preventDefault;
  const client = hc<AuthType>("");
  const res = await client.api.singup.$post({
    form: {
      name: nameUser,
      email: emailUser,
      password: passwordUser
    },
  });
  const data = await res.json();
  //getTasks();
  console.log(data);
}

async function getTasks() {
  const client = hc<AppType>("");
  const res = await client.api.users.$get();
  const data = await res.json();
  //setUserslist(data);
  console.log(data);
}

useEffect(() => {
  //getTasks();
}, [])


  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div>
        <div>
          <input id="name" type="text" onChange={(e) => setNameUser(e.target.value)} />
          <input id="email" type="text" onChange={(e) => setEmailUser(e.target.value)} />
          <input id="password" type="pasword" onChange={(e) => setPasswordUser(e.target.value)} />
          <button onClick={sendTask}>guardar</button>
        </div>
      </div>

      <ul>
        {userslist?.map((item: any, index: number) =>
            <li key={index}>{item.id}: {item.name} - {item.email}</li>
        )}
      </ul>
      

    </div>
  )
}