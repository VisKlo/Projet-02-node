import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('/materials');
      setMaterials(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matériaux:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordClick = (keyword) => {
    navigate(`/materials/search/${keyword}`);
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || material.category?.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
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
        <h1 className="h3 text-gray-800">Matériaux</h1>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Recherche</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                <option value="Bois">Bois</option>
                <option value="Fer">Fer</option>
                <option value="Plastique">Plastique</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="col-xl-4 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="m-0">{material.name}</h6>
                <span className="badge bg-primary">{material.category}</span>
              </div>
              <div className="card-body">
                <p className="text-muted mb-2">
                  <i className="bi bi-building me-1"></i>
                  {material.supplier?.name}
                </p>
                
                <p className="card-text small">{material.description}</p>
                </div>

                {material.keywords && material.keywords.length > 0 && (
                  <div className="mt-3">
                    {material.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="keyword-tag me-1"
                        onClick={() => handleKeywordClick(keyword)}
                        style={{ cursor: 'pointer' }}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (  
        <div className="text-center py-5">
          <i className="bi bi-layers fs-1 text-muted"></i>
          <h5 className="mt-3 text-muted">Aucun matériau trouvé</h5>
          <p className="text-muted">
            {searchTerm || categoryFilter
              ? 'Aucun matériau ne correspond à vos critères de recherche.'
              : 'Aucun matériau disponible.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MaterialsList;