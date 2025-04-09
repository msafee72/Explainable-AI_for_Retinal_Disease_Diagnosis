import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { octImageService } from "../../Services/api";
import ReviewSection from "../../Components/ReviewSection/ReviewSection";

const ImageDetails = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const imageData = await octImageService.getImageById(id);
        setImage(imageData);
        console.log("Fetched Image Data:", imageData);
      } catch (err) {
        setError("Failed to fetch image details.");
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetails();
  }, [id]);

  // Parse analysis findings into structured format
  const parseFindings = (findings) => {
    if (!findings) return {};
    
    const result = {};
    
    // Extract confidence
    const confidenceMatch = findings.match(/Confidence:\s*(\d+\.\d+%)/);
    if (confidenceMatch) result.confidence = confidenceMatch[1];
    
    // Extract explanation
    const explanationMatch = findings.match(/Explanation:\s*(.*?)(?=Next Step:|$)/s);
    if (explanationMatch) result.explanation = explanationMatch[1].trim();
    
    // Extract next step
    const nextStepMatch = findings.match(/Next Step:\s*(.*?)(?=Heatmap Interpretation:|$)/s);
    if (nextStepMatch) result.nextStep = nextStepMatch[1].trim();
    
    // Extract heatmap interpretation
    const heatmapMatch = findings.match(/Heatmap Interpretation:\s*(.*?)$/s);
    if (heatmapMatch) result.heatmapInterpretation = heatmapMatch[1].trim();
    
    return result;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="font-inter animate-pulse text-sm sm:text-base">Loading image details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-400 font-inter text-sm sm:text-base">{error}</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 font-inter text-sm sm:text-base">Image not found.</p>
      </div>
    );
  }

  const analysisResult = image.analysis_result;
  const parsedFindings = analysisResult ? parseFindings(analysisResult.findings) : {};

  return (
    <div className="min-h-screen sm:pt-4 lg:mt-16 bg-black py-6 px-3 sm:px-4 lg:px-8 text-white">
      <div className="container mx-auto max-w-5xl">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold font-grotesk text-white mb-6 sm:mb-10 text-center">Image Details</h1>

        {/* Image Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="flex flex-col items-center">
            <img
              src={image.image_file}
              alt="Uploaded OCT"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded"
            />
            <p className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3 font-dmsans">Original OCT Image</p>
          </div>

          {analysisResult ? (
            <div className="flex flex-col items-center">
              <img
                src={analysisResult.analysis_image}
                alt="AI Result"
                className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded"
              />
              <p className="text-xs sm:text-sm text-gray-300 mt-2 sm:mt-3 font-dmsans">AI Diagnostic Heatmap</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 sm:h-56 md:h-64 lg:h-72">
              <p className="text-xs sm:text-sm text-gray-400 italic font-worksans">
                AI analysis not available yet.
              </p>
            </div>
          )}
        </div>

        {/* Image Info Section */}
       

        {/* Analysis Report Section */}
        {analysisResult ? (
          <div className="mb-8 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 font-grotesk text-gray-100 pb-2 border-b border-gray-800">
              Analysis Report
            </h3>
            
            {/* Condition */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-400 font-worksans">
                Predicted Condition
              </h4>
              <div className="flex flex-wrap items-center gap-3 sm:gap-0">
                <span className="bg-blue-900/30 text-blue-200 py-1 px-3 sm:px-4 rounded-full font-dmsans text-base sm:text-lg">
                  {analysisResult.classification}
                </span>
                {parsedFindings.confidence && (
                  <span className="sm:ml-4 text-gray-300 font-dmsans text-sm sm:text-base">
                    Confidence: {parsedFindings.confidence}
                  </span>
                )}
              </div>
            </div>
            
            {/* Findings breakdown */}
            <div className="space-y-6 sm:space-y-8">
              {parsedFindings.explanation && (
                <div>
                  <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-400 font-worksans">
                    Explanation
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 font-inter">
                    {parsedFindings.explanation}
                  </p>
                </div>
              )}
              
              {parsedFindings.nextStep && (
                <div>
                  <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-400 font-worksans">
                    Next Steps
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 font-inter">
                    {parsedFindings.nextStep}
                  </p>
                </div>
              )}
              
              {parsedFindings.heatmapInterpretation && (
                <div>
                  <h4 className="text-sm sm:text-md font-medium mb-2 sm:mb-3 text-gray-400 font-worksans">
                    Heatmap Interpretation
                  </h4>
                  <p className="text-sm sm:text-base text-gray-300 font-inter">
                    {parsedFindings.heatmapInterpretation}
                  </p>
                </div>
              )}
              
              {!parsedFindings.explanation && !parsedFindings.nextStep && !parsedFindings.heatmapInterpretation && (
                <div>
                  <p className="text-sm sm:text-base text-gray-300 font-inter">
                    {analysisResult.findings || "No detailed findings available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-semibold font-grotesk text-gray-100 mb-3 sm:mb-4">Analysis Report</h3>
            <p className="text-xs sm:text-sm text-gray-400 italic">Analysis not available yet. Please check back later.</p>
          </div>
        )}
        
        {/* Review Section */}
        {analysisResult && (
          <div className="border-t border-gray-800 pt-6 sm:pt-10 mt-6 sm:mt-10">
            <ReviewSection analysisResultId={analysisResult.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDetails;