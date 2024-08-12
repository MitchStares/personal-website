import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../services/blogService';
import { ToastContainer, toast } from "react-toastify";

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
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

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

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-[#f8f5f1] min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-green-800 text-center">All blog posts</h1>
        
        {user && (
          <div className="mb-8 text-center">
            <Link to="/markdown-editor" className="px-6 py-3 bg-green-800 text-white rounded-full hover:bg-green-700 transition">
              Create New Blog Post
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentBlogs.map((blog) => (
            <Link
              to={`/blog/${blog.id}`}
              key={blog.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <div className="h-full flex flex-col">
                {blog.imageUrl && (
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-2 text-green-800">{blog.title}</h2>
                    <p className="text-gray-500 mb-4">{new Date(blog.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 mb-4">{blog.content.substring(0, 100)}...</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-green-800 hover:underline">Read more</span>
                    {user && (
                      <button onClick={(e) => {
                        e.preventDefault();
                        handleDelete(blog.id);
                      }} className="text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {Array.from({ length: Math.ceil(blogs.length / blogsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? 'bg-green-800 text-white' : 'bg-white text-green-800 hover:bg-green-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Blog;