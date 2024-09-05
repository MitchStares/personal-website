import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Layout } from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './components/BlogDetail';
import MarkdownEditorPage from './pages/MarkdownEditorPage';
import MapPage from './pages/MapPage';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import { initGA, logPageView, getPathFromHash } from './analytics';
import Projects from './pages/Projects';

// Initialize Google Analytics
initGA(process.env.REACT_APP_GA_MEASUREMENT_ID || '');

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Layout>
        <AppContent user={user} />
      </Layout>
    </Router>
  );
};

const AppContent: React.FC<{ user: any }> = ({ user }) => {
  const location = useLocation();

  useEffect(() => {
    // Get the path from the hash and log the page view
    const path = getPathFromHash(location.hash);
    logPageView(path);
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog user={user} />} />
      <Route path="/blog/:id" element={<BlogDetail user={user} />} />
      <Route 
        path="/markdown-editor" 
        element={
          <ProtectedRoute user={user}>
            <MarkdownEditorPage user={user} />
          </ProtectedRoute>
        } 
      />
      <Route path="/map" element={<MapPage />} />
      <Route path="/projects" element={<Projects user={user} />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default App;