import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg'];
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError('');
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPG/JPEG files are allowed');
      return false;
    }
    
    if (file.size > MAX_SIZE) {
      setError('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const simulateUpload = (file) => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
    simulateUpload(file);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const resetUpload = () => {
    setPreviewUrl(null);
    setUploadProgress(0);
    setUploading(false);
    setUploadComplete(false);
    setError('');
  };

  const goToResults = () => {
    navigate('/result');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50 font-sans">
      <div className="w-full max-w-xl p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all
            ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'}
            ${uploadComplete ? 'border-green-400' : ''}
            ${error ? 'border-red-400' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".jpg,.jpeg"
          />

          {error && (
            <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {!previewUrl ? (
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <button
                  onClick={onButtonClick}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Upload a file
                </button>
                <span className="text-gray-500"> or drag and drop</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">Only JPG/JPEG files up to 10MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain w-full h-full"
                />
                <button
                  onClick={resetUpload}
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-900/50 text-white hover:bg-gray-900/75 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    {uploadComplete ? (
                      <span className="text-sm font-semibold inline-flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" /> Upload Complete
                      </span>
                    ) : (
                      <span className="text-sm font-semibold inline-flex items-center text-blue-600">
                        <Upload className="h-4 w-4 mr-1" /> Uploading...
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-blue-700">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500
                      ${uploadComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>
            </div>
          )}

          {uploadComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <button
                onClick={goToResults}
                className="w-full bg-green-600 text-white rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <span>Check Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
