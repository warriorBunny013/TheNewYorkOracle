import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';

function ManagePrices() {
  const [prices, setPrices] = useState([]);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/prices');
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
  };

  const handlePriceChange = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/prices/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) {
        throw new Error('Failed to update price');
      }

      const updatedPrice = await response.json();
      setPrices((prevPrices) =>
        prevPrices.map((price) =>
          price._id === updatedPrice._id ? updatedPrice : price
        )
      );

      setEditingPriceId(null);
      setNewPrice('');
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const categorizedPrices = prices.reduce((acc, price) => {
    const { type } = price;
    if (!acc[type]) acc[type] = [];
    acc[type].push(price);
    return acc;
  }, {});

  const renderCards = (category) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {category.map((price) => (
          <div key={price._id} className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col">
            <div className="px-6 py-4 mb-auto">
              <div className="text-lg text-[1.3rem] font-bold text-gray-900 mb-2">{price.title}</div>
              <p className="text-gray-700 text-md mb-4">{price.description}</p>
              <div className="flex items-center flex-wrap gap-2">
                {editingPriceId === price._id ? (
                  <>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="p-2 border max-w-[4rem] md:max-w-40  bg-slate-200 font-bold text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                      placeholder="Enter new price"
                    />
                    <button
                      className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-200 ease-in-out"
                      onClick={() => {
                        setEditingPriceId(null);
                        setNewPrice('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-200 ease-in-out"
                      onClick={() => handlePriceChange(price._id)}
                    >
                      Save
                    </button>
                    
                  </>
                ) : (
                  <>
                    <span className="text-black font-bold text-xl">${price.price}</span>
                    <FaEdit
                      className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out"
                      onClick={() => {
                        setEditingPriceId(price._id);
                        setNewPrice(price.price);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div><div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
    Manage Prices
  </div>
    <div className="flex flex-col items-center">
      {Object.keys(categorizedPrices).map((category) => (
        <div key={category} className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-8">
          <div className="my-5 text-2xl font-bold tracking-tight text-white">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
          {renderCards(categorizedPrices[category])}
        </div>
      ))}
    </div>
    </div>
  );
}

export default ManagePrices;
