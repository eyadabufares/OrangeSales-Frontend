import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 

const PlaceOrder = ({ userId }) => {
  const [products, setProducts] = useState([]); 
  const [items, setItems] = useState([{ productId: '', qty: 1 }]);
  const [response, setResponse] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/Product'); 
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const addItem = () => setItems([...items, { productId: '', qty: 1 }]);

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'qty' ? (parseInt(value) || 0) : value;
    setItems(newItems);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please login again.");
    
    if (items.some(item => !item.productId)) {
        return alert("Please select a product for all items.");
    }

    try {
      const orderRequest = { 
        userId: parseInt(userId), 
        items: items.map(item => ({
            productId: parseInt(item.productId),
            qty: item.qty
        }))
      };
      const res = await api.post('/Order/place', orderRequest);
      setResponse(res.data);
    } catch (error) {
      alert("Error placing order.");
    }
  };

  return (
    <div className="container-fluid px-2 px-md-4">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card p-3 p-md-4 shadow-sm border-0 bg-white" style={{ borderRadius: '15px' }}>
            <div className="d-flex align-items-center mb-4" style={{ borderLeft: '5px solid #ff6600', paddingLeft: '15px' }}>
              <h2 className="fw-bold mb-0 fs-3 fs-md-2" style={{ color: '#000000' }}>
                New Customer <span style={{ color: '#ff6600' }}>Order</span>
              </h2>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {items.map((item, index) => (
                <div key={index} className="row g-2 g-md-3 mb-3 align-items-end p-2 p-md-3 rounded-3 mx-0" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="col-6 col-md-5">
                    <label className="form-label small fw-bold text-dark">Product Name</label>
                    <select
                      className="form-select border-0 shadow-sm"
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">{loadingProducts ? "Loading..." : "-- Select Product --"}</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label small fw-bold text-dark">Quantity</label>
                    <input
                      type="number"
                      className="form-control border-0 shadow-sm"
                      value={item.qty}
                      min="1"
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12 col-md-4 d-flex gap-2 mt-3 mt-md-0">
                    <button type="button" className="btn btn-outline-secondary btn-sm flex-grow-1 py-2" onClick={() => removeItem(index)}>
                      Remove
                    </button>
                    {index === items.length - 1 && (
                      <button type="button" className="btn btn-dark btn-sm flex-grow-1 py-2" onClick={addItem}>
                        + Add Item
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-center mt-4">
                <button
                  className="btn shadow-sm w-100 w-md-auto px-md-5 py-2"
                  type="submit"
                  style={{
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: '#ff6600',
                    border: '2px solid #ff6600',
                    fontWeight: 'bold',
                    transition: '0.3s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#ff6600';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a1a1a';
                    e.currentTarget.style.color = '#ff6600';
                  }}
                >
                  Checkout
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card p-3 p-md-4 shadow-sm border-0 text-white" style={{ backgroundColor: '#1a1a1a', borderRadius: '15px', minHeight: '100%' }}>
            <h4 className="mb-4 fw-bold text-center text-lg-start" style={{ color: '#ff6600' }}>Order Summary</h4>
            {response ? (
              <div className="mt-2">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#f0f0f0' }} className="small">Reference:</span>
                  <span className="fw-bold">#{response.orderId}</span>
                </div>
                <hr style={{ borderColor: '#444' }} />
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#f0f0f0' }}>Subtotal</span>
                  <span className="fw-bold">{response.subtotal?.toFixed(2)} JOD</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: '#f0f0f0' }}>Tax (16%)</span>
                  <span className="fw-bold">{response.tax?.toFixed(2)} JOD</span>
                </div>
                <div className="p-3 rounded-3" style={{ backgroundColor: '#222', border: '1px solid #333' }}>
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                    <span className="h6 mb-0 fw-bold">Total Amount</span>
                    <span className="h4 mb-0 fw-bold" style={{ color: '#ff6600' }}>{response.total?.toFixed(2)} JOD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <p style={{ color: '#aaa' }} className="small">Select products to generate receipt</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;