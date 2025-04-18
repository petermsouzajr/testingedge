import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid'; // Or your chosen icon library

interface SelectableCardProps {
  label: string;
  description?: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  label,
  description,
  name,
  checked,
  onChange,
}) => {
  const baseClasses =
    'relative border rounded-lg p-4 cursor-pointer transition-all duration-150 min-h-[100px] flex flex-col items-center justify-center text-center';
  // --- Style Adaptation Required ---
  // Adapt these Tailwind classes to match your landing page theme (colors, borders, shadows).
  const defaultStateStyles =
    'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400'; // Example: Use project's neutral/secondary colors
  const checkedStateStyles =
    'bg-blue-600 text-white border-blue-700 ring-2 ring-white ring-offset-2 ring-offset-blue-600 shadow-md'; // Example: Use project's primary color

  const handleClick = () => {
    // Simulate a checkbox change event
    const syntheticEvent = {
      target: {
        name,
        type: 'checkbox',
        checked: !checked,
      },
      // Add other properties if needed by your handler, but target should suffice
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div
      className={`${baseClasses} ${checked ? checkedStateStyles : defaultStateStyles}`}
      onClick={handleClick}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleClick();
        }
      }} // Allow space/enter toggle, prevent page scroll on space
    >
      {/* Hidden but functional checkbox for accessibility and semantics */}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange} // Allow direct change if focused (though visually hidden)
        className="sr-only" // Visually hidden
        tabIndex={-1} // Remove from tab order (handled by div)
        aria-hidden="true"
      />

      {/* Visible Check Icon when checked */}
      {checked && (
        <CheckIcon className="absolute top-2 left-2 w-5 h-5 text-white z-20" /> // Style as needed
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Optional: Icon could go here */}
        <span className="font-semibold block">{label}</span>
        {description && (
          <span className="text-xs mt-1 block">{description}</span>
        )}
      </div>
    </div>
  );
};

export default SelectableCard;
