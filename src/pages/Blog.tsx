import React, { useState, useEffect } from 'react';
import { fetchBlogs, deleteBlog } from '../services/blogService';
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
    <div className="bg-[#f8f5f1] min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-green-800">Blog</h1>
        {user && (
          <Link to="/markdown-editor" className="mb-8 inline-block px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition">Create New Blog Post</Link>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogPreview
              key={blog.id}
              id={blog.id}
              title={blog.title}
              summary={blog.content.substring(0, 100)}
              date={blog.date}
              imageUrl={blog.imageUrl}
              user={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Blog;