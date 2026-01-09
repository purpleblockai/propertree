/**
 * Step 5: Photos Upload
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../../components/common';

const PhotosStep = ({ formData, updateFormData }) => {
  const [previews, setPreviews] = useState(formData.photos || []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file,
          preview: reader.result,
          isPrimary: previews.length === 0,
        };
        
        setPreviews(prev => [...prev, newPhoto]);
        updateFormData({ photos: [...previews, newPhoto] });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (id) => {
    const updated = previews.filter(p => p.id !== id);
    setPreviews(updated);
    updateFormData({ photos: updated });
  };

  const handleSetPrimary = (id) => {
    const updated = previews.map(p => ({
      ...p,
      isPrimary: p.id === id
    }));
    setPreviews(updated);
    updateFormData({ photos: updated });
  };

  return (
    <div>
      <p className="text-gray-600 mb-6">
        Add photos of your property. The first photo will be the cover photo.
      </p>

      {/* Upload Area */}
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
          <p className="text-gray-900 font-medium mb-1">
            Click to upload
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG or GIF (max. 10MB per photo)
          </p>
        </label>
      </div>

      {/* Photo Grid */}
      {previews.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              
              {photo.isPrimary && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  Primary Photo
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 space-x-2">
                  {!photo.isPrimary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleSetPrimary(photo.id)}
                    >
                      Set Primary
                    </Button>
                  )}
                  <button
                    onClick={() => handleRemove(photo.id)}
                    className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">No photos added yet</p>
        </div>
      )}
    </div>
  );
};

PhotosStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
};

export default PhotosStep;
