import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';


export default function PostPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetch(`https://blog-backend-14ap.onrender.com/post/${id}`)
      .then(response => {
        response.json().then(postInfo => {
          setPostInfo(postInfo);
        });
      });
  }, []);

  if (!postInfo) return '';


  const deletePost = () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    fetch(`https://blog-backend-14ap.onrender.com/post/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting post');
        }
        setSuccess(true);
        navigate('/');
      })
      .catch(error => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <div className="mt-28 mx-20">
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold">{postInfo.title}</h1>
        {userInfo.id === postInfo.author._id && (
          <div className="flex items-center">
            <Link to={`/edit/${postInfo._id}`}> <AiOutlineEdit size="32px" /></Link>
            <div className="mx-2"></div>
            <button className="text-red-700" onClick={deletePost} disabled={loading}>
              {loading ? 'Deleting...' : <AiOutlineDelete size="28px" />}
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-between my-4">
        <div className="text-xl font-medium text-gray-500">By @{postInfo.author.username}</div>
        <time className="text-sm">On: {formatISO9075(new Date(postInfo.createdAt))}</time>
      </div>
      {userInfo.id === postInfo.author._id && (
        <div className="">
          {error && <p>Error: {error}</p>}
          {success && <p>Post deleted successfully!</p>}
        </div>
      )}
      <img className="border rounded-2xl mx-auto flex my-2" src={`https://blog-backend-14ap.onrender.com/${postInfo.cover}`} alt="" />
      <div className=" text-justify text-lg" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
    </div>
  );
}