import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { octImageService } from "../../Services/api";

const Records = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await octImageService.getImages();
        setImages(data);
      } catch (err) {
        setError('Failed to fetch image records.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Remove status filter since OCTImage model has no status field
  const filteredImages = images.filter(
    (image) =>
      (image.custom_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants (unchanged)
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeOut" } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1, ease: "easeOut", duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } })
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } })
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gray-50 lg:mt-14"
    >
      <motion.main 
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 lg:px-8 lg:py-12"
      >
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900"
          >
            OCT Image Records
          </motion.h1>
          <motion.input
            variants={itemVariants}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
            type="text"
            placeholder="Search images..."
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Table view for medium screens and larger */}
        <AnimatePresence>
          <motion.div
            variants={itemVariants} 
            className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <motion.tr variants={itemVariants}>
                    <motion.th variants={itemVariants} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Image ID</motion.th>
                    <motion.th variants={itemVariants} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Custom ID</motion.th>
                    <motion.th variants={itemVariants} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Upload Date</motion.th>
                    <motion.th variants={itemVariants} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</motion.th>
                  </motion.tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {filteredImages.map((image, i) => (
                      <motion.tr 
                        key={image.id}
                        custom={i}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.4)" }}
                      >
                        <motion.td variants={itemVariants} className="px-4 py-3 text-sm text-gray-900 font-medium">{image.id}</motion.td>
                        <motion.td variants={itemVariants} className="px-4 py-3 text-sm text-gray-900">{image.custom_id || 'N/A'}</motion.td>
                        <motion.td variants={itemVariants} className="px-4 py-3 text-sm text-gray-900">{image.upload_date}</motion.td>
                        <motion.td variants={itemVariants} className="px-4 py-3">
                          <Link
                            to={`/records/${image.id}`}
                            className="bg-gradient-to-r from-gray-900 to-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300"
                          >
                            View Details
                          </Link>
                        </motion.td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card view for small screens */}
        <AnimatePresence>
          <motion.div variants={containerVariants} className="md:hidden space-y-4">
            {filteredImages.map((image, i) => (
              <motion.div 
                key={image.id} 
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="hidden"
                whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-sm p-4 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <motion.span 
                    variants={itemVariants}
                    className="text-sm font-medium text-gray-900"
                  >
                    {image.id}
                  </motion.span>
                </div>
                <motion.h3 
                  variants={itemVariants}
                  className="text-lg font-semibold text-gray-900 mb-1"
                >
                  {image.custom_id || 'N/A'}
                </motion.h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                  <motion.div variants={itemVariants} className="text-gray-500">Upload Date:</motion.div>
                  <motion.div variants={itemVariants} className="text-gray-900">{image.upload_date}</motion.div>
                </div>
                <Link
                  to={`/records/${image.id}`}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-300 text-center block"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {filteredImages.length === 0 && (
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-10 bg-white rounded-xl shadow-md"
            >
              <motion.p 
                variants={itemVariants}
                className="text-gray-500"
              >
                No images found matching your criteria.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </motion.div>
  );
};

export default Records;