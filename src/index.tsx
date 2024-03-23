// import { useState } from "hono/jsx";
// import { render } from "hono/jsx/dom";
// import { AppType } from "../functions/api/[[route]]";
// import { hc } from "hono/client";


// async function name() {
//   const client = hc<AppType>("");
//   const res = await client.api.todo.$post({
//     form: {
//       id: "Hono 3",
//       title: "Hola que tal 4",
//     },
//   });

//   const data = await res.json();
//   console.log(`${data.message}`);
// }

// name();



// function App() {
//   return (
//     <>
//       <Counter />

//     </>
//   );
// }

// const root: HTMLElement = document.getElementById("root") as HTMLElement;
// render(<App />, root);

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}