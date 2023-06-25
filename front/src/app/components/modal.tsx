import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const Modal = ({ isOpen, onClose, patient }) => {
  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <div className="box">
                <header className="modal-card-head">
                    <p className="modal-card-title">{patient.name}</p>
                </header>
                <section className="modal-card-body">

                </section>
            <footer className="modal-card-foot">
                <button className="button" onClick={onClose}>Cancel</button>
            </footer>
        </div>
      </div>
      <button
        className="modal-close is-medium"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Modal;





