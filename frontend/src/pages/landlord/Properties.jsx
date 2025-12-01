/**
 * Landlord Properties Page - View and manage all properties
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout';
import { Card, Button, Badge, EmptyState, Loading } from '../../components/common';
import { Plus, Home, MapPin, DollarSign, Bed, Bath, Users, Calendar, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/properties/landlord/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const propertyList = data.results || data;
        setProperties(propertyList);
        
        // Calculate stats
        const newStats = {
          total: propertyList.length,
          draft: propertyList.filter(p => p.status === 'draft').length,
          pending: propertyList.filter(p => p.status === 'pending_approval').length,
          approved: propertyList.filter(p => p.status === 'approved').length,
          rejected: propertyList.filter(p => p.status === 'rejected').length
        };
        setStats(newStats);
      } else {
        const errorData = await response.json();
        console.error('Failed to load properties:', errorData);
        toast.error('Failed to load properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { variant: 'secondary', label: 'Draft' },
      pending_approval: { variant: 'warning', label: 'Pending Review' },
      approved: { variant: 'success', label: 'Active' },
      rejected: { variant: 'danger', label: 'Rejected' },
      booked: { variant: 'info', label: 'Booked' },
    };
    
    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-propertree-dark">My Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property listings and view bookings</p>
        </div>
        <Link to="/landlord/properties/new">
          <Button variant="primary" leftIcon={<Plus />}>
            Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <Card.Body className="text-center">
              <div className="text-3xl font-bold text-propertree-green">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-3xl font-bold text-gray-500">{stats.draft}</div>
              <div className="text-sm text-gray-600">Draft</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
              <div className="text-sm text-gray-600">Active</div>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="text-center">
              <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6 flex gap-4">
        <Link to="/landlord/bookings">
          <Button variant="outline" leftIcon={<Calendar />}>
            View Bookings
          </Button>
        </Link>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <EmptyState
          icon={<Home className="w-16 h-16" />}
          title="No properties listed"
          message="Start by adding your first property to appear in searches"
          action={() => navigate('/landlord/properties/new')}
          actionLabel="Add First Property"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {/* Property Image */}
              <div className="h-56 bg-gray-200 overflow-hidden rounded-t-2xl">
                {property.primary_photo ? (
                  <img 
                    src={property.primary_photo} 
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <Card.Body className="p-5">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 flex-1">
                    {property.title}
                  </h3>
                  {getStatusBadge(property.status)}
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {property.city}, {property.state}
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-3 mb-5 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Bed className="w-4 h-4 mr-1.5" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bath className="w-4 h-4 mr-1.5" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1.5" />
                    {property.max_guests}
                  </div>
                </div>

                {/* Price */}
                <div className="text-xl font-bold text-propertree-green mb-5">
                  ${property.price_per_night}
                  <span className="text-sm text-gray-600 font-normal ml-1"> / night</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {property.status === 'approved' && (
                    <Link to={`/properties/${property.id}`} className="flex-1">
                      <Button variant="outline" size="sm" leftIcon={<Eye />} className="w-full">
                        View Live
                      </Button>
                    </Link>
                  )}
                  <Link 
                    to={`/landlord/properties/${property.id}/edit`} 
                    className={property.status === 'approved' ? 'flex-1' : 'w-full'}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      {property.status === 'draft' ? 'Complete' : 'Edit'}
                    </Button>
                  </Link>
                </div>

                {/* Rejection Reason */}
                {property.status === 'rejected' && property.rejection_reason && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                    <strong>Rejected:</strong> {property.rejection_reason}
                  </div>
                )}

                {/* Pending Message */}
                {property.status === 'pending_approval' && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    Awaiting admin approval
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Properties;
