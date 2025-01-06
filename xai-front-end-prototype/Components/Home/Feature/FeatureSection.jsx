import React from 'react';
// import { FaClipboardCheck, FaRocket, FaUsers } from 'react-icons/fa';
import { FaClipboardCheck } from "react-icons/fa6";

export default function FeatureSection() {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empowering healthcare professionals with advanced diagnostic tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              {/* <FaClipboardCheck className="text-blue-600 text-3xl" /> */}
             

            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">High Accuracy</h3>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Precision
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our AI diagnostic tools provide unmatched accuracy, ensuring reliable results for medical professionals.
              </p>
            </div>
          </div>

          {/* Second Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              {/* <FaRocket className="text-blue-600 text-3xl" /> */}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Rapid Processing</h3>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Speed
              </p>
              <p className="text-gray-600 leading-relaxed">
                Experience lightning-fast analysis, allowing for quicker decision-making and patient care.
              </p>
            </div>
          </div>

          {/* Third Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="flex justify-center items-center w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              {/* <FaUsers className="text-blue-600 text-3xl" /> */}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">User-Friendly Interface</h3>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider">
                Usability
              </p>
              <p className="text-gray-600 leading-relaxed">
                Intuitive design tailored for medical professionals, making navigation and use effortless.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}