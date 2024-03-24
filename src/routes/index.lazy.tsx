import { createLazyFileRoute } from '@tanstack/react-router'
import { AppType, UsersType } from "../../functions/api/[[route]]";
import { hc } from "hono/client";
import { useState, useEffect, useLayoutEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {

  const [idUser, setIdUser] = useState('');
  const [nameUser, setNameUser] = useState('');
  const [emailUser, setEmailUser] = useState('');
  const [todolist, setTodolist] = useState<UsersType>();

  async function sendTask() {
  //e.preventDefault;
  const client = hc<AppType>("");
  const res = await client.api.users.$post({
    form: {
      idUser: `${idUser}`,
      name: nameUser,
      email: emailUser,
      
    },
  });
  const data = await res.json();
  getTasks();
  console.log(data);
}

async function getTasks() {
  const client = hc<AppType>("");
  const res = await client.api.users.$get();
  const data = await res.json();
  //setTodolist(data.todos);
  console.log(data);
}

useEffect(() => {
  getTasks();
}, [])


  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div>
        <div>
          <input id="id" type="number"  onChange={(e) => setIdUser(e.target.value)} />
          <input id="name" type="text" onChange={(e) => setNameUser(e.target.value)} />
          <input id="email" type="text" onChange={(e) => setEmailUser(e.target.value)} />
          <button onClick={sendTask}>guardar</button>
        </div>
      </div>

      <ul>
        {todolist?.map((item: any, index: number) =>
            <li key={index}>{item.id}: {item.name} - {item.email}</li>
        )}
      </ul>
      

    </div>
  )
}