import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { octImageService } from "../../Services/api";
import ReviewSection from "../../Components/ReviewSection/ReviewSection";

const Result = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingStage, setTypingStage] = useState(0);
  const [typedText, setTypedText] = useState({
    analysisReport: "",
    predictedCondition: "",
    condition: "",
    confidence: "",
    explanationTitle: "",
    explanation: "",
    nextStepsTitle: "",
    nextSteps: "",
    heatmapTitle: "",
    heatmap: ""
  });

  // References for full text content
  const fullTextContent = useRef({
    analysisReport: "Analysis Report",
    predictedCondition: "Predicted Condition",
    condition: "",
    confidence: "",
    explanationTitle: "Explanation",
    explanation: "",
    nextStepsTitle: "Next Steps",
    nextSteps: "",
    heatmapTitle: "Heatmap Interpretation",
    heatmap: ""
  });

  // To periodically check if analysis is available
  const fetchImageDetails = async () => {
    try {
      const imageData = await octImageService.getImageById(id);
      setImage(imageData);
      
      // Set full text values if analysis result is available
      if (imageData.analysis_result) {
        const parsedFindings = parseFindings(imageData.analysis_result.findings);
        fullTextContent.current = {
          ...fullTextContent.current,
          condition: imageData.analysis_result.classification,
          confidence: parsedFindings.confidence ? `Confidence: ${parsedFindings.confidence}` : "",
          explanation: parsedFindings.explanation || "",
          nextSteps: parsedFindings.nextStep || "",
          heatmap: parsedFindings.heatmapInterpretation || ""
        };
      }
      
      if (!imageData.analysis_result) {
        // If analysis not ready yet, try again later
        setTimeout(fetchImageDetails, 3000); // Retry after 3 seconds
      }
    } catch (err) {
      setError("Failed to fetch image details.");
      console.error("Error fetching image:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageDetails();
  }, [id]);

  // Start with Analysis Report title typing
  useEffect(() => {
    if (!loading && image?.analysis_result) {
      let currentIndex = 0;
      const analysisReportInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.analysisReport.length) {
          setTypedText(prev => ({
            ...prev,
            analysisReport: fullTextContent.current.analysisReport.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(analysisReportInterval);
          setTypingStage(1); // Move to predicted condition title
        }
      }, 75);
      
      return () => clearInterval(analysisReportInterval);
    } else if (!loading && image) {
      // Skip if no analysis result
      setTypingStage(8);
    }
  }, [loading, image]);

  // Handle Predicted Condition title typing
  useEffect(() => {
    if (typingStage === 1) {
      let currentIndex = 0;
      const predictedConditionInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.predictedCondition.length) {
          setTypedText(prev => ({
            ...prev,
            predictedCondition: fullTextContent.current.predictedCondition.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(predictedConditionInterval);
          setTypingStage(2); // Move to condition
        }
      }, 50);
      
      return () => clearInterval(predictedConditionInterval);
    }
  }, [typingStage]);

  // Handle condition typing
  useEffect(() => {
    if (typingStage === 2) {
      let currentIndex = 0;
      const conditionInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.condition.length) {
          setTypedText(prev => ({
            ...prev,
            condition: fullTextContent.current.condition.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(conditionInterval);
          setTypingStage(3); // Move to confidence
        }
      }, 75);
      
      return () => clearInterval(conditionInterval);
    }
  }, [typingStage]);
  
  // Handle confidence typing
  useEffect(() => {
    if (typingStage === 3 && fullTextContent.current.confidence) {
      let currentIndex = 0;
      const confidenceInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.confidence.length) {
          setTypedText(prev => ({
            ...prev,
            confidence: fullTextContent.current.confidence.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(confidenceInterval);
          setTypingStage(4); // Move to explanation title
        }
      }, 50);
      
      return () => clearInterval(confidenceInterval);
    } else if (typingStage === 3) {
      // Skip if no confidence
      setTypingStage(4);
    }
  }, [typingStage]);

  // Handle explanation title typing
  useEffect(() => {
    if (typingStage === 4 && fullTextContent.current.explanation) {
      let currentIndex = 0;
      const explanationTitleInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.explanationTitle.length) {
          setTypedText(prev => ({
            ...prev,
            explanationTitle: fullTextContent.current.explanationTitle.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(explanationTitleInterval);
          setTypingStage(5); // Move to explanation content
        }
      }, 50);
      
      return () => clearInterval(explanationTitleInterval);
    } else if (typingStage === 4) {
      // Skip if no explanation
      setTypingStage(6);
    }
  }, [typingStage]);

  // Handle explanation content typing
  useEffect(() => {
    if (typingStage === 5) {
      let currentIndex = 0;
      const explanationInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.explanation.length) {
          setTypedText(prev => ({
            ...prev,
            explanation: fullTextContent.current.explanation.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(explanationInterval);
          setTypingStage(6); // Move to next steps title
        }
      }, 15);
      
      return () => clearInterval(explanationInterval);
    }
  }, [typingStage]);

  // Handle next steps title typing
  useEffect(() => {
    if (typingStage === 6 && fullTextContent.current.nextSteps) {
      let currentIndex = 0;
      const nextStepsTitleInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.nextStepsTitle.length) {
          setTypedText(prev => ({
            ...prev,
            nextStepsTitle: fullTextContent.current.nextStepsTitle.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(nextStepsTitleInterval);
          setTypingStage(7); // Move to next steps content
        }
      }, 50);
      
      return () => clearInterval(nextStepsTitleInterval);
    } else if (typingStage === 6) {
      // Skip if no next steps
      setTypingStage(8);
    }
  }, [typingStage]);

  // Handle next steps content typing
  useEffect(() => {
    if (typingStage === 7) {
      let currentIndex = 0;
      const nextStepsInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.nextSteps.length) {
          setTypedText(prev => ({
            ...prev,
            nextSteps: fullTextContent.current.nextSteps.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(nextStepsInterval);
          setTypingStage(8); // Move to heatmap title
        }
      }, 15);
      
      return () => clearInterval(nextStepsInterval);
    }
  }, [typingStage]);

  // Handle heatmap title typing
  useEffect(() => {
    if (typingStage === 8 && fullTextContent.current.heatmap) {
      let currentIndex = 0;
      const heatmapTitleInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.heatmapTitle.length) {
          setTypedText(prev => ({
            ...prev,
            heatmapTitle: fullTextContent.current.heatmapTitle.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(heatmapTitleInterval);
          setTypingStage(9); // Move to heatmap content
        }
      }, 50);
      
      return () => clearInterval(heatmapTitleInterval);
    } else if (typingStage === 8) {
      // Skip if no heatmap
      setTypingStage(10);
    }
  }, [typingStage]);

  // Handle heatmap content typing
  useEffect(() => {
    if (typingStage === 9) {
      let currentIndex = 0;
      const heatmapInterval = setInterval(() => {
        if (currentIndex <= fullTextContent.current.heatmap.length) {
          setTypedText(prev => ({
            ...prev,
            heatmap: fullTextContent.current.heatmap.substring(0, currentIndex)
          }));
          currentIndex++;
        } else {
          clearInterval(heatmapInterval);
          setTypingStage(10); // Finished typing
        }
      }, 15);
      
      return () => clearInterval(heatmapInterval);
    }
  }, [typingStage]);

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
        <p className="font-inter animate-pulse">Loading analysis result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-400 font-inter">{error}</p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 font-inter">Image not found.</p>
      </div>
    );
  }

  const analysisResult = image.analysis_result;

  return (
    <div className="min-h-screen lg:mt-20 bg-black py-10 px-4 lg:px-8 text-white">
      <div className="container mx-auto max-w-5xl">
        {/* Image Display Section - Appears immediately */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="flex flex-col items-center">
            <img
              src={image.image_file}
              alt="Uploaded OCT"
              className="w-full h-72 object-cover rounded"
            />
            <p className="text-sm text-gray-300 mt-3 font-dmsans">Original OCT Image</p>
          </div>

          {analysisResult ? (
            <div className="flex flex-col items-center">
              <img
                src={analysisResult.analysis_image}
                alt="AI Result"
                className="w-full h-72 object-cover rounded"
              />
              <p className="text-sm text-gray-300 mt-3 font-dmsans">AI Diagnostic Heatmap</p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-72">
              <p className="text-sm text-gray-400 italic font-worksans animate-pulse">
                Processing AI analysis...
              </p>
            </div>
          )}
        </div>

        {/* Analysis Report - With typing animations */}
        {analysisResult && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 font-grotesk text-gray-100 pb-2">
              {typedText.analysisReport}
              {typingStage === 0 && (
                <span className="inline-block w-3 h-4 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
              )}
            </h3>
            
            {/* Condition with typing animation */}
            <div className="mb-8">
              <h4 className="text-md font-medium mb-3 text-gray-400 font-worksans">
                {typedText.predictedCondition}
                {typingStage === 1 && (
                  <span className="inline-block w-3 h-4 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                )}
              </h4>
              <div className="flex items-center">
                <span className="bg-blue-900/30 text-blue-200 py-1 px-4 rounded-full font-dmsans text-lg">
                  {typedText.condition}
                  {typingStage === 2 && (
                    <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                  )}
                </span>
                {fullTextContent.current.confidence && (
                  <span className="ml-4 text-gray-300 font-dmsans">
                    {typedText.confidence}
                    {typingStage === 3 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            {/* Findings breakdown with typing animations */}
            <div className="space-y-8">
              {fullTextContent.current.explanation && (
                <div>
                  <h4 className="text-md font-medium mb-3 text-gray-400 font-worksans">
                    {typedText.explanationTitle}
                    {typingStage === 4 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </h4>
                  <p className="text-gray-300 font-inter">
                    {typedText.explanation}
                    {typingStage === 5 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              )}
              
              {fullTextContent.current.nextSteps && (
                <div>
                  <h4 className="text-md font-medium mb-3 text-gray-400 font-worksans">
                    {typedText.nextStepsTitle}
                    {typingStage === 6 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </h4>
                  <p className="text-gray-300 font-inter">
                    {typedText.nextSteps}
                    {typingStage === 7 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              )}
              
              {fullTextContent.current.heatmap && (
                <div>
                  <h4 className="text-md font-medium mb-3 text-gray-400 font-worksans">
                    {typedText.heatmapTitle}
                    {typingStage === 8 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </h4>
                  <p className="text-gray-300 font-inter">
                    {typedText.heatmap}
                    {typingStage === 9 && (
                      <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-1 animate-pulse"></span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Review Section - No animation */}
        {analysisResult && typingStage >= 10 && (
          <div className="border-t border-gray-800 pt-10 mt-10">
            <ReviewSection analysisResultId={analysisResult.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;