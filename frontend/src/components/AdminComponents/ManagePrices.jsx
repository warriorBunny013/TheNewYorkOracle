import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Edit, 
  Save, 
  X, 
  TrendingUp,
  Package,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';
import { API_URL } from '../../utils/apiConfig';

function ManagePrices() {
  const [prices, setPrices] = useState([]);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updatingPrice, setUpdatingPrice] = useState(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/prices`);
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = async (id) => {
    try {
      setUpdatingPrice(id);
      const response = await fetch(`${API_URL}/api/prices/${id}`, {
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
    } finally {
      setUpdatingPrice(null);
    }
  };

  const categorizedPrices = prices.reduce((acc, price) => {
    const { type } = price;
    if (!acc[type]) acc[type] = [];
    acc[type].push(price);
    return acc;
  }, {});

  // Filter prices based on search and category
  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || price.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: prices.length,
    averagePrice: prices.length > 0 ? (prices.reduce((sum, p) => sum + parseFloat(p.price), 0) / prices.length).toFixed(0) : 0,
    highestPrice: Math.max(...prices.map(p => parseFloat(p.price) || 0)),
    categories: Object.keys(categorizedPrices).length
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'express reading': Clock,
      'live reading': Star,
      'mentorship': Package,
      'general': CheckCircle,
      'love': TrendingUp,
      'career': AlertCircle
    };
    return icons[category.toLowerCase()] || Package;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'express reading': 'from-blue-500 to-blue-600',
      'live reading': 'from-purple-500 to-purple-600',
      'mentorship': 'from-green-500 to-green-600',
      'general': 'from-orange-500 to-orange-600',
      'love': 'from-pink-500 to-pink-600',
      'career': 'from-indigo-500 to-indigo-600'
    };
    return colors[category.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manage Prices</h1>
          <p className="text-gray-400 mt-1">Update and manage your service pricing</p>
        </div>
        <motion.button
          onClick={fetchPrices}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300"
        >
          <DollarSign className="w-4 h-4" />
          Refresh Prices
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Services</p>
              <p className="text-white font-bold text-xl">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg Price</p>
              <p className="text-white font-bold text-xl">${stats.averagePrice}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Highest Price</p>
              <p className="text-white font-bold text-xl">${stats.highestPrice}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Categories</p>
              <p className="text-white font-bold text-xl">{stats.categories}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {Object.keys(categorizedPrices).map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Prices Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading prices...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPrices.map((price, index) => {
              const IconComponent = getCategoryIcon(price.type);
              const categoryColor = getCategoryColor(price.type);
              
    return (
                <motion.div
                  key={price._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300 group"
                >
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${categoryColor} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{price.title}</h3>
                        <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                          {price.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {price.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                {editingPriceId === price._id ? (
                        <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                            className="w-20 px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Price"
                    />
                          <motion.button
                            onClick={() => handlePriceChange(price._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={updatingPrice === price._id}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                          >
                            {updatingPrice === price._id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </motion.button>
                          <motion.button
                      onClick={() => {
                        setEditingPriceId(null);
                        setNewPrice('');
                      }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-green-400">${price.price}</span>
                          <motion.button
                      onClick={() => {
                        setEditingPriceId(price._id);
                        setNewPrice(price.price);
                      }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                        </div>
                )}
              </div>
            </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty State */}
      {filteredPrices.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <DollarSign className="w-16 h-16 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </motion.div>
      )}
    </div>
  );
}

export default ManagePrices;
