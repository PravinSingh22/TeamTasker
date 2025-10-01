import React from 'react';
import ReactDOM from 'react-dom';

export default function ConfirmationModal({ open, onClose, onConfirm, title, children }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel modal-content-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0, color: 'var(--fg)' }}>{title || 'Confirm Action'}</h3>
        <div style={{ color: 'var(--muted)', marginBottom: 20 }}>
          {children}
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}