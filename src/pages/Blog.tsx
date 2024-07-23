// src/pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { fetchBlogs, createBlog, deleteBlog } from '../services/blogService';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import BlogPreview from '../components/BlogPreview';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageUpload from '../components/ImageUpload';

interface Blog {
  id: string;
  title: string;
  content: string;
  date: Date;
  imageUrl?: string;
}

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
      const newBlog = { title, content, date: new Date(), imageUrl };
      await createBlog(newBlog);
      setTitle('');
      setContent('');
      setImageUrl('');
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      {user && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="p-2 border rounded-lg"
          />
          <MarkdownEditor value={content} onChange={setContent} />
          <ImageUpload onUpload={setImageUrl} />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">Submit</button>
        </form>
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
    </div>
  );
};

export default Blog;
