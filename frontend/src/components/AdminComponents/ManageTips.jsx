import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  Search,
  Eye,
  MessageCircle,
  Heart
} from 'lucide-react';
import { API_URL } from '../../utils/apiConfig';

function ManageTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTip, setSelectedTip] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Function to fetch tips from the backend
  const fetchTips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tips`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setTips(data.data);
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tips on component mount
  useEffect(() => {
    fetchTips();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        text: 'Pending'
      },
      completed: {
        icon: CheckCircle,
        color: 'bg-green-500/10 text-green-400 border-green-500/20',
        text: 'Completed'
      },
      failed: {
        icon: XCircle,
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        text: 'Failed'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <IconComponent size={12} />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTips = tips.filter(tip => {
    const matchesSearch = tip.tipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.amount.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || tip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tips.length,
    completed: tips.filter(tip => tip.status === 'completed').length,
    pending: tips.filter(tip => tip.status === 'pending').length,
    totalAmount: tips.reduce((sum, tip) => sum + tip.amount, 0)
  };

  const handleViewMessage = (tip) => {
    setSelectedTip(tip);
    setShowMessageModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Tips</h2>
          <p className="text-gray-400">View and manage all tip transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchTips}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
        >
          <RefreshCw size={16} />
          Refresh
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Tips</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Heart className="text-blue-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Completed</p>
              <p className="text-white text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle className="text-green-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Pending</p>
              <p className="text-white text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-400" size={24} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-sm font-medium">Total Amount</p>
                             <p className="text-white text-2xl font-bold">{stats.totalAmount}</p>
            </div>
            <DollarSign className="text-emerald-400" size={24} />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-colors duration-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors duration-200"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Tips List */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-purple-400" size={24} />
            <span className="ml-2 text-gray-400">Loading tips...</span>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">No tips found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tip ID</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredTips.map((tip, index) => (
                  <motion.tr
                    key={tip.tipId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-mono">{tip.tipId.slice(0, 8)}...</div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                         <DollarSign className="text-emerald-400" size={16} />
                         <span className="text-white font-semibold">{tip.amount}</span>
                       </div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-400" size={16} />
                        <span className="text-gray-300 text-sm">{formatDate(tip.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tip.status)}
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       {tip.message ? (
                         <button
                           onClick={() => handleViewMessage(tip)}
                           className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                         >
                           <MessageCircle size={16} />
                           <span className="text-sm">View Message</span>
                         </button>
                       ) : (
                         <span className="text-gray-500 text-sm">No message</span>
                       )}
                     </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && selectedTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Tip Details</h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                                 <div className="flex items-center justify-between">
                   <span className="text-gray-400">Amount:</span>
                   <span className="text-white font-semibold">{selectedTip.amount}</span>
                 </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{formatDate(selectedTip.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status:</span>
                  {getStatusBadge(selectedTip.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tip ID:</span>
                  <span className="text-white font-mono text-sm">{selectedTip.tipId}</span>
                </div>
                
                {selectedTip.message && (
                  <div className="mt-4">
                    <span className="text-gray-400 block mb-2">Message:</span>
                    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                      <p className="text-white italic">"{selectedTip.message}"</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageTips; 