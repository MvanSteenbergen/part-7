import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    updateBlog(state, action) {
      return state
        .map((blog) => (action.payload.id !== blog.id ? blog : action.payload))
        .sort((a, b) => b.likes - a.likes);
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const { updateBlog, appendBlog, setBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    blogs.sort((a, b) => b.likes - a.likes);
    dispatch(setBlogs(blogs));
  };
};

export const asBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (blog) => {
  const changedBlog = {
    ...blog,
    likes: blog.likes + 1,
  };
  return async (dispatch) => {
    await blogService.update(changedBlog.id, changedBlog);
    dispatch(updateBlog(changedBlog));
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleting(blog.id);
    dispatch(initializeBlogs());
  };
};

export default blogSlice.reducer;
