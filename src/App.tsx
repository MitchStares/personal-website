// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './components/BlogDetail';
import BlogEditor from './pages/BlogEditor';
import BudgetTracker from './pages/BudgetTracker';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog user={user} />} />
          <Route path="/blog/:id" element={<BlogDetail user={user} />} />
          <Route path="/blog-editor" element={<ProtectedRoute user={user}><BlogEditor user={user} /></ProtectedRoute>} />
          <Route path="/budget-tracker" element={<BudgetTracker />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </DndProvider>
  );
};

export default App;
