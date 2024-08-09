import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../services/blogService';

const Home: React.FC = () => {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    const getRecentBlogs = async () => {
      const blogs = await fetchBlogs();
      setRecentBlogs(blogs.slice(0, 3));
    };
    getRecentBlogs();
  }, []);

  return (
    <div className="bg-[#f8f5f1] min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <main>
          <section className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-6 text-green-800">Mitch Stares - Data Engineer</h1>
            <p className="text-xl mb-8 text-gray-600">Just a data engineer blogging and developing apps. Thanks for popping by!</p>
            {/* <div className="flex justify-center">
              <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l-full w-64 border-2 border-r-0 border-green-800 focus:outline-none focus:ring-2 focus:ring-green-800" />
              <button className="px-6 py-2 bg-green-800 text-white rounded-r-full hover:bg-green-700 transition">Get started</button>
            </div> */}
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-8 text-green-800">Recent blog posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  {blog.imageUrl && (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-green-800">{blog.title}</h3>
                    <p className="text-gray-500 mb-4">{new Date(blog.date).toLocaleDateString()}</p>
                    <p className="text-gray-600 mb-4">{blog.content.substring(0, 100)}...</p>
                    <Link to={`/blog/${blog.id}`} className="text-green-800 hover:underline">Read more</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;