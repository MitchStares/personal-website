// src/components/BlogDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogById, updateBlog } from '../services/blogService';
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from './MarkdownEditor';
import ImageUpload from './ImageUpload';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<{ title: string; content: string; date: Date; imageUrl?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        const response = await fetchBlogById(id);
        setBlog(response);
        setTitle(response?.title || '');
        setContent(response?.content || '');
        setImageUrl(response?.imageUrl || '');
      }
    };

    getBlog();
  }, [id]);

  const handleSave = async () => {
    if (id && blog) {
      const updatedBlog = { ...blog, title, content, imageUrl };
      await updateBlog(id, updatedBlog);
      setBlog(updatedBlog);
      setIsEditing(false);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-detail">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="blog-title-input"
          />
          <MarkdownEditor value={content} onChange={setContent} />
          <ImageUpload onUpload={setImageUrl} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="blog-detail-image" />}
          <h1>{blog.title}</h1>
          <p>{new Date(blog.date).toLocaleDateString()}</p>
          <ReactMarkdown>{blog.content}</ReactMarkdown>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
