import { createLazyFileRoute } from '@tanstack/react-router'
import { AppType, TodosType } from "../../functions/api/[[route]]";
import { hc } from "hono/client";
import { useState, useEffect, useLayoutEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {

  const [idTask, setIdTask] = useState('');
  const [titleTask, setTitleTask] = useState('');
  const [todolist, setTodolist] = useState<TodosType>([])

  async function sendTask() {
  //e.preventDefault;
  const client = hc<AppType>("");
  const res = await client.api.todo.$post({
    form: {
      id: idTask,
      title: titleTask,
    },
  });
  const data = await res.json();
  getTasks();
  console.log(`${data.message}`);
}

async function getTasks() {
  const client = hc<AppType>("");
  const res = await client.api.todo.$get();
  const data = await res.json();
  setTodolist(data.todos);
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
          <input id="id" type="text"  onChange={(e) => setIdTask(e.target.value)} />
          <input id="title" type="text" onChange={(e) => setTitleTask(e.target.value)} />
          <button onClick={sendTask}>guardar</button>
        </div>
      </div>

      <ul>
        {todolist?.map((item, index) =>
            <li key={index}>{item.id}: {item.title}</li>
        )}
      </ul>
      

    </div>
  )
}