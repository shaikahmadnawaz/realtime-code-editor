import "./App.css";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";

/* React Router DOM is an npm package that enables you to implement dynamic routing 
  in a web app. It allows you to display pages and allow users to navigate them. 
  It is a fully-featured client and server-side routing library for React. */
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    /* What is a fragment in React? (<></>)
      React Fragments allow you to wrap or group multiple elements 
      without adding an extra node to the DOM. 
      This can be useful when rendering multiple child elements/components 
      in a single parent component.*/
    /* What are props in React? 
      We use props in React to pass data from one component to another 
      (from a parent component to a child component(s)). 
      Props is just a shorter way of saying properties. 
      They are useful when you want the flow of data in your app to be dynamic. */
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              theme: {
                primary: "#4aed88",
              },
            },
          }}
        ></Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
