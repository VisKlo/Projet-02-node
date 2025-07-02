const MaterialModal = ({ material, onClose }) => {
  if (!material) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{material.name}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Fermer"
            ></button>
          </div>
          <div className="modal-body">
            <p>{material.description || 'Pas de description disponible.'}</p>
            {material.supplier && (
              <p className="text-muted small">
                Fournisseur : {material.supplier.name}
              </p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
