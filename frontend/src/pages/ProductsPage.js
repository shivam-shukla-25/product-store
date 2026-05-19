import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import { productsApi } from '../api';

const ProductsPage = () => {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const canModify = user && (user.role === 'admin');

  const debouncedSearch = useDebounce(search, 400);


  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const params = {
    page,
    limit: 3,
    ...(debouncedSearch && { search: debouncedSearch })
  };

  const { products, pagination, loading, error, refetch } = useProducts(params);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormSuccess = (msg) => {
    setShowForm(false);
    setEditingProduct(null);
    refetch();
    showToast(msg);
  };

  const handleDelete = async () => {
    try {
      await productsApi.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      refetch();
      showToast('Product deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-brand">Product Store</div>
        <div className="navbar-right">
          <span className="navbar-user">{user?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <div className="controls-bar">
          <div className="search-box">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="clear-btn" onClick={() => setSearch('')}>✕</button>}
          </div>

          {canModify && <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
            + Add Product
          </button>}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {pagination && (
          <div className="results-info">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''} found
            {debouncedSearch && ` for "${debouncedSearch}"`}
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[...Array(9)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"></div>
            <h3>No products found</h3>
            <p>{debouncedSearch ? 'Try a different search term' : 'Add your first product to get started'}</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                onEdit={prod => { setEditingProduct(prod); setShowForm(true); }}
                onDelete={setDeleteConfirm}
              />
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="pagination">
            <button className="btn btn-secondary" disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}>
              ← Prev
            </button>
            <span className="page-info">Page {pagination.page} of {pagination.pages}</span>
            <button className="btn btn-secondary" disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </main>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingProduct(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal modal-sm">
            <h2>Delete Product?</h2>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
};

export default ProductsPage;

