import React from 'react';
import { ShoppingCart, Lock, CheckCircle, Package, CreditCard, Utensils, ArrowRight } from 'lucide-react';

export default function ProcessFlow() {
  const steps = [
    {
      id: 1,
      title: 'Select Your Meals',
      subtitle: 'Add to Cart',
      icon: ShoppingCart,
    },
    {
      id: 2,
      title: 'Secure Checkout',
      subtitle: 'Placed',
      icon: Lock,
    },
    {
      id: 3,
      title: 'Order Accepted',
      subtitle: 'Accepted',
      icon: CheckCircle,
    },
    {
      id: 4,
      title: 'Time to Prepare',
      subtitle: 'Preparing',
      icon: Package,
    },
    {
      id: 5,
      title: 'Visit & finish payment',
      subtitle: 'Complete',
      icon: CreditCard,
    },
    {
      id: 6,
      title: 'Enjoy Your Meal',
      subtitle: 'Yummy!',
      icon: Utensils,
    },
  ];

  return (
    <div className="w-full py-10 bg-white">
      <div className="max-w-5xl mx-auto px-4">

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">From Cart to Pickup</h2>
          <p className="text-gray-500 text-sm">Simple 6-step process to enjoy your meal</p>
        </div>

        {/* Unified Responsive Horizontal Layout */}
        <div className="flex items-start justify-between w-full max-w-5xl mx-auto transition-all duration-300">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                {/* Step Item */}
                <div className="flex flex-col items-center flex-1 min-w-0 group">
                  {/* Circle */}
                  <div className="
                    w-8 h-8 
                    sm:w-10 sm:h-10 
                    md:w-12 md:h-12 
                    lg:w-14 lg:h-14 
                    rounded-full bg-amber-400 
                    flex items-center justify-center 
                    shadow-md hover:scale-110 
                    transition-all duration-300 cursor-pointer 
                    flex-shrink-0
                  ">
                    <Icon className="
                      w-4 h-4 
                      sm:w-5 sm:h-5 
                      md:w-5 md:h-5 
                      lg:w-6 lg:h-6 
                      text-white transition-all duration-300" 
                      strokeWidth={2} 
                    />
                  </div>
                  
                  {/* Labels Container */}
                  <div className="mt-2 flex flex-col items-center w-full px-0.5">
                    <p className="
                      text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs 
                      font-bold text-gray-800 text-center leading-tight 
                      transition-all duration-300 break-words w-full"
                    >
                      {step.title}
                    </p>
                    <p className="
                      text-[6px] sm:text-[8px] md:text-[9px] lg:text-[10px] 
                      text-gray-400 text-center leading-tight 
                      transition-all duration-300 mt-0.5"
                    >
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center h-8 sm:h-10 md:h-12 lg:h-14 flex-shrink-0 px-0.5 sm:px-1">
                    <ArrowRight className="
                      w-3 h-3 
                      sm:w-4 sm:h-4 
                      md:w-4 md:h-4 
                      lg:w-5 lg:h-5 
                      text-amber-400 transition-all duration-300" 
                      strokeWidth={2.5} 
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </div>
  );
}