import React, { useState } from 'react';

const LiquorComparisonComp = ({ isOpen, onClose, allDrinks }) => {
  const [selectedDrink1, setSelectedDrink1] = useState(null);
  const [selectedDrink2, setSelectedDrink2] = useState(null);

  if (!isOpen) return null;

  const handleSelectDrink1 = (e) => {
    const drink = allDrinks.find(d => d.id === e.target.value);
    setSelectedDrink1(drink);
  };

  const handleSelectDrink2 = (e) => {
    const drink = allDrinks.find(d => d.id === e.target.value);
    setSelectedDrink2(drink);
  };

  const ComparisonCard = ({ drink, onSelect, selectedId }) => (
    <div className="flex-1">
      <select
        onChange={onSelect}
        value={selectedId || ''}
        className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4 text-neutral-900"
      >
        <option value="">Select a drink...</option>
        {allDrinks.map((drink) => (
          <option key={drink.id} value={drink.id}>
            {drink.name}
          </option>
        ))}
      </select>

      {drink ? (
        <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
          <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 p-8 flex items-center justify-center h-64">
            <img
              src={drink.image}
              alt={drink.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="p-6">
            <div className="inline-block px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded mb-3">
              {drink.category}
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">{drink.name}</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600 text-sm">Price</span>
                <span className="text-lg font-bold text-amber-600">${drink.price}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600 text-sm">Alcohol %</span>
                <span className="text-lg font-semibold text-neutral-900">{drink.alcoholPercentage}%</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                <span className="text-neutral-600 text-sm">Volume</span>
                <span className="text-lg font-semibold text-neutral-900">{drink.volume}</span>
              </div>

              {drink.origin && (
                <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600 text-sm">Origin</span>
                  <span className="text-sm font-semibold text-neutral-900">{drink.origin}</span>
                </div>
              )}

              {drink.brand && (
                <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                  <span className="text-neutral-600 text-sm">Brand</span>
                  <span className="text-sm font-semibold text-neutral-900">{drink.brand}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-neutral-100 rounded-xl border-2 border-dashed border-neutral-300 h-96 flex items-center justify-center">
          <p className="text-neutral-400 text-center">
            Select a drink to compare
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-50 rounded-2xl max-w-6xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-900 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Compare Drinks</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <ComparisonCard
              drink={selectedDrink1}
              onSelect={handleSelectDrink1}
              selectedId={selectedDrink1?.id}
            />

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                VS
              </div>
            </div>

            <ComparisonCard
              drink={selectedDrink2}
              onSelect={handleSelectDrink2}
              selectedId={selectedDrink2?.id}
            />
          </div>

          {selectedDrink1 && selectedDrink2 && (
            <div className="mt-6 bg-white rounded-xl p-6 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Comparison Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-1">Price Difference</p>
                  <p className="text-2xl font-bold text-amber-600">
                    ${Math.abs(selectedDrink1.price - selectedDrink2.price).toFixed(2)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {selectedDrink1.price < selectedDrink2.price
                      ? `${selectedDrink1.name} is cheaper`
                      : selectedDrink1.price > selectedDrink2.price
                      ? `${selectedDrink2.name} is cheaper`
                      : 'Same price'}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-1">Alcohol % Difference</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.abs(selectedDrink1.alcoholPercentage - selectedDrink2.alcoholPercentage).toFixed(1)}%
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    {selectedDrink1.alcoholPercentage > selectedDrink2.alcoholPercentage
                      ? `${selectedDrink1.name} is stronger`
                      : selectedDrink1.alcoholPercentage < selectedDrink2.alcoholPercentage
                      ? `${selectedDrink2.name} is stronger`
                      : 'Same strength'}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-neutral-600 mb-1">Best Value</p>
                  <p className="text-lg font-bold text-amber-600">
                    {(selectedDrink1.price / selectedDrink1.alcoholPercentage) <
                    (selectedDrink2.price / selectedDrink2.alcoholPercentage)
                      ? selectedDrink1.name
                      : selectedDrink2.name}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">Based on price per alcohol %</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquorComparisonComp;