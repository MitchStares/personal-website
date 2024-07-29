// src/pages/MarkdownEditorPage.tsx
import React, { useState } from 'react';
import { uploadImage } from '../services/imageService'; // Import the uploadImage function
import { createBlog } from '../services/blogService'; // Import the createBlog function
import MarkdownEditor from '../components/MarkdownEditor';
import ImageUpload from '../components/ImageUpload';

interface MarkdownEditorPageProps {
  user: any;
}

const MarkdownEditorPage: React.FC<MarkdownEditorPageProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

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
        imageUrl: headerImageUrl || null, // Convert null to undefined
      };
      try {
        await createBlog(newBlog);
        alert('Blog post created successfully!');
        setTitle('');
        setContent('');
        setHeaderImageUrl(null);
      } catch (error) {
        console.error('Error creating blog post:', error);
        alert('Failed to create blog post. Please try again.');
      }
    } else {
      alert('Title and content are required.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        className="p-2 border rounded-lg w-full mb-4"
      />
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Header Image</h2>
        <ImageUpload onUpload={handleHeaderImageUpload} />
        {headerImageUrl && (
              <>
                <img
                  src={headerImageUrl}
                  alt="Header"
                  className="w-full h-64 object-cover rounded-lg mt-4"
                />
                <p className="text-gray-500 mt-2">
                  <button
                    onClick={() => setHeaderImageUrl(null)} // Clear header image
                    className="text-blue-500 underline"
                  >
                    Remove current image
                  </button>
                </p>
              </>
            )}
        {/* {headerImageUrl && <img src={headerImageUrl} alt="Header" className="w-full h-64 object-cover rounded-lg mt-4" />} */}
      </div>
      <MarkdownEditor value={content} onChange={setContent} />
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Insert Image into Article</h2>
        <ImageUpload onUpload={handleContentImageUpload} />
      </div>
      <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">Save</button>
    </div>
  );
};

export default MarkdownEditorPage;
