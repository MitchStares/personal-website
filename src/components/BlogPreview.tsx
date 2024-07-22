// src/components/BlogPreview.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPreviewProps {
  id: string;
  title: string;
  summary: string;
  date: Date;
  imageUrl?: string;
  user: any;
  onDelete: (id: string) => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ id, title, summary, date, imageUrl, user, onDelete }) => {
  return (
    <div className="blog-preview">
      {imageUrl && <img src={imageUrl} alt={title} className="blog-preview-image" />}
      <h2><Link to={`/blog/${id}`}>{title}</Link></h2>
      <p>{summary}</p>
      <p>{new Date(date).toLocaleDateString()}</p>
      {user && <button onClick={() => onDelete(id)}>Delete</button>}
    </div>
  );
};

export default BlogPreview;
