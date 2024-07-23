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
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      {imageUrl && <img src={imageUrl} alt={title} className="w-24 h-24 object-cover rounded-lg" />}
      <div className="flex-1">
        <h2 className="text-xl font-bold"><Link to={`/blog/${id}`}>{title}</Link></h2>
        <p className="text-gray-600">{summary}</p>
        <p className="text-gray-400">{new Date(date).toLocaleDateString()}</p>
        {user && <button onClick={() => onDelete(id)} className="mt-2 text-red-500">Delete</button>}
      </div>
    </div>
  );
};

export default BlogPreview;
