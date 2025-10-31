import React, { useState } from 'react';
import { ProductType } from '../types';
import { PlusIcon } from './Icons';

interface Product {
  id: ProductType;
  name: string;
  icon: React.ReactElement;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: ProductType[];
  onToggleProduct: (product: ProductType) => void;
  onAddProduct: (productName: string) => void;
  disabled: boolean;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ products, selectedProducts, onToggleProduct, onAddProduct, disabled }) => {
  const [customProductName, setCustomProductName] = useState('');

  const handleAddCustomProduct = () => {
    if (customProductName.trim()) {
      onAddProduct(customProductName.trim());
      setCustomProductName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomProduct();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onToggleProduct(product.id)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500
              ${selectedProducts.includes(product.id)
                ? 'bg-cyan-600 border-cyan-500 text-white'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-cyan-600 text-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="w-10 h-10 mb-2 text-gray-200">{product.icon}</div>
            <span className="font-semibold text-sm text-center">{product.name}</span>
          </button>
        ))}
      </div>
       <div className="flex items-center gap-2 pt-4 border-t border-gray-700/50">
        <input
          type="text"
          value={customProductName}
          onChange={(e) => setCustomProductName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add custom product (e.g., 'Beanie')"
          className="flex-grow p-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 placeholder-gray-400 disabled:opacity-50"
          disabled={disabled}
        />
        <button
          onClick={handleAddCustomProduct}
          disabled={disabled || !customProductName.trim()}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <PlusIcon /> Add
        </button>
      </div>
    </div>
  );
};

export default ProductSelector;