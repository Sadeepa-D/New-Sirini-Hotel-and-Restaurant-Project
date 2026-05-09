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
      title: 'Ready for Pickup',
      subtitle: 'Prepared',
      icon: Package,
    },
    {
      id: 5,
      title: 'Payment Completed',
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

        {/* Desktop Layout */}
        <div className="hidden md:flex items-start justify-center gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                {/* Step */}
                <div className="flex flex-col items-center w-20">
                  {/* Circle */}
                  <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  {/* Labels */}
                  <p className="mt-2 text-xs font-semibold text-gray-800 text-center leading-tight">{step.title}</p>
                  <p className="text-xs text-gray-400 text-center leading-tight">{step.subtitle}</p>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-amber-400 mx-1 mt-[-28px] flex-shrink-0" strokeWidth={2} />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Row */}
                <div className="flex items-center gap-4 w-full max-w-xs">
                  {/* Circle */}
                  <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center shadow-md flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>
                  {/* Labels */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{step.title}</p>
                    <p className="text-xs text-gray-400 leading-tight">{step.subtitle}</p>
                  </div>
                </div>

                {/* Down Arrow */}
                {index < steps.length - 1 && (
                  <div className="my-1">
                    <ArrowRight className="w-4 h-4 text-amber-400 rotate-90" strokeWidth={2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}