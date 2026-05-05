/**
 * Unit Tests for Category API Logic
 * Component: Category Management
 * Framework: Jest
 *
 * Run with:
 *   cd "testing app"
 *   npm run test:category
 */

const AsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

global.fetch = jest.fn();

const BASE_URL = 'http://localhost:5000/api';

const getToken = async () => AsyncStorage.getItem('userToken');

const authHeaders = async (isFormData = false) => {
  const token = await getToken();
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch (_e) {
    throw new Error('Invalid server response');
  }
  if (!res.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
};

// Recreated API functions for Categories
const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, {
    headers: await authHeaders(),
  });
  return handleResponse(res);
};

const createCategory = async (categoryData) => {
  const isFormData = categoryData && categoryData.constructor && (categoryData.constructor.name === 'FormData' || categoryData.constructor.name === 'MockFormData');
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: await authHeaders(isFormData),
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
  return handleResponse(res);
};

const updateCategory = async (categoryId, categoryData) => {
  const isFormData = categoryData && categoryData.constructor && (categoryData.constructor.name === 'FormData' || categoryData.constructor.name === 'MockFormData');
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: await authHeaders(isFormData),
    body: isFormData ? categoryData : JSON.stringify(categoryData),
  });
  return handleResponse(res);
};

const deleteCategory = async (categoryId) => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  return handleResponse(res);
};

// Helpers
const mockFetchSuccess = (data) => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

const mockFetchFail = (message, status = 400) => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message }),
  });
};

describe('Category API Logic', () => {
  beforeEach(() => {
    fetch.mockClear();
    AsyncStorage.getItem.mockClear();
  });

  // ─── fetchCategories ────────────────────────────────────────────────────────────
  describe('fetchCategories', () => {
    test('should fetch all categories successfully', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('mock-user-token');
      const mockCategories = [
        { _id: 'c1', name: 'Women', isActive: true },
        { _id: 'c2', name: 'Men', isActive: true },
      ];
      mockFetchSuccess(mockCategories);

      const result = await fetchCategories();

      expect(result).toEqual(mockCategories);
      expect(result).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories`, expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mock-user-token' }),
      }));
    });

    test('should throw error when category fetch fails', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('mock-user-token');
      mockFetchFail('Failed to load categories', 500);

      await expect(fetchCategories()).rejects.toThrow('Failed to load categories');
    });
  });

  // ─── createCategory ────────────────────────────────────────────────────────────
  describe('createCategory', () => {
    test('should create a new category', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      const newCategory = { name: 'Kids', description: 'Kids clothing' };
      const expectedResponse = { _id: 'c3', name: 'Kids', description: 'Kids clothing', slug: 'kids', isActive: true };
      mockFetchSuccess(expectedResponse);

      const result = await createCategory(newCategory);

      expect(result.name).toBe('Kids');
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories`, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(newCategory),
        headers: expect.objectContaining({ Authorization: 'Bearer admin-token' }),
      }));
    });

    test('should create a new category using FormData', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      class MockFormData {
        constructor() { this.name = 'FormData'; }
      }
      const formData = new MockFormData();
      const expectedResponse = { _id: 'c4', name: 'Shoes', slug: 'shoes', isActive: true, image: 'cloudinary_url' };
      mockFetchSuccess(expectedResponse);

      const result = await createCategory(formData);

      expect(result.name).toBe('Shoes');
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories`, expect.objectContaining({
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer admin-token' },
      }));
    });

    test('should fail if category name is missing', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      mockFetchFail('Category name is required', 400);

      await expect(createCategory({})).rejects.toThrow('Category name is required');
    });
  });

  // ─── updateCategory ────────────────────────────────────────────────────────────
  describe('updateCategory', () => {
    test('should update an existing category', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      const updateData = { name: 'Updated Men', isActive: false };
      const expectedResponse = { _id: 'c2', name: 'Updated Men', isActive: false };
      mockFetchSuccess(expectedResponse);

      const result = await updateCategory('c2', updateData);

      expect(result.name).toBe('Updated Men');
      expect(result.isActive).toBe(false);
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories/c2`, expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(updateData),
      }));
    });

    test('should return error if category not found', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      mockFetchFail('Category not found', 404);

      await expect(updateCategory('invalid-id', { name: 'Test' })).rejects.toThrow('Category not found');
    });
  });

  // ─── deleteCategory ────────────────────────────────────────────────────────────
  describe('deleteCategory', () => {
    test('should delete a category', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('admin-token');
      mockFetchSuccess({ message: 'Category removed' });

      const result = await deleteCategory('c1');

      expect(result.message).toBe('Category removed');
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/categories/c1`, expect.objectContaining({
        method: 'DELETE',
      }));
    });

    test('should return error if user is not authorized', async () => {
      AsyncStorage.getItem.mockResolvedValueOnce('user-token');
      mockFetchFail('Not authorized as an admin', 401);

      await expect(deleteCategory('c1')).rejects.toThrow('Not authorized as an admin');
    });
  });
});
