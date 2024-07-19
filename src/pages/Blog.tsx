// src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { fetchBlogs, createBlog, deleteBlog } from '../services/blogService';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

interface Blog {
  id: string;
  title: string;
  content: string;
  date: Date;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getBlogs = async () => {
      const response = await fetchBlogs();
      setBlogs(response);
    };

    onAuthStateChanged(auth, (user) => {
      setUser(user);
      getBlogs();
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const newBlog = { title, content, date: new Date() };
      await createBlog(newBlog);
      setTitle('');
      setContent('');
      const response = await fetchBlogs();
      setBlogs(response);
    } else {
      alert('You must be logged in to create a blog post.');
    }
  };

  const handleDelete = async (id: string) => {
    if (user) {
      await deleteBlog(id);
      const response = await fetchBlogs();
      setBlogs(response);
    } else {
      alert('You must be logged in to delete a blog post.');
    }
  };

  return (
    <div>
      <h1>Blog</h1>
      {user && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
          />
          <button type="submit">Submit</button>
        </form>
      )}
      <div>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <p>{new Date(blog.date).toLocaleDateString()}</p>
            {user && <button onClick={() => handleDelete(blog.id)}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
