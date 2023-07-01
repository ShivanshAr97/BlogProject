import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: data,
      credentials: 'include',
    });
    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <>
      <h1 className="text-4xl mt-28 justify-center flex font-bold">Create new Blog</h1>
      <form onSubmit={createNewPost} className="my-8 mx-20 flex flex-col">
      <input type="title"
        className="outline-none px-4 py-2 rounded-xl my-2 border-2"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
      className="outline-none px-4 py-2 rounded-xl my-2 border-2"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
      className="outline-none px-4 py-2 rounded-xl my-2 border-2"
        onChange={ev => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button className="w-fit px-8 py-2 rounded-full bg-blue-800 text-white font-medium flex mx-auto my-2 text-lg">Create Post</button>
    </form>
    </>
  );
}