import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../services/blogService";
import { getImageUrl } from "../services/imageService";

const Home: React.FC = () => {
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [mapImageUrl, setMapImageUrl] = useState<string>("");

  useEffect(() => {
    const getRecentBlogs = async () => {
      const blogs = await fetchBlogs();
      setRecentBlogs(blogs.slice(0, 3));
    };
    getRecentBlogs();
  const fetchMapImage = async () => {
    try {
      const url = await getImageUrl('gs://personal-website-b97cc.appspot.com/images/mapapp.png'); // Replace with actual path
      setMapImageUrl(url);
    } catch (error) {
      console.error("Error fetching map image:", error);
      // You might want to set a default image URL here in case of an error
    }
  };
  fetchMapImage();
}, []);

  return (
    <div className="bg-[#f8f5f1] min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <main>
          <section className="text-center mb-12 sm:mb-20">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-green-800">
              Mitch Stares - Data Engineer
            </h1>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-600">
              Just a data engineer blogging and developing apps. Thanks for
              popping by!
            </p>
          </section>

          {/* New Map Feature Section */}
          <section className="mb-16 bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={mapImageUrl} // Replace with your actual map image
                  alt="Map Application Preview"
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">
                  Explore My Current Project
                </h2>
                <p className="text-gray-600 mb-6">
                  Dive into my latest project. This interactive map application aims to provide an easy, responsive platform to conduct spatial insights.
                </p>
                <Link
                  to="/map"
                  className="inline-block bg-green-800 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition duration-300 text-center"
                >
                  Launch Spatial Insights
                </Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-green-800">
              Recent blog posts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentBlogs.map((blog) => (
                <Link
                  to={`/blog/${blog.id}`}
                  key={blog.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="h-full flex flex-col">
                    {blog.imageUrl && (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-green-800">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {new Date(blog.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 mb-4">
                          {blog.content.substring(0, 100)}...
                        </p>
                      </div>
                      <span className="text-green-800 hover:underline mt-auto">
                        Read more
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;