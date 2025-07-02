import { useState, useEffect } from 'react';
import axios from 'axios';

const SuppliersList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [suppliersResponse, materialsResponse] = await Promise.all([
        axios.get('/suppliers'),
        axios.get('/materials')
      ]);
      
      const parsedSuppliers = suppliersResponse.data.map(supplier => ({
      ...supplier,
      contact: typeof supplier.contact === 'string' ? JSON.parse(supplier.contact) : supplier.contact,
      specialties: typeof supplier.specialties === 'string' ? JSON.parse(supplier.specialties) : supplier.specialties,
    }));

      setSuppliers(parsedSuppliers);
      setMaterials(materialsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaterialsForSupplier = (supplierId) => {
    return materials.filter(material => material.supplier.id === supplierId);
  };

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
        <h1 className="h3 text-gray-800">Fournisseurs</h1>
      </div>

      <div className="row">
        {suppliers.map((supplier) => {
          const supplierMaterials = getMaterialsForSupplier(supplier.id);
          
          return (
            <div key={supplier._id} className="col-xl-4 col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="m-0">{supplier.name}</h5>
                </div>
                <div className="card-body">
                  {supplier.contact && (
                    <div className="mb-3">
                      <h6 className="fw-bold">Contact</h6>
                      {supplier.contact.email && (
                        <p className="small mb-1">
                          <i className="bi bi-envelope me-2"></i>
                          {supplier.contact.email}
                        </p>
                      )}
                      {supplier.contact.phone && (
                        <p className="small mb-1">
                          <i className="bi bi-telephone me-2"></i>
                          {supplier.contact.phone}
                        </p>
                      )}
                      {supplier.contact.address && (
                        <p className="small mb-1">
                          <i className="bi bi-geo-alt me-2"></i>
                          {supplier.contact.address}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="mb-3">
                    <h6 className="fw-bold">Matériaux fournis ({supplierMaterials.length})</h6>
                    {supplierMaterials.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {supplierMaterials.slice(0, 3).map((material) => (
                          <div key={material._id} className="list-group-item px-0 py-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                  {material.name}
                                <br />
                                <small className="text-muted">{material.category}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                        {supplierMaterials.length > 3 && (
                          <div className="list-group-item px-0 py-2 text-center">
                            <small className="text-muted">
                              +{supplierMaterials.length - 3} autre(s) matériau(x)
                            </small>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted small">Aucun matériau enregistré</p>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="fw-bold">{supplierMaterials.length}</div>
                      <small className="text-muted">Matériaux</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-building fs-1 text-muted"></i>
          <h5 className="mt-3 text-muted">Aucun fournisseur trouvé</h5>
          <p className="text-muted">Les fournisseurs seront affichés ici une fois ajoutés.</p>
        </div>
      )}
    </div>
  );
};

export default SuppliersList;