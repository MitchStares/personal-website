import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBlogById, updateBlog } from "../services/blogService";
import ReactMarkdown from "react-markdown";
import MarkdownEditor from "./MarkdownEditor";
import ImageUpload from "./ImageUpload";

interface BlogDetailProps {
  user: any;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<{
    title: string;
    content: string;
    date: Date;
    imageUrl: string | null;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);

  const handleHeaderImageUpload = (url: string) => {
    setHeaderImageUrl(url);
  };

  useEffect(() => {
    const getBlog = async () => {
      if (id) {
        const response = await fetchBlogById(id);
        setBlog(response);
        setTitle(response?.title || "");
        setContent(response?.content || "");
        setImageUrl(response?.imageUrl || "");
        setHeaderImageUrl(response?.imageUrl || null); // Set header image URL
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
    <div className="max-w-4xl mx-auto p-4">
      {isEditing ? (
        <div>
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
          </div>
          <MarkdownEditor value={content} onChange={setContent} />
          <ImageUpload onUpload={setImageUrl} />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-gray-500 mb-4">
            {new Date(blog.date).toLocaleDateString()}
          </p>
          <ReactMarkdown className="prose">{blog.content}</ReactMarkdown>
          {user && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 p-2 bg-blue-500 text-white rounded-lg"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
