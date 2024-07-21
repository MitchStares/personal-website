// src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { fetchBlogs, createBlog, deleteBlog } from '../services/blogService';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import BlogPreview from '../components/BlogPreview';
import MarkdownEditor from '../components/MarkdownEditor';
import './Blog.css'; // Add a CSS file for styling

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
    <div className="blog-container">
      <h1>Blog</h1>
      {user && (
        <form onSubmit={handleSubmit} className="blog-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="blog-title-input"
          />
          <MarkdownEditor value={content} onChange={setContent} />
          <button type="submit" className="blog-submit-button">Submit</button>
        </form>
      )}
      <div className="blog-previews">
        {blogs.map((blog) => (
          <BlogPreview
            key={blog.id}
            id={blog.id}
            title={blog.title}
            summary={blog.content.substring(0, 100)} // Assuming the first 100 characters as summary
            date={blog.date}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Blog;
