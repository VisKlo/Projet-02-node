import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MaterialModal from '../components/MaterialModal';

const FurnitureDetail = () => {
    const { id } = useParams();
    const [furniture, setFurniture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const openMaterialPopup = (material) => {
        setSelectedMaterial(material);
    };

    const closeMaterialPopup = () => {
        setSelectedMaterial(null);
    };


    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const response = await axios.get(`/furniture/${id}`);
                setFurniture(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement du meuble:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFurniture();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-5">Chargement...</div>;
    }

    if (!furniture) {
        return <div className="text-center mt-5">Meuble introuvable.</div>;
    }

    return (
        <div className="main-content">
            <div className="mb-4">
                <Link to="/furniture" className="btn btn-secondary btn-sm">
                    ← Retour à la liste
                </Link>
            </div>

            <h1 className="h3 mb-3">{furniture.name}</h1>
            <p><strong>Catégorie :</strong> {furniture.category}</p>
            <p><strong>Description :</strong> {furniture.description || 'Aucune description'}</p>
            <p><strong>Quantité :</strong> {furniture.quantity || 1}</p>

            <h5 className="mt-4">Matériaux utilisés</h5>
            {furniture.materials && furniture.materials.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                    {furniture.materials.map((mat) => (
                        <button
                            key={mat.id}
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openMaterialPopup(mat)}
                        >
                            {mat.name} ({mat.FurnitureMaterial?.quantity || 1})
                        </button>
                    ))}
                </div>
            ) : (
                <p>Aucun matériau associé.</p>
            )}

            {selectedMaterial && (
                <MaterialModal material={selectedMaterial} onClose={closeMaterialPopup} />
            )}


        </div>

    );
};

export default FurnitureDetail;
