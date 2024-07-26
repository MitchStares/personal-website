// src/pages/BlogEditor.tsx
import React, { useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../services/imageService'; // Import the uploadImage function
import { createBlog } from '../services/blogService'; // Import the createBlog function

interface BlogEditorProps {
  user: any;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ user }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const url = await uploadImage(file);
    setContent((prevContent) => `${prevContent}\n!Image`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
  });

  const handleSave = async () => {
    if (title && content) {
      const newBlog = {
        title,
        content,
        date: new Date(),
        imageUrl: imageUrl || undefined, // Convert null to undefined
      };
      try {
        await createBlog(newBlog);
        alert('Blog post created successfully!');
        setTitle('');
        setContent('');
        setImageUrl(null);
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
      <div {...getRootProps()} className={`editor-container border-2 border-dashed p-4 ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        <ReactQuill value={content} onChange={setContent} />
      </div>
      <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white rounded-lg">Save</button>
    </div>
  );
};

export default BlogEditor;
