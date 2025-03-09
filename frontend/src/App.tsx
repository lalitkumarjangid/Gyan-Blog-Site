import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Blog } from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { Publish } from "./pages/Publish";
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from "./hooks/ProtectedRoutes";
import "./App.css"
import { Home } from "./components/Home";
import { AdminPanel } from "./pages/AdminPanel";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<AdminPanel />} />
          
          {/* Protected Routes */}
          <Route path="/blog/:id" element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          } />
          <Route path="/blogs" element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          } />
          <Route path="/publish" element={
            <ProtectedRoute>
              <Publish />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;