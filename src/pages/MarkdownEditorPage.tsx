import React, { useState } from 'react';
import { uploadImage } from '../services/imageService';
import { createBlog } from '../services/blogService';
import MarkdownEditor from '../components/MarkdownEditor';
import ImageUpload from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';

interface MarkdownEditorPageProps {
  user: any;
}

const MarkdownEditorPage: React.FC<MarkdownEditorPageProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleHeaderImageUpload = (url: string) => {
    setHeaderImageUrl(url);
  };

  const handleContentImageUpload = (url: string) => {
    setContent((prevContent) => `${prevContent}\n![](${url})`);
  };

  const handleSave = async () => {
    if (title && content) {
      const newBlog = {
        title,
        content,
        date: new Date(),
        imageUrl: headerImageUrl,
      };
      try {
        await createBlog(newBlog);
        alert('Blog post created successfully!');
        navigate('/blog');
      } catch (error) {
        console.error('Error creating blog post:', error);
        alert('Failed to create blog post. Please try again.');
      }
    } else {
      alert('Title and content are required.');
    }
  };

  return (
    <div className="bg-[#f8f5f1] min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-green-800">Create New Blog Post</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-2 mb-8 text-2xl font-bold bg-white border-2 border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
        />
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-green-800">Header Image</h2>
          <ImageUpload onUpload={handleHeaderImageUpload} />
          {headerImageUrl && (
            <img
              src={headerImageUrl}
              alt="Header"
              className="w-full h-64 object-cover rounded-lg mt-4"
            />
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-green-800">Content</h2>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-green-800">Insert Image into Article</h2>
          <ImageUpload onUpload={handleContentImageUpload} />
        </div>
        <button onClick={handleSave} className="px-6 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition">Save Blog Post</button>
      </div>
    </div>
  );
};

export default MarkdownEditorPage;