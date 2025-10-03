import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllPosts from './pages/AllPosts';
import MyPosts from './pages/MyPosts';
import SavedPosts from './pages/SavedPosts';
import AddPost from './pages/AddPost';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PostDetail from './pages/PostDetail';
import GetStarted from './pages/GetStarted';
import EditPost from './pages/EditPost';

const App = () => {
  const layoutStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
  };

  const contentStyles = {
    flex: 1,
    padding: '16px',
    paddingBottom: '56px', // prevent overlap with fixed footer
  };

  return (
    <BrowserRouter>
      <div style={layoutStyles}>
        <Navbar />
        <main style={contentStyles}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/posts" element={<AllPosts />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id/edit" element={<EditPost />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/myposts" element={<MyPosts />} />
            <Route path="/saved" element={<SavedPosts />} />
            <Route path="/add" element={<AddPost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
