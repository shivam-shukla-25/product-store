import React, { useState, useEffect } from 'react';
import { productsApi } from '../api';

const defaultForm = {
  name: '', description: '', price: '', category: '', stock: '0', sku: '', imageUrl: '',
};

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [form, setForm] = useState(product ? {
    name: product.name,
    description: product.description || '',
    price: product.price,
    category: product.category,
    stock: product.stock,
    sku: product.sku || '',
    imageUrl: product.imageUrl || '',
  } : defaultForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    productsApi.getCategories()
      .then(res => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      };
      if (!payload.sku) delete payload.sku;
      if (!payload.imageUrl) delete payload.imageUrl;

      if (product) {
        await productsApi.update(product._id, payload);
      } else {
        await productsApi.create(payload);
      }
      onSuccess(product ? 'Product updated!' : 'Product created!');
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors) {
        setErrors(errData.errors.map(e => e.msg));
      } else {
        setErrors([errData?.message || 'Something went wrong']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="btn-icon" onClick={onCancel}>✕</button>
        </div>

        {errors.length > 0 && (
          <div className="alert alert-error">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Wireless Headphones" />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="e.g. electronics"
                list="categories-list"
              />
              <datalist id="categories-list">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. PROD-001" />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

