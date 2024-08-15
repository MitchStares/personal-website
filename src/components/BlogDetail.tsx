import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchBlogById, updateBlog } from "../services/blogService";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "./MarkdownEditor";
import ImageUpload from "./ImageUpload";
import { logPageView, getPathFromHash } from '../analytics';

interface BlogDetailProps {
  user: any;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [blog, setBlog] = useState<{
    title: string;
    content: string;
    date: Date;
    imageUrl: string | null;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        const response = await fetchBlogById(id);
        setBlog(response);
        setTitle(response?.title || "");
        setContent(response?.content || "");
        setHeaderImageUrl(response?.imageUrl || null);
        const path = getPathFromHash(location.hash);
        logPageView(path);
      }
    };

    getBlog();
  }, [id]);

  const handleSave = async () => {
    if (id && blog) {
      const updatedBlog = { ...blog, title, content, imageUrl: headerImageUrl };
      await updateBlog(id, updatedBlog);
      setBlog(updatedBlog);
      setIsEditing(false);
    }
  };

  if (!blog) {
    return <div className="bg-[#f8f5f1] min-h-screen flex items-center justify-center">
      <div className="text-2xl text-green-800">Loading...</div>
    </div>;
  }

  return (
    <div className="bg-[#f8f5f1] min-h-screen pb-16">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              className="w-full p-2 mb-4 text-2xl font-bold bg-white border-2 border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            />
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-green-800">Header Image</h2>
              <ImageUpload onUpload={setHeaderImageUrl} />
              {headerImageUrl && (
                <img
                  src={headerImageUrl}
                  alt="Header"
                  className="w-full h-64 object-cover rounded-lg mt-4"
                />
              )}
            </div>
            <MarkdownEditor value={content} onChange={setContent} />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-green-800 text-green-800 rounded-full hover:bg-green-800 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {headerImageUrl && (
              <img
                src={headerImageUrl}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
            )}
            <h1 className="text-4xl font-bold mb-4 text-green-800">{blog.title}</h1>
            <p className="text-gray-600 mb-8">
              {new Date(blog.date).toLocaleDateString()}
            </p>
            <ReactMarkdown className="prose max-w-none">{blog.content}</ReactMarkdown>
            {user && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-8 px-4 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;