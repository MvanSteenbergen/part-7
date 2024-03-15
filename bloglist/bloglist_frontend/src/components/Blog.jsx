import { useState } from "react";
import { likeBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";
import { deleteBlog } from "../reducers/blogReducer";
import { displayFailure } from "../reducers/notificationReducer";

const Blog = ({ blog, user }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const like = (event) => {
    event.preventDefault();
    dispatch(likeBlog(blog));
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    if (window.confirm("Do you really want to delete this post?")) {
      try {
        dispatch(deleteBlog(blog));
      } catch (exception) {
        dispatch(displayFailure(`Failed to delete blog. ${exception}`));
      }
    }
  };

  const deleteButton = () => {
    return (
      <button className="btn" onClick={deleteHandler}>
        delete
      </button>
    );
  };

  return (
    <li
      className="blog flex border-b border-gray-200 px-4 py-2 text-white transition-all duration-300 ease-in-out last:border-none hover:bg-sky-100 hover:text-sky-900"
      data-testid="blog"
    >
      <div className="" data-testid="titleandauthor">
        {blog.title} by {blog.author}
        <button
          className="btn right flex  rounded-lg border border-gray-200"
          onClick={toggleVisibility}
        >
          view
        </button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <div data-testid="url2">{blog.url}</div>
        <div id="likes" data-testid="likes">
          likes {blog.likes}
        </div>
        <div data-testid="name">{blog.user.name}</div>
        <button className="btn" onClick={like}>
          like
        </button>
        {user.username === blog.user.username && deleteButton()}
      </div>
    </li>
  );
};

export default Blog;
