
import React, { useState } from 'react';
import { Medicine } from '../types';
import { Search, Package, Edit2, X, DollarSign, Save, Percent, Upload, Image as ImageIcon, Plus } from 'lucide-react';

interface Props {
  medicines: Medicine[];
  onUpdate: (medicines: Medicine[]) => void;
}

const InventoryManager: React.FC<Props> = ({ medicines, onUpdate }) => {
  const [filter, setFilter] = useState('');
  
  // Edit State
  const [editingItem, setEditingItem] = useState<Medicine | null>(null);
  const [editForm, setEditForm] = useState<Partial<Medicine>>({});

  // Add New State
  const [isAdding, setIsAdding] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Partial<Medicine>>({
    name: '',
    category: 'General',
    price: 0,
    discount: 0,
    inStock: true,
    packSize: '1 Pack',
    description: '',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400' // Default placeholder
  });

  const toggleStock = (id: string) => {
    const updated = medicines.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock } : item
    );
    onUpdate(updated);
  };

  // --- Edit Logic ---
  const startEdit = (item: Medicine) => {
    setEditingItem(item);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const updated = medicines.map(item => 
      item.id === editingItem.id ? { ...item, ...editForm } : item
    );
    onUpdate(updated);
    setEditingItem(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNew) {
            setNewItemForm(prev => ({ ...prev, image: reader.result as string }));
        } else {
            setEditForm(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Add Logic ---
  const saveNewItem = () => {
    if (!newItemForm.name || !newItemForm.price) {
        alert("Name and Price are required!");
        return;
    }

    const newMedicine: Medicine = {
        id: `MED-NEW-${Date.now()}`,
        name: newItemForm.name || 'New Medicine',
        category: newItemForm.category || 'General',
        description: newItemForm.description || '',
        price: Number(newItemForm.price),
        discount: Number(newItemForm.discount) || 0,
        image: newItemForm.image || '',
        inStock: true,
        packSize: newItemForm.packSize || '1 Unit',
        uses: [], // Defaults
        sideEffects: [],
        safetyAdvice: {},
        stockQuantity: newItemForm.stockQuantity || 100 // Default stock for new items
    };

    onUpdate([newMedicine, ...medicines]); // Add to top of list
    setIsAdding(false);
    setNewItemForm({ // Reset form
        name: '', category: 'General', price: 0, discount: 0, inStock: true, packSize: '1 Pack', description: '', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400'
    });
  };

  const filteredItems = medicines.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[500px] flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" /> Inventory Management
        </h2>
        
        <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search medicines..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-4 h-4" /> <span className="hidden md:inline">Add Product</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                    <div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.category}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{item.packSize} • {item.stockQuantity ?? 0} left</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-slate-600 font-bold">₹{item.price}</td>
                <td className="p-4 font-mono text-green-600 font-bold">
                  {item.discount ? `${item.discount}%` : '-'}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      onClick={() => startEdit(item)}
                      className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Edit Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleStock(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        item.inStock 
                        ? 'border-red-200 text-red-600 hover:bg-red-50' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {item.inStock ? 'Mark OOS' : 'Mark Stock'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="p-12 text-center">
             <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-slate-400" />
             </div>
             <p className="text-slate-500 font-medium">No medicines found</p>
             <p className="text-xs text-slate-400">Try adjusting your search or add a new product.</p>
          </div>
        )}
      </div>

      {/* Edit Overlay */}
      {editingItem && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up border border-white/20">
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                 <h3 className="font-bold flex items-center gap-2 text-sm">
                    <Edit2 className="w-4 h-4" /> Edit {editingItem.name}
                 </h3>
                 <button onClick={cancelEdit} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4 bg-white max-h-[80vh] overflow-y-auto">
                 {/* Image Upload Section */}
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Product Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={editForm.image || editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <label className="flex-1 cursor-pointer">
                         <div className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors">
                            <Upload className="w-4 h-4" /> <span>Change Photo</span>
                         </div>
                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                      </label>
                    </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Price (₹)</label>
                      <input 
                        type="number" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                   <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Discount (%)</label>
                      <input 
                        type="number" 
                        value={editForm.discount || 0} 
                        onChange={e => setEditForm({...editForm, discount: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                 </div>
                 <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Pack Size</label>
                        <input 
                        type="text" 
                        value={editForm.packSize || ''} 
                        onChange={e => setEditForm({...editForm, packSize: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Stock Qty</label>
                        <input 
                        type="number" 
                        value={editForm.stockQuantity || 0} 
                        onChange={e => setEditForm({...editForm, stockQuantity: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                     </div>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Description</label>
                    <textarea 
                      rows={3}
                      value={editForm.description || ''} 
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                 </div>
                 
                 <div className="flex gap-2 pt-2">
                    <button onClick={cancelEdit} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs">Cancel</button>
                    <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs flex items-center justify-center gap-2">
                      <Save className="w-3 h-3" /> Save Changes
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {isAdding && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up border border-white/20">
              <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                 <h3 className="font-bold flex items-center gap-2 text-sm">
                    <Plus className="w-4 h-4" /> Add New Medicine
                 </h3>
                 <button onClick={() => setIsAdding(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4 bg-white max-h-[80vh] overflow-y-auto">
                 {/* Image Upload */}
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Product Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 relative group">
                        <img src={newItemForm.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <label className="flex-1 cursor-pointer">
                         <div className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-xs text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors">
                            <Upload className="w-4 h-4" /> <span>Upload Photo</span>
                         </div>
                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                      </label>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Medicine Name</label>
                    <input 
                      type="text" 
                      value={newItemForm.name} 
                      onChange={e => setNewItemForm({...newItemForm, name: e.target.value})}
                      placeholder="e.g. Paracetamol 500mg"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Category</label>
                    <select
                      value={newItemForm.category}
                      onChange={e => setNewItemForm({...newItemForm, category: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="General">General</option>
                        <option value="Fever & Pain">Fever & Pain</option>
                        <option value="Antibiotics">Antibiotics</option>
                        <option value="Vitamins">Vitamins</option>
                        <option value="Diabetes">Diabetes</option>
                        <option value="Cardiac">Cardiac</option>
                    </select>
                 </div>

                 <div className="flex gap-4">
                   <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Price (₹)</label>
                      <input 
                        type="number" 
                        value={newItemForm.price} 
                        onChange={e => setNewItemForm({...newItemForm, price: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                   <div className="flex-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Discount (%)</label>
                      <input 
                        type="number" 
                        value={newItemForm.discount || 0} 
                        onChange={e => setNewItemForm({...newItemForm, discount: Number(e.target.value)})}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Pack Size</label>
                    <input 
                      type="text" 
                      value={newItemForm.packSize} 
                      onChange={e => setNewItemForm({...newItemForm, packSize: e.target.value})}
                      placeholder="e.g. 10 Tablets / Strip"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Stock Qty</label>
                    <input 
                    type="number" 
                    value={newItemForm.stockQuantity || 100} 
                    onChange={e => setNewItemForm({...newItemForm, stockQuantity: Number(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Description</label>
                    <textarea 
                      rows={3}
                      value={newItemForm.description} 
                      onChange={e => setNewItemForm({...newItemForm, description: e.target.value})}
                      placeholder="Brief details about the medicine..."
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                 </div>
                 
                 <div className="flex gap-2 pt-2">
                    <button onClick={() => setIsAdding(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs">Cancel</button>
                    <button onClick={saveNewItem} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-xs flex items-center justify-center gap-2">
                      <Plus className="w-3 h-3" /> Add Product
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;
