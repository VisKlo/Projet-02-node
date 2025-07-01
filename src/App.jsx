import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FurnitureList from './pages/FurnitureList';
import FurnitureForm from './pages/FurnitureForm';
import FurnitureDetail from './pages/FurnitureDetail';
import MaterialsList from './pages/MaterialsList';
import SuppliersList from './pages/SuppliersList';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return children;
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="container-fluid p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/furniture" element={<FurnitureList />} />
                  <Route path="/furniture/new" element={<FurnitureForm />} />
                  <Route path="/furniture/edit/:id" element={<FurnitureForm />} />
                  <Route path="/furniture/:id" element={<FurnitureDetail />} />
                  <Route path="/materials" element={<MaterialsList />} />
                  <Route path="/suppliers" element={<SuppliersList />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;