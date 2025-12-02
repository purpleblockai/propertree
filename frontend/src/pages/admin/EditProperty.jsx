/**
 * Admin Edit Property Page - Edit any property as admin
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Container } from '../../components/layout';
import { Card, Button, Loading, Input, TextArea, Select, Checkbox } from '../../components/common';
import { Save, ArrowLeft, Upload, X, Home, Building, Hotel, Key, Castle, Building2, HomeIcon, Wifi, Car, Utensils, Tv, Wind, Waves, Dumbbell, Coffee } from 'lucide-react';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment', icon: Building },
  { value: 'house', label: 'House', icon: Home },
  { value: 'condo', label: 'Condo', icon: Building2 },
  { value: 'villa', label: 'Villa', icon: Castle },
  { value: 'studio', label: 'Studio', icon: HomeIcon },
  { value: 'townhouse', label: 'Townhouse', icon: Hotel },
];

const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'kitchen', label: 'Kitchen', icon: Utensils },
  { id: 'tv', label: 'TV', icon: Tv },
  { id: 'ac', label: 'Air Conditioning', icon: Wind },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    property_type: '',
    title: '',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 1,
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    price_per_night: '',
    approval_type: 'admin',
    amenities: [],
    photos: [],
    status: 'approved',
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/properties/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        setFormData({
          property_type: data.property_type || '',
          title: data.title || '',
          description: data.description || '',
          bedrooms: data.bedrooms || 1,
          bathrooms: data.bathrooms || 1,
          max_guests: data.max_guests || 1,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          postal_code: data.postal_code || '',
          price_per_night: data.price_per_night || '',
          approval_type: data.approval_type || 'admin',
          amenities: data.amenities || [],
          photos: data.photos || [],
          status: data.status || 'approved',
        });
      } else {
        toast.error('Failed to load property');
        navigate('/admin/properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name, value) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleDecimalChange = (name, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenityId)
        ? current.filter(id => id !== amenityId)
        : [...current, amenityId];
      return { ...prev, amenities: updated };
    });
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file,
          preview: reader.result,
          isPrimary: formData.photos.length === 0,
        };
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, newPhoto]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const normalizedPhotos = formData.photos.map(photo => {
        if (typeof photo === 'string') return photo;
        if (photo.url) return photo.url;
        if (photo.preview && !photo.preview.startsWith('data:')) return photo.preview;
        return photo;
      });

      const propertyData = {
        title: formData.title || 'Untitled Property',
        description: formData.description || 'No description provided',
        property_type: formData.property_type,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code,
        bedrooms: parseInt(formData.bedrooms) || 1,
        bathrooms: parseFloat(formData.bathrooms) || 1,
        max_guests: parseInt(formData.max_guests) || 1,
        price_per_night: parseFloat(formData.price_per_night) || 0,
        approval_type: formData.approval_type || 'admin',
        amenities: formData.amenities || [],
        photos: normalizedPhotos,
        status: formData.status,
      };

      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/properties/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (response.ok) {
        toast.success('Property updated successfully!');
        navigate('/admin/properties');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Failed to update property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    } finally {
      setSaving(false);
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft />}
              onClick={() => navigate('/admin/properties')}
            >
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600 mt-1">Update property details</p>
            </div>
          </div>
          <Button
            variant="primary"
            leftIcon={<Save />}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Basic Information */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Basic Information</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <Select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                options={PROPERTY_TYPES.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter property title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the property..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => handleNumberChange('bedrooms', e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => handleDecimalChange('bathrooms', e.target.value)}
                  min="0.5"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Guests
                </label>
                <Input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={(e) => handleNumberChange('max_guests', e.target.value)}
                  min="1"
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Location */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Location</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Pricing */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Pricing</Card.Title>
          </Card.Header>
          <Card.Body>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Night (€)
              </label>
              <Input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={(e) => handleDecimalChange('price_per_night', e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </Card.Body>
        </Card>

        {/* Status */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Status</Card.Title>
          </Card.Header>
          <Card.Body>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'approved', label: 'Approved' },
                { value: 'pending_approval', label: 'Pending Approval' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
          </Card.Body>
        </Card>

        {/* Amenities */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Amenities</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AMENITIES.map((amenity) => {
                const IconComponent = amenity.icon;
                const isSelected = formData.amenities.includes(amenity.id);
                return (
                  <label
                    key={amenity.id}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-propertree-green bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="hidden"
                    />
                    <IconComponent className={`w-5 h-5 ${isSelected ? 'text-propertree-green' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-propertree-green' : 'text-gray-700'}`}>
                      {amenity.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* Photos */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>Photos</Card.Title>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-propertree-green transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-900 font-medium mb-1">Click to upload</p>
                <p className="text-sm text-gray-500">JPG, PNG or GIF (max. 10MB per photo)</p>
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={photo.id || index} className="relative group">
                    <img
                      src={photo.preview || photo.url || photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePhoto(photo.id || index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default EditProperty;


