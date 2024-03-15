import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { useDispatch, useSelector } from "react-redux";
import { displayFailure, displaySuccess } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";

const App = () => {
  let blogs = useSelector((state) => state.blogs);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeBlogs());
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      dispatch(displaySuccess("Log in succesful"));
    } catch (exception) {
      dispatch(displayFailure("Log in failed"));
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    console.log("logging out");
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    );
  };

  const blogForm = () => {
    return (
      <div className="mt-32">
        <div className="m-auto max-w-5xl px-4 sm:px-8">
          <p>
            {" "}
            {user.name} has logged in.{" "}
            <button
              className="btn btn-blue"
              data-testid="logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </p>
          <Togglable buttonLabel="New blog" ref={blogFormRef}>
            <BlogForm className="m-auto max-w-5xl px-4 text-center text-sm sm:px-8" />
          </Togglable>
          <ul className="max-w-md rounded-lg bg-white px-8 py-6 shadow-md dark:bg-gray-900">
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} user={user} />
            ))}
          </ul>
          <p></p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Notification />
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  );
};

export default App;
