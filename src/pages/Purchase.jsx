import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Purchase = () => {
  const { supplierId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantitiesToBuy, setQuantitiesToBuy] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/suppliers/${supplierId}/materials`);
        setSupplier(res.data.supplier);
        setMaterials(res.data.materials);
      } catch (err) {
        console.error(err);
        alert('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supplierId]);

  const handleQuantityChange = (materialId, value) => {
    setQuantitiesToBuy((prev) => ({
      ...prev,
      [materialId]: value ? parseInt(value, 10) : 0,
    }));
  };

  const handlePurchase = async (materialId) => {
    const quantity = quantitiesToBuy[materialId];
    if (!quantity || quantity <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }

    try {
      const res = await axios.post(`/materials/${materialId}/addQuantity`, {
        quantityToAdd: quantity,
      });

      setMaterials((prev) =>
        prev.map((mat) =>
          mat.id === materialId ? { ...mat, quantity: res.data.material.quantity } : mat
        )
      );

      alert(`Achat effectué pour ${quantity} unité(s).`);

      setQuantitiesToBuy((prev) => ({ ...prev, [materialId]: 0 }));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'achat');
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!supplier) return <p>Fournisseur non trouvé.</p>;

  return (
    <div>
      <h1>Achat - {supplier.name}</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Matériau</th>
            <th>Prix unitaire</th>
            <th>Quantité en stock</th>
            <th>Quantité à acheter</th>
            <th>Prix total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((mat) => {
            const qtyToBuy = quantitiesToBuy[mat.id] || 0;
            return (
              <tr key={mat.id}>
                <td>{mat.name}</td>
                <td>{mat.price ? mat.price.toFixed(2) : '-' } €</td>
                <td>{mat.quantity || 0}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={qtyToBuy}
                    onChange={(e) => handleQuantityChange(mat.id, e.target.value)}
                    style={{ width: '80px' }}
                  />
                </td>
                <td>{(mat.price * qtyToBuy).toFixed(2)} €</td>
                <td>
                  <button onClick={() => handlePurchase(mat.id)} disabled={qtyToBuy <= 0}>
                    Acheter
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Purchase;
