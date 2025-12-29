import { useState, useEffect } from "react";
import "./VentasOnline.css";

const API_URL = 'http://localhost:5000/api';

export const VentasOnline = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${API_URL}/payment/orders`
        : `${API_URL}/payment/orders?status=${filter}`;
      
      const response = await fetch(url, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Error al cargar órdenes');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'initiated': { label: 'Iniciada', class: 'status-initiated' },
      'pending_payment': { label: 'Pendiente', class: 'status-pending' },
      'confirmed': { label: 'Confirmada', class: 'status-confirmed' },
      'cancelled': { label: 'Cancelada', class: 'status-cancelled' },
      'failed': { label: 'Fallida', class: 'status-failed' },
      'refunded': { label: 'Reembolsada', class: 'status-refunded' },
      'shipped': { label: 'Enviada', class: 'status-shipped' },
      'delivered': { label: 'Entregada', class: 'status-delivered' }
    };
    const statusInfo = statusMap[status] || { label: status, class: 'status-unknown' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPaymentMethodLabel = (method) => {
    return method === 'webpay' ? 'WebPay' : 'Transferencia';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return '$' + (price || 0).toLocaleString('es-CL');
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleConfirmTransfer = async (orderId) => {
    if (!window.confirm('¿Confirmar que se recibió la transferencia?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/confirm-transfer/${orderId}`, {
        method: 'POST',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirmation_notes: 'Confirmado desde panel admin' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Transferencia confirmada exitosamente');
        fetchOrders();
        setShowModal(false);
      } else {
        alert(data.error || 'Error al confirmar transferencia');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/payment/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Estado actualizado a: ${newStatus}`);
        fetchOrders();
        setShowModal(false);
      } else {
        alert(data.error || 'Error al actualizar estado');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  // Calculate summary stats
  const stats = {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    pending: orders.filter(o => o.status === 'pending_payment').length,
    totalRevenue: orders
      .filter(o => o.status === 'confirmed')
      .reduce((sum, o) => sum + (o.total || 0), 0)
  };

  if (loading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="ventas-container">
      {/* Summary Cards */}
      <div className="ventas-summary">
        <div className="summary-card total-orders">
          <div className="summary-icon">📦</div>
          <div className="summary-info">
            <div className="summary-value">{stats.total}</div>
            <div className="summary-label">Total Órdenes</div>
          </div>
        </div>
        <div className="summary-card confirmed-orders">
          <div className="summary-icon">✅</div>
          <div className="summary-info">
            <div className="summary-value">{stats.confirmed}</div>
            <div className="summary-label">Confirmadas</div>
          </div>
        </div>
        <div className="summary-card pending-orders">
          <div className="summary-icon">⏳</div>
          <div className="summary-info">
            <div className="summary-value">{stats.pending}</div>
            <div className="summary-label">Pendientes</div>
          </div>
        </div>
        <div className="summary-card revenue">
          <div className="summary-icon">💰</div>
          <div className="summary-info">
            <div className="summary-value">{formatPrice(stats.totalRevenue)}</div>
            <div className="summary-label">Ingresos</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="ventas-filters">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todas las órdenes</option>
          <option value="pending_payment">Pendientes de pago</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="failed">Fallidas</option>
          <option value="shipped">Enviadas</option>
          <option value="delivered">Entregadas</option>
        </select>
        <button className="refresh-btn" onClick={fetchOrders}>
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-orders">No hay órdenes para mostrar</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id || order.buy_order}>
                  <td className="order-id">{order.buy_order}</td>
                  <td>{order.customer?.nombre || '-'}</td>
                  <td>{order.customer?.email || '-'}</td>
                  <td className="order-total">{formatPrice(order.total)}</td>
                  <td>{getPaymentMethodLabel(order.payment_method)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewOrder(order)}
                    >
                      👁️ Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalle de Orden: {selectedOrder.buy_order}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-section">
                <h4>Estado</h4>
                <div className="order-status-large">
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              <div className="order-section">
                <h4>Cliente</h4>
                <p><strong>Nombre:</strong> {selectedOrder.customer?.nombre}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.customer?.telefono}</p>
              </div>

              <div className="order-section">
                <h4>Dirección de Envío</h4>
                <p><strong>Región:</strong> {selectedOrder.customer?.region}</p>
                <p><strong>Comuna:</strong> {selectedOrder.customer?.comuna}</p>
                <p><strong>Dirección:</strong> {selectedOrder.customer?.direccion}</p>
                {selectedOrder.customer?.notas && (
                  <p><strong>Notas:</strong> {selectedOrder.customer?.notas}</p>
                )}
              </div>

              <div className="order-section">
                <h4>Productos</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span>{item.product}</span>
                    <span>x{item.quantity}</span>
                    <span>{formatPrice(item.unit_price)}</span>
                  </div>
                ))}
              </div>

              <div className="order-section">
                <h4>Totales</h4>
                <p><strong>Subtotal:</strong> {formatPrice(selectedOrder.subtotal)}</p>
                <p><strong>Envío:</strong> {formatPrice(selectedOrder.shipping_cost)}</p>
                <p className="order-total-large"><strong>Total:</strong> {formatPrice(selectedOrder.total)}</p>
              </div>

              <div className="order-section">
                <h4>Pago</h4>
                <p><strong>Método:</strong> {getPaymentMethodLabel(selectedOrder.payment_method)}</p>
                {selectedOrder.transaction_data?.authorization_code && (
                  <p><strong>Código Auth:</strong> {selectedOrder.transaction_data.authorization_code}</p>
                )}
                {selectedOrder.transaction_data?.card_last4 && (
                  <p><strong>Tarjeta:</strong> ****{selectedOrder.transaction_data.card_last4}</p>
                )}
              </div>

              <div className="order-section">
                <h4>Fechas</h4>
                <p><strong>Creada:</strong> {formatDate(selectedOrder.created_at)}</p>
                {selectedOrder.confirmed_at && (
                  <p><strong>Confirmada:</strong> {formatDate(selectedOrder.confirmed_at)}</p>
                )}
              </div>
            </div>

            <div className="modal-actions">
              {selectedOrder.payment_method === 'transferencia' && 
               selectedOrder.status === 'pending_payment' && (
                <button 
                  className="action-btn confirm-btn"
                  onClick={() => handleConfirmTransfer(selectedOrder.buy_order)}
                >
                  ✅ Confirmar Transferencia
                </button>
              )}
              
              {selectedOrder.status === 'confirmed' && (
                <button 
                  className="action-btn ship-btn"
                  onClick={() => handleUpdateStatus(selectedOrder.buy_order, 'shipped')}
                >
                  📦 Marcar como Enviado
                </button>
              )}
              
              {selectedOrder.status === 'shipped' && (
                <button 
                  className="action-btn deliver-btn"
                  onClick={() => handleUpdateStatus(selectedOrder.buy_order, 'delivered')}
                >
                  ✅ Marcar como Entregado
                </button>
              )}

              {['pending_payment', 'initiated'].includes(selectedOrder.status) && (
                <button 
                  className="action-btn cancel-btn"
                  onClick={() => handleUpdateStatus(selectedOrder.buy_order, 'cancelled')}
                >
                  ❌ Cancelar Orden
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
