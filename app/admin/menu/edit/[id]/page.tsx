'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { menuItems, categories } from '@/lib/mock-data';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<typeof menuItems[0] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  
  useEffect(() => {
    const foundProduct = menuItems.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setName(foundProduct.name);
      setDescription(foundProduct.description);
      setBasePrice(foundProduct.basePrice);
      setCategory(foundProduct.categoryId);
      setIngredients(foundProduct.ingredients || []);
    }
  }, [id]);

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    // Save logic
    alert('Product updated successfully!');
    router.push('/admin/menu');
  };

  if (!product) {
    return <div className="p-10 text-center">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/menu" className="p-2 hover:bg-gray-100 admin-dark:hover:bg-[#111111] rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] admin-dark:text-white">Edit Product</h1>
            <p className="text-[#6B7280] admin-dark:text-[#A1A1AA] mt-1">Modify details for {product.name}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Save className="h-5 w-5" /> Save Changes
        </button>
      </div>

      <div className="bg-white admin-dark:bg-[#000000] rounded-xl border border-[#E5E7EB] admin-dark:border-[#2E2E2E] overflow-hidden shadow-sm">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] admin-dark:text-white mb-2">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] admin-dark:bg-[#000000] admin-dark:border-[#000000] admin-dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] admin-dark:text-white mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] admin-dark:bg-[#000000] admin-dark:border-[#000000] admin-dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] admin-dark:text-white mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] admin-dark:bg-[#000000] admin-dark:border-[#000000] admin-dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] admin-dark:text-white mb-2">Base Price (DA)</label>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-full md:w-1/2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] admin-dark:bg-[#000000] admin-dark:border-[#000000] admin-dark:text-white"
            />
          </div>

          <div className="pt-4 border-t border-[#E5E7EB] admin-dark:border-[#2E2E2E]">
            <label className="block text-sm font-semibold text-[#1A1A1A] admin-dark:text-white mb-2">Ingredients</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                placeholder="Type ingredient and press Enter"
                className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C] admin-dark:bg-[#000000] admin-dark:border-[#000000] admin-dark:text-white"
              />
              <button
                onClick={handleAddIngredient}
                className="px-5 py-2.5 bg-gray-900 admin-dark:bg-white text-white admin-dark:text-black font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 admin-dark:bg-[#1A1A1A] text-gray-800 admin-dark:text-white rounded-lg border border-transparent admin-dark:border-[#2E2E2E] text-sm"
                >
                  {ing}
                  <button
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {ingredients.length === 0 && (
                <p className="text-sm text-gray-400">No ingredients added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
