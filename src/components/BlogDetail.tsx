// src/components/BlogDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogById } from '../services/blogService';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<{ title: string; content: string; date: Date } | null>(null);

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        const response = await fetchBlogById(id);
        setBlog(response);
      }
    };

    getBlog();
  }, [id]);

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-detail">
      <h1>{blog.title}</h1>
      <p>{new Date(blog.date).toLocaleDateString()}</p>
      <div>{blog.content}</div>
    </div>
  );
};

export default BlogDetail;
