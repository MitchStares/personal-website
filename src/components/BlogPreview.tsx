// src/components/BlogPreview.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface BlogPreviewProps {
  id: string;
  title: string;
  summary: string;
  date: Date;
  user: any; // Add user prop
  onDelete: (id: string) => void; // Add onDelete prop
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ id, title, summary, date, user, onDelete }) => {
  return (
    <div className="blog-preview">
      <h2><Link to={`/blog/${id}`}>{title}</Link></h2>
      <p>{summary}</p>
      <p>{new Date(date).toLocaleDateString()}</p>
      {user && <button onClick={() => onDelete(id)}>Delete</button>} {/* Add delete button */}
    </div>
  );
};

export default BlogPreview;
