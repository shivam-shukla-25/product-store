import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canModify = user && (product.createdBy?._id === user.id || user.role === 'admin');

  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="product-image" onError={e => e.target.style.display = 'none'} />
      ) : (
        <div className="product-image-placeholder"></div>
      )}
      <div className="product-body">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}</p>
        )}
        <div className="product-meta">
          <span className="product-price">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          <span className={`product-stock ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : ''}`}>
            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
          </span>
        </div>
        {product.sku && <div className="product-sku">SKU: {product.sku}</div>}
      </div>
      {canModify && (
        <div className="product-actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(product)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(product)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

