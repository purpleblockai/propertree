/**
 * Admin Properties - View and approve/reject properties
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Home, Search, Filter, CheckCircle, XCircle, 
  Eye, Clock, MapPin, DollarSign, Edit, Trash2, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout';
import { Card, Button, Input, Badge, Modal, Loading, EmptyState } from '../../components/common';
import { toast } from 'react-hot-toast';

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      let url = `${API_BASE_URL}/admin/properties/all/`;
      if (statusFilter && statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProperties(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/admin/properties/${propertyId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok) {
        toast.success('Property approved successfully!');
        fetchProperties();
      } else {
        toast.error('Failed to approve property');
      }
    } catch (error) {
      console.error('Error approving property:', error);
      toast.error('Error approving property');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/admin/properties/${selectedProperty.id}/reject/`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ reason: rejectionReason })
        }
      );
      
      if (response.ok) {
        toast.success('Property rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedProperty(null);
        fetchProperties();
      } else {
        toast.error('Failed to reject property');
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast.error('Error rejecting property');
    }
  };

  const openRejectModal = (property) => {
    setSelectedProperty(property);
    setShowRejectModal(true);
  };

  const openDeleteModal = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedProperty) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/properties/${selectedProperty.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (response.ok || response.status === 204) {
        toast.success('Property deleted successfully!');
        setShowDeleteModal(false);
        setSelectedProperty(null);
        fetchProperties();
      } else {
        toast.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
  };

  const handleEdit = (propertyId) => {
    navigate(`/admin/properties/${propertyId}/edit`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending_approval: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Active' },
      rejected: { variant: 'danger', label: 'Rejected' },
      draft: { variant: 'secondary', label: 'Draft' },
      booked: { variant: 'info', label: 'Booked' },
    };
    
    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredProperties = properties.filter(property => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.title?.toLowerCase().includes(query) ||
      property.city?.toLowerCase().includes(query) ||
      property.owner_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Container className="py-8">
        <Loading />
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-2">Review, approve, edit, or remove property listings</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus />}
          onClick={() => navigate('/admin/properties/new')}
        >
          Add Property
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                leftIcon={<Search className="w-5 h-5" />}
                placeholder="Search properties by title, city, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'pending_approval' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('pending_approval')}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('approved')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <EmptyState
          icon={<Home className="w-16 h-16" />}
          title="No properties found"
          message={statusFilter === 'pending_approval' 
            ? "No properties pending approval" 
            : "No properties match your filters"}
        />
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <Card.Body>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Image */}
                  <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {property.primary_photo ? (
                      <img 
                        src={property.primary_photo} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {property.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {property.city}, {property.state}, {property.country}
                        </p>
                      </div>
                      {getStatusBadge(property.status)}
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {property.property_type?.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Max Guests</p>
                        <p className="font-semibold text-gray-900">{property.max_guests}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price/Night</p>
                        <p className="font-semibold text-gray-900 flex items-center">
                          <DollarSign className="w-4 h-4" />
                          {property.price_per_night}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>Owner: <span className="font-medium">{property.owner_name || 'N/A'}</span></p>
                          <p>Submitted: {new Date(property.created_at).toLocaleDateString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Eye />}
                            onClick={() => window.open(`/properties/${property.id}`, '_blank')}
                          >
                            View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Edit />}
                            onClick={() => handleEdit(property.id)}
                          >
                            Edit
                          </Button>

                          {property.status === 'pending_approval' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                leftIcon={<CheckCircle />}
                                onClick={() => handleApprove(property.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                leftIcon={<XCircle />}
                                onClick={() => openRejectModal(property)}
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Trash2 />}
                            onClick={() => openDeleteModal(property)}
                          >
                            Delete
                          </Button>

                          {property.status === 'rejected' && property.rejection_reason && (
                            <div className="text-sm text-red-600 w-full mt-2">
                              Reason: {property.rejection_reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
          setSelectedProperty(null);
        }}
        title="Reject Property"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please provide a reason for rejecting <strong>{selectedProperty?.title}</strong>:
          </p>
          
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            rows="4"
            placeholder="Explain why this property is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionReason('');
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Property
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProperty(null);
        }}
        title="Delete Property"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedProperty?.title}</strong>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone. All associated data will be permanently removed.
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Property
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
};

export default Properties;
