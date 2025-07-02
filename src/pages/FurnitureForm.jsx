import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const FurnitureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Armoire',
    description: '',
    quantity: 1,
    materials: []
  });

  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    fetchMaterials();
    if (isEdit) {
      fetchFurniture();
    }
  }, [id]);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('/materials');
      setAvailableMaterials(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matériaux:', error);
    }
  };

  const fetchFurniture = async () => {
    try {
      const response = await axios.get(`/furniture/${id}`);
      const furniture = response.data;

      setFormData({
        name: furniture.name,
        category: furniture.category,
        description: furniture.description || '',
        quantity: furniture.quantity || 1,
        materials: furniture.materials.map(mat => ({
          materialId: mat.id,
          quantity: mat.FurnitureMaterial?.quantity || 1
        }))
      });
    } catch (error) {
      console.error('Erreur lors du chargement du meuble:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...formData.materials];
    newMaterials[index][field] = field === 'quantity' ? Number(value) : value;
    setFormData(prev => ({
      ...prev,
      materials: newMaterials
    }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { materialId: '', quantity: 1 }]
    }));
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        materials: formData.materials.map(m => ({
          material: m.materialId,
          quantity: m.quantity
        }))
      };

      if (isEdit) {
        await axios.put(`/furniture/${id}`, submitData);
      } else {
        await axios.post('/furniture', submitData);
      }

      navigate('/furniture');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du meuble');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/furniture">Meubles</Link>
              </li>
              <li className="breadcrumb-item active">
                {isEdit ? 'Modifier' : 'Nouveau meuble'}
              </li>
            </ol>
          </nav>
          <h1 className="h3 text-gray-800">
            {isEdit ? 'Modifier le meuble' : 'Créer un nouveau meuble'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom du meuble *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie *</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Armoire">Armoire</option>
            <option value="Etagère">Étagère</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantité de meubles *</label>
          <input
            type="number"
            min="1"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        

        <div className="mb-3">
          <label className="form-label">Matériaux</label>
          {formData.materials.map((mat, index) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <select
                className="form-select"
                value={mat.materialId}
                onChange={(e) => handleMaterialChange(index, 'materialId', e.target.value)}
                required
              >
                <option value="">Sélectionner un matériau</option>
                {availableMaterials.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="form-control"
                placeholder="Quantité"
                value={mat.quantity}
                onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                style={{ maxWidth: '100px' }}
                required
              />

              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeMaterial(index)}
              >
                Supprimer
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-primary btn-sm mt-2"
            onClick={addMaterial}
          >
            Ajouter un matériau
          </button>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Sauvegarde...' : (isEdit ? 'Mettre à jour' : 'Créer le meuble')}
        </button>
      </form>
    </div>
  );
};

export default FurnitureForm;
