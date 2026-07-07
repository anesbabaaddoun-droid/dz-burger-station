'use client';

import { useState, useMemo, useCallback } from 'react';
import { Trash2, Edit3, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFirestoreCollection } from '@/hooks/useFirestoreCollection';
import { useApiMutation } from '@/hooks/useApiMutation';

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  displayOrder: number;
}

interface MenuItemData {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
  availability: string;
  basePrice: number;
  ingredients: string[];
}

interface NewProductPayload {
  name: string;
  description: string;
  categoryId: string;
  basePrice: number;
  ingredients: string[];
}

export default function MenuPage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useFirestoreCollection('categories', 'displayOrder');
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useFirestoreCollection('menuItems');

  const categories = categoriesData as unknown as Category[];
  const products = productsData as unknown as MenuItemData[];

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');

  // Add Product form fields
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: mutatePatch } = useApiMutation<Partial<MenuItemData>>('', 'PATCH');
  const { mutate: mutateDelete } = useApiMutation<undefined>('', 'DELETE');
  const { mutate: mutateCreate } = useApiMutation<NewProductPayload>('/api/menu', 'POST');

  const activeCategory = selectedCategory ?? categories[0]?.id;

  const categoryProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategory),
    [products, activeCategory]
  );

  const resetAddForm = () => {
    setShowAddProduct(false);
    setIngredients([]);
    setIngredientInput('');
    setNewName('');
    setNewDescription('');
    setNewCategory('');
    setNewPrice('');
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleDeleteProduct = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await mutateDelete(undefined, `/api/menu/${id}`);
      if (success) refetchProducts();
    }
  }, [mutateDelete, refetchProducts]);

  const handleToggleAvailability = useCallback(async (id: string, currentlyAvailable: boolean) => {
    const newAvailability = currentlyAvailable ? 'unavailable' : 'available';
    const success = await mutatePatch({ availability: newAvailability }, `/api/menu/${id}`);
    if (success) refetchProducts();
  }, [mutatePatch, refetchProducts]);

  const handleSaveNewProduct = useCallback(async () => {
    if (!newName.trim() || !newCategory || !newPrice || ingredients.length === 0) {
      alert('Please fill in all required fields (name, category, price, ingredients).');
      return;
    }

    setIsSubmitting(true);
    const success = await mutateCreate({
      name: newName.trim(),
      description: newDescription.trim(),
      categoryId: newCategory,
      basePrice: Number(newPrice),
      ingredients,
    });
    setIsSubmitting(false);

    if (success) {
      refetchProducts();
      resetAddForm();
    } else {
      alert('Failed to save product. Please try again.');
    }
  }, [newName, newDescription, newCategory, newPrice, ingredients, mutateCreate, refetchProducts]);

  if (categoriesLoading || productsLoading) {
    return <div className="py-24 text-center text-[#6B7280]">Loading menu…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Menu Management</h1>
          <p className="text-[#6B7280] mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => {
            setNewCategory(activeCategory ?? categories[0]?.id ?? '');
            setShowAddProduct(true);
          }}
          className="flex items-center gap-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="h-5 w-5" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
            <h3 className="font-bold text-[#1A1A1A] mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-semibold text-sm ${activeCategory === cat.id
                      ? 'bg-[#B91C1C] text-white'
                      : 'bg-gray-100 text-[#1A1A1A] hover:bg-gray-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="font-bold text-[#1A1A1A]">
                {categories.find((c) => c.id === activeCategory)?.name} Products
              </h3>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="w-full">
                {/* Mobile View: Cards */}
                <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="border border-[#E5E7EB] rounded-lg p-4 flex gap-4">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-[#1A1A1A] truncate">{product.name}</p>
                          <p className="font-bold text-[#B91C1C] mt-1">{product.basePrice.toLocaleString()} DA</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={product.availability === 'available'}
                              onChange={() => handleToggleAvailability(product.id, product.availability === 'available')}
                              className="h-4 w-4 rounded accent-[#22C55E]"
                            />
                            <span className="text-xs text-[#6B7280]">Available</span>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/admin/menu/edit/${product.id}`} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center justify-center">
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Image</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-[#6B7280]">Price</th>
                        <th className="text-center py-3 px-4 font-semibold text-sm text-[#6B7280]">Status</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm text-[#6B7280]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.map((product) => (
                        <tr key={product.id} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-200">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                            <p className="text-xs text-[#6B7280]">{product.description.substring(0, 40)}...</p>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-[#B91C1C]">{product.basePrice.toLocaleString()} DA</p>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={product.availability === 'available'}
                                onChange={() => handleToggleAvailability(product.id, product.availability === 'available')}
                                className="h-5 w-5 rounded accent-[#22C55E]"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <Link href={`/admin/menu/edit/${product.id}`} className="inline-block p-2 hover:bg-blue-100 rounded-lg text-blue-600">
                              <Edit3 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="inline-block p-2 hover:bg-red-100 rounded-lg text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#6B7280]">No products in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal — now fully functional */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-end sm:justify-center z-[100] p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 box-border">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E5E7EB] shrink-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">Add New Product</h2>
              <button
                onClick={resetAddForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 box-border w-full">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Product Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Base Price (DA)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Ingredients *</label>
                <div className="flex gap-2 mb-2">
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
                    className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B91C1C]"
                  />
                  <button
                    onClick={handleAddIngredient}
                    className="px-4 py-2 bg-[#B91C1C] text-white font-semibold rounded-lg hover:bg-[#991B1B]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C] text-white rounded-full text-sm"
                    >
                      {ing}
                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="hover:opacity-70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 shrink-0 bg-white border-t border-[#E5E7EB]">
                <button
                  onClick={resetAddForm}
                  className="flex-1 px-4 py-3 sm:py-2 border-2 border-[#E5E7EB] text-[#1A1A1A] font-semibold rounded-full hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewProduct}
                  disabled={ingredients.length === 0 || isSubmitting}
                  className="flex-1 px-4 py-3 sm:py-2 bg-[#B91C1C] text-white font-semibold rounded-full hover:bg-[#991B1B] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}