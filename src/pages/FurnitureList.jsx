import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MaterialModal from '../components/MaterialModal';

const FurnitureList = () => {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    fetchFurniture();
  }, []);

  const fetchFurniture = async () => {
    try {
      const response = await axios.get('/furniture');
      setFurniture(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des meubles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce meuble ?')) {
      try {
        await axios.delete(`/furniture/${id}`);
        setFurniture(furniture.filter(item => item.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du meuble');
      }
    }
  };

  const openMaterialPopup = (material) => {
    setSelectedMaterial(material);
  };

  const closeMaterialPopup = () => {
    setSelectedMaterial(null);
  };

  const filteredFurniture = furniture.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 text-gray-800">Meubles</h1>
        <Link to="/furniture/new" className="btn btn-primary">
          <i className="bi bi-plus me-2"></i>
          Nouveau Meuble
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Recherche</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                <option value="Armoire">Armoire</option>
                <option value="Etagère">Étagère</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {filteredFurniture.map((item) => (
          <div key={item.id} className="col-xl-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="m-0">
                  <Link to={`/furniture/${item.id}`} className="text-decoration-none">
                    {item.name}
                  </Link>
                </h6>
              </div>
              <div className="card-body">
                <p className="text-muted mb-2">{item.category}</p>
                <p className="card-text small">{item.description}</p>

                <div className="mb-3">
                  {item.materials && item.materials.length > 0 ? (
                    item.materials.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1 mb-1"
                        onClick={() => openMaterialPopup(mat)}
                      >
                        {mat.name}
                      </button>
                    ))
                  ) : (
                    <span>Aucun matériau</span>
                  )}
                </div>

                {item.keywords && item.keywords.length > 0 && (
                  <div className="mb-3">
                    {item.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag me-1">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}

                {item.clientName && (
                  <p className="small text-muted">
                    <i className="bi bi-person me-1"></i>
                    Client: {item.clientName}
                  </p>
                )}
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-between">
                  <div>
                    <Link
                      to={`/furniture/edit/${item.id}`}
                      className="btn btn-outline-secondary btn-sm me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFurniture.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-archive fs-1 text-muted"></i>
          <h5 className="mt-3 text-muted">Aucun meuble trouvé</h5>
          <p className="text-muted">
            {searchTerm || categoryFilter || statusFilter
              ? 'Aucun meuble ne correspond à vos critères de recherche.'
              : 'Commencez par créer votre premier meuble.'
            }
          </p>
        </div>
      )}

      {selectedMaterial && (
        <MaterialModal material={selectedMaterial} onClose={closeMaterialPopup} />
      )}

    </div>
  );
};

export default FurnitureList;
