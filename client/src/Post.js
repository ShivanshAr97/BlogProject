import {formatISO9075} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id,title,summary,cover,content,createdAt,author}) {

  return (
    <div className="flex mx-24 mt-28 mb-12 border rounded-xl items-center">
      <div className="w-[40%]">
        <Link to={`/post/${_id}`}>
          <img className="w-[90%] bg-blue-100 h-60 object-contain border rounded-2xl" src={`${process.env.REACT_APP_CODE_URL}/`+cover} alt=""/>
        </Link>
      </div>

      <div className=" w-[60%] px-4">
        <Link to={`/post/${_id}`}>
        <h2 className="text-3xl font-bold my-4">{title}</h2>
        </Link>

        <p className="flex justify-between">
          <a className="font-bold text-gray-500">By: {author.username}</a>
          <time className="text-sm">On: {formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="my-4 font-xl">{summary}</p>
      </div>
    </div>
  );
}