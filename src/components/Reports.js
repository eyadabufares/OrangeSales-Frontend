import React, { useState, useEffect, useCallback, useRef } from 'react'; 
import api from '../utils/api'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = ({ initialOrderId }) => { 
  const [orderId, setOrderId] = useState(initialOrderId || '');
  const [reportData, setReportData] = useState(null);
  const [isExporting, setIsExporting] = useState(false); // لحالة التحميل

  const fetchReportData = useCallback(async (id) => {
    const targetId = id || orderId;
    if (!targetId || targetId < 1) return;

    try {
      const res = await api.get(`/Report/sales-summary/${targetId}`); 
      setReportData(res.data);
    } catch (error) {
      console.error(error);
      alert("Report not found or Server Error");
    }
  }, [orderId]);

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      fetchReportData(initialOrderId);
    }
  }, [initialOrderId, fetchReportData]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (orderId < 1) {
      alert("Please enter a valid Order ID");
      return;
    }
    fetchReportData();
  };

  const downloadPDF = async () => {
    const input = document.getElementById('report-content');
    if (!input) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Orange_Sales_Report_#${orderId}.pdf`);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-5 mt-4">
      <div className="card p-3 p-md-4 shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div style={{ borderLeft: '5px solid #ff6600', paddingLeft: '15px' }}>
            <h2 className="fw-bold mb-0 fs-3 fs-md-2" style={{ color: '#000000' }}>
              Sales Summary <span style={{ color: '#ff6600' }}>Report</span>
            </h2>
          </div>
          
          {reportData && (
            <button 
              onClick={downloadPDF}
              disabled={isExporting}
              className="btn btn-danger d-flex align-items-center fw-bold shadow-sm"
              style={{ borderRadius: '10px', height: '48px', padding: '0 20px' }}
            >
              <i className={`fa ${isExporting ? 'fa-spinner fa-spin' : 'fa-file-pdf-o'} me-2`}></i>
              {isExporting ? 'Generating...' : 'Download PDF'}
            </button>
          )}
        </div>

        <form onSubmit={handleManualSubmit} className="row g-3 align-items-end">
          <div className="col-12 col-md-8 col-lg-9">
            <label className="form-label fw-bold small text-muted">Order Reference ID</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 31" 
              value={orderId}
              min="1"
              onChange={(e) => setOrderId(e.target.value)}
              required 
              style={{ height: '48px', borderRadius: '10px', border: '1px solid #ddd' }}
            />
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <button 
              type="submit"
              className="btn w-100 fw-bold shadow-sm"
              style={{ 
                height: '48px',
                backgroundColor: '#1a1a1a', 
                color: '#ff6600', 
                border: '2px solid #ff6600', 
                borderRadius: '10px',
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
              Generate Report
            </button>
          </div>
        </form>
      </div>

      <div id="report-content">
        {reportData && reportData.orders && reportData.orders.map((order) => (
          <div key={order.id} className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="card-header bg-dark text-white py-3 px-4 d-flex justify-content-between">
              <span className="fw-bold">Order ID: #{order.id}</span>
              <span className="small">Orange Sales System</span>
            </div>
            
            <div className="d-none d-md-block">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3 small text-uppercase fw-bold" style={{ color: '#ff6600' }}>Product</th>
                      <th className="py-3 small text-uppercase text-center fw-bold" style={{ color: '#ff6600' }}>Price</th>
                      <th className="py-3 small text-uppercase text-center fw-bold" style={{ color: '#ff6600' }}>Qty</th>
                      <th className="pe-4 py-3 small text-uppercase text-end fw-bold" style={{ color: '#ff6600' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="ps-4 fw-bold">{item.product}</td>
                        <td className="text-center fw-bold">${item.price}</td>
                        <td className="text-center">
                          <span className="badge rounded-pill bg-light text-dark border">x{item.qty}</span>
                        </td>
                        <td className="pe-4 text-end fw-bold" style={{ fontSize: '1.1rem' }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="d-md-none p-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 mb-2 rounded-3 border-bottom" style={{ backgroundColor: '#fcfcfc' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">{item.product}</span>
                    <span className="fw-bold" style={{ color: '#ff6600' }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Price: ${item.price}</span>
                    <span>Quantity: {item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;