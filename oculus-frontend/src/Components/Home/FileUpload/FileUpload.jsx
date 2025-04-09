import React, { useState, useRef } from "react";
import { Image as ImageIcon, UploadCloud, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { octImageService } from "../../../Services/api";
import { analysisResultService } from "../../../Services/api";

const FileUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const inputRef = useRef(null);
  const [imageId, setImageId] = useState(null);
  const navigate = useNavigate();

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const seeResult = () => {
    const results = analysisResultService.getAnalysisResults();
    if (results.length > 0) {
      const latestResult = results.reduce((latest, current) =>
        new Date(current.timestamp) > new Date(latest.timestamp)
          ? current
          : latest
      );
      setAnalysis(latestResult);
    }
  };

  const handleUpload = async () => {
    if (!inputRef.current.files[0]) return;
    setLoading(true);
    setError(null);
    try {
      const file = inputRef.current.files[0];
      const response = await octImageService.uploadImage(file);
      console.log("Image uploaded:", response);

      // Safely extract image ID from either response.id or response.data.id
      const imageID = response?.id || response?.data?.id;

      if (imageID) {
        console.log("Image ID:", imageID);
        setImageId(imageID);
        setUploadComplete(true); // Set only after imageId is confirmed
      } else {
        throw new Error("Image ID not found in response.");
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:pt-4 lg:mt-16 bg-black py-6 px-3 sm:px-4 lg:px-8 text-white">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-white mb-4">
              Upload Your OCT Image
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2 font-dmsans">
              Image format must be .JPG or .PNG
            </p>
          </div>

          <div
            onClick={() => inputRef.current.click()}
            className="relative cursor-pointer group"
          >
            <input
              type="file"
              ref={inputRef}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
              accept=".jpg,.jpeg,.png"
            />

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/50 p-10 flex flex-col items-center justify-center h-64 sm:h-80 transition-all hover:border-gray-400">
                <div className="bg-gray-800 text-gray-200 p-4 rounded-full mb-4">
                  <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <p className="text-lg sm:text-xl font-medium text-gray-200 mb-2 font-grotesk">
                  Drag and drop your file here
                </p>
                <p className="text-gray-400 mb-6 font-dmsans text-sm sm:text-base">
                  or click to browse files
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-lg overflow-hidden h-64 sm:h-80 relative group">
                <img
                  src={previewUrl}
                  alt="OCT preview"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-transparent text-gray-100 px-6 py-3 rounded-full font-medium border border-gray-400 hover:text-gray-600 transition-all font-space-grotesk">
                    Change Image
                  </button>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-6 flex justify-center items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          )}

          {error && <p className="text-center text-red-400 mt-4 font-inter">{error}</p>}

          {previewUrl && !loading && !uploadComplete && (
            <div className="relative lg:mt-6 lg:w-96 max-w-xl mx-auto">
              <button
                onClick={handleUpload}
                className="relative group w-full px-4 py-3 bg-transparent rounded-full text-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-space-grotesk text-sm hover:text-gray-600 font-light flex justify-center items-center"
              >
                UPLOAD AND SEE AI GENERATED RESULT
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                    <ArrowRight
                      size={20}
                      className="text-4xl font-bold"
                    />
                  </div>
                </div>
              </button>
            </div>
          )}

          {uploadComplete && imageId && (
            <div className="relative lg:mt-6 lg:w-96 max-w-xl mx-auto">
              <Link
                to={`/result/${imageId}`}
                className="relative group w-full px-4 py-3 bg-transparent rounded-full text-gray-100 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 font-space-grotesk text-sm hover:text-gray-600 font-light flex justify-center items-center"
              >
                VIEW ANALYSIS RESULTS
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center transition-all duration-300 group-hover:translate-x-1 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-white transition-all duration-300">
                    <ArrowRight
                      size={20}
                      className="text-4xl font-bold"
                    />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FileUpload;