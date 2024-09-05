import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRoadmapItems, addRoadmapItem, updateRoadmapItem, deleteRoadmapItem } from '../services/roadmapService';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
}

interface ProjectsProps {
  user: any; // Replace 'any' with your user type if available
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [newItem, setNewItem] = useState<Omit<RoadmapItem, 'id'>>({ title: '', description: '', status: 'planned' });
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const items = await fetchRoadmapItems();
    setRoadmapItems(items);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRoadmapItem(newItem);
    setNewItem({ title: '', description: '', status: 'planned' });
    fetchItems();
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateRoadmapItem(editingItem.id, editingItem);
      setEditingItem(null);
      fetchItems();
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteRoadmapItem(id);
    fetchItems();
  };

  return (
    <div className="bg-[#f8f5f1] min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-green-800">Projects</h1>
        
        {/* Spatial Insights Application section */}
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">Spatial Insights</h2>
          <p className="mb-4">
            The Spatial Insights application is a geospatial mapping tool built with React and Deck.gl. 
            It allows users to upload and visualize data, while providing quick on the fly insights about features. 
          </p>
          <p className="mb-4">
            Key features include layer management, attribute-based styling, and real-time insights about visible features.
          </p>
          <Link 
            to="/map" 
            className="inline-block bg-green-800 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition duration-300"
          >
            Launch Spatial Insights
          </Link>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">Development Roadmap</h2>
          {user && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Add New Roadmap Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  placeholder="Title"
                  className="w-full p-2 border rounded"
                  required
                />
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                  required
                />
                <select
                  value={newItem.status}
                  onChange={(e) => setNewItem({...newItem, status: e.target.value as RoadmapItem['status']})}
                  className="w-full p-2 border rounded"
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded">Add Item</button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['planned', 'in-progress', 'completed'].map((status) => (
              <div key={status} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-4 capitalize">{status.replace('-', ' ')}</h3>
                {roadmapItems
                  .filter(item => item.status === status)
                  .map(item => (
                    <div key={item.id} className="mb-4 p-3 bg-gray-100 rounded">
                      {editingItem && editingItem.id === item.id ? (
                        <form onSubmit={handleUpdateItem} className="space-y-2">
                          <input
                            type="text"
                            value={editingItem.title}
                            onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                            className="w-full p-1 border rounded"
                            required
                          />
                          <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                            className="w-full p-1 border rounded"
                            required
                          />
                          <select
                            value={editingItem.status}
                            onChange={(e) => setEditingItem({...editingItem, status: e.target.value as RoadmapItem['status']})}
                            className="w-full p-1 border rounded"
                          >
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button type="submit" className="bg-green-800 text-white px-4 py-2 rounded">Update Item</button>
                        </form>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-100 rounded">
                          <h4 className="font-bold">{item.title}</h4>
                          <p>{item.description}</p>
                          {user && (
                            <div className="mt-2">
                              <button onClick={() => setEditingItem(item)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                              <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
