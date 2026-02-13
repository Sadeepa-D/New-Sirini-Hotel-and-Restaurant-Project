import React from 'react';

const LiquorDetailsComp = ({ drink, isOpen, onClose }) => {
  if (!isOpen || !drink) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-xl p-8 flex items-center justify-center">
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="inline-block px-4 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-full mb-4">
                  {drink.category}
                </div>

                <h2 className="text-3xl font-bold text-neutral-900 mb-2">{drink.name}</h2>
                
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {drink.description || 'Premium quality drink crafted with the finest ingredients.'}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <span className="text-neutral-600 font-medium">Price</span>
                    <span className="text-2xl font-bold text-amber-600">${drink.price}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <span className="text-neutral-600 font-medium">Alcohol Percentage</span>
                    <span className="text-lg font-semibold text-neutral-900">{drink.alcoholPercentage}%</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                    <span className="text-neutral-600 font-medium">Volume</span>
                    <span className="text-lg font-semibold text-neutral-900">{drink.volume}</span>
                  </div>

                  {drink.origin && (
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <span className="text-neutral-600 font-medium">Origin</span>
                      <span className="text-lg font-semibold text-neutral-900">{drink.origin}</span>
                    </div>
                  )}

                  {drink.brand && (
                    <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                      <span className="text-neutral-600 font-medium">Brand</span>
                      <span className="text-lg font-semibold text-neutral-900">{drink.brand}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquorDetailsComp;