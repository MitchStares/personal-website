// src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { fetchBlogs, createBlog, deleteBlog } from '../services/blogService';
import { ToastContainer, toast } from "react-toastify";
import BlogPreview from '../components/BlogPreview';
import { Link } from 'react-router-dom';

interface Blog {
  id: string;
  title: string;
  content: string;
  date: Date;
  imageUrl: string | null;
}

interface BlogProps {
  user: any;
}

const Blog: React.FC<BlogProps> = ({ user }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const getBlogs = async () => {
      const response = await fetchBlogs();
      setBlogs(response);
    };

    getBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (user) {
      await deleteBlog(id);
      const response = await fetchBlogs();
      setBlogs(response);
    } else {
      toast.error('You must be logged in to delete a blog post.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      {user && (
        <Link to="/markdown-editor" className="mb-4 p-2 bg-blue-500 text-white rounded-lg inline-block">Create New Blog Post</Link>
      )}
      <div className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <BlogPreview
            key={blog.id}
            id={blog.id}
            title={blog.title}
            summary={blog.content.substring(0, 100)} // Assuming the first 100 characters as summary
            date={blog.date}
            imageUrl={blog.imageUrl}
            user={user}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Blog;
