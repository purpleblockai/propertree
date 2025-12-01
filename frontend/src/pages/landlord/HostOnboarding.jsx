/**
 * Host Onboarding - 11-step wizard for becoming a host
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Container } from '../../components/layout';
import { Button, Card } from '../../components/common';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

// Import all step components
import PropertyTypeStep from './onboarding/PropertyTypeStep';
import PlaceTypeStep from './onboarding/PlaceTypeStep';
import PropertyInfoStep from './onboarding/PropertyInfoStep';
import AddressStep from './onboarding/AddressStep';
import PhotosStep from './onboarding/PhotosStep';
import AmenitiesStep from './onboarding/AmenitiesStep';
import CheckInOutStep from './onboarding/CheckInOutStep';
import PricingStep from './onboarding/PricingStep';
import BookingApprovalStep from './onboarding/BookingApprovalStep';
import HouseRulesStep from './onboarding/HouseRulesStep';
import ReviewStep from './onboarding/ReviewStep';

const STEPS = [
  { id: 1, title: 'Property Type', component: PropertyTypeStep },
  { id: 2, title: 'Place Type', component: PlaceTypeStep },
  { id: 3, title: 'Property Information', component: PropertyInfoStep },
  { id: 4, title: 'Address', component: AddressStep },
  { id: 5, title: 'Photos', component: PhotosStep },
  { id: 6, title: 'Amenities', component: AmenitiesStep },
  { id: 7, title: 'Check-in/Check-out', component: CheckInOutStep },
  { id: 8, title: 'Pricing', component: PricingStep },
  { id: 9, title: 'Booking Approval', component: BookingApprovalStep },
  { id: 10, title: 'House Rules', component: HouseRulesStep },
  { id: 11, title: 'Review & Submit', component: ReviewStep },
];

const HostOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Property ID (set after creation)
    propertyId: null,
    // Step 1
    property_type: '',
    // Step 2
    place_type: '',
    // Step 3
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    max_guests: 1,
    // Step 4
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    // Step 5
    photos: [],
    // Step 6
    amenities: [],
    // Step 7
    check_in_time: '15:00',
    check_out_time: '11:00',
    // Step 8
    base_price: '',
    cleaning_fee: 0,
    service_fee_percent: 10,
    currency: 'USD',
    // Step 9
    approval_type: 'landlord',  // Default to landlord approval
    // Step 10
    title: '',
    description: '',
    house_rules: '',
    allows_pets: false,
    allows_smoking: false,
    allows_events: false,
    minimum_stay: 1,
    maximum_stay: null,
  });

  const currentStepComponent = STEPS.find(step => step.id === currentStep);
  const StepComponent = currentStepComponent?.component;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSaveDraft = async () => {
    try {
      // Map form data to simplified property model
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
        price_per_night: parseFloat(formData.base_price) || 0,
        approval_type: formData.approval_type || 'landlord',
        amenities: formData.amenities || [],
        photos: formData.photos || [],
        status: 'draft'
      };

      const response = await fetch('http://localhost:8000/api/properties/landlord/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(propertyData)
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Draft saved successfully!');
        // Store property ID for future updates
        setFormData(prev => ({ ...prev, propertyId: data.id }));
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Error saving draft');
    }
  };

  const handleSubmit = async () => {
    try {
      // Step 1: Create property as draft first
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
        price_per_night: parseFloat(formData.base_price) || 0,
        approval_type: formData.approval_type || 'landlord',
        amenities: formData.amenities || [],
        photos: formData.photos || [],
        status: 'draft'
      };

      const createResponse = await fetch('http://localhost:8000/api/properties/landlord/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(propertyData)
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('Error creating property:', errorData);
        toast.error('Failed to create property');
        return;
      }

      const createdProperty = await createResponse.json();
      
      // Step 2: Submit for approval
      const submitResponse = await fetch(`http://localhost:8000/api/properties/landlord/${createdProperty.id}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (submitResponse.ok) {
        toast.success('Property submitted for approval!');
        navigate('/landlord/properties');
      } else {
        const errorData = await submitResponse.json();
        console.error('Error submitting:', errorData);
        toast.error('Failed to submit property for approval');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error('Error submitting property');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Add Property</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep} of {STEPS.length}
            </span>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepChange(step.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-all ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : step.id === currentStep
                      ? 'bg-propertree-blue text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </button>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-1 ${
                      step.id < currentStep ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-propertree-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <Card.Header>
            <Card.Title>{currentStepComponent?.title}</Card.Title>
          </Card.Header>

          <Card.Body>
            {StepComponent && (
              <StepComponent
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
          </Card.Body>

          {/* Navigation Buttons */}
          <Card.Footer>
            <div className="flex justify-between items-center">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    leftIcon={<ChevronLeft />}
                  >
                    Back
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </Button>

                {currentStep < STEPS.length ? (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    rightIcon={<ChevronRight />}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                  >
                    Submit for Approval
                  </Button>
                )}
              </div>
            </div>
          </Card.Footer>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-gray-600">
          <p>
            You can save your progress at any time and continue later.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default HostOnboarding;

