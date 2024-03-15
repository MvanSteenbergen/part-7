import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  displayFailure,
  displaySuccess,
} from "../reducers/notificationReducer";
import { asBlog } from "../reducers/blogReducer";

const BlogForm = ({ createBlog }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    try {
      dispatch(asBlog({ title, author, url }));
      dispatch(displaySuccess(`Added ${title} by ${author}`));
    } catch (exception) {
      dispatch(displayFailure(`Failed to add blog post. ${exception}`));
    }
  };

  return (
    <div>
      <h2>Create Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid="title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="author"
            name="author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="url"
            name="url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button type="submit"> add blog </button>
      </form>
    </div>
  );
};

export default BlogForm;
