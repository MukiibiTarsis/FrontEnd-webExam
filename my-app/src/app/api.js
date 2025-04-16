const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to parse JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};

// Login
export const login = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('token', data.token);
  return parseJwt(data.token);
};

// Fetch receipts
export const fetchReceipts = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/receipts`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch receipts');
  return data.map(receipt => ({
    receiptID: receipt.ReceiptID,
    amountPaid: `$${receipt.AmountPaid}`,
    salesAgentName: receipt.SalesAgentsName,
    buyerName: receipt.BuyersName,
    produceName: receipt.ProduceName,
  }));
};

// Save receipt
export const saveReceipt = async (receiptData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/receipts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      ReceiptID: receiptData.receiptID,
      AmountPaid: parseFloat(receiptData.amountPaid.replace('$', '')),
      SalesAgentsName: receiptData.salesAgentName,
      BuyersName: receiptData.buyerName,
      ProduceName: receiptData.produceName || 'Unknown',
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save receipt');
  return data;
};

// Fetch produce (for branch-like data)
export const fetchProduce = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/produce`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch produce');
  return data;
};

// Save produce
export const saveProduce = async (produceData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/produce`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(produceData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save produce');
  return data;
};

// Fetch users (CEO only)
export const fetchUsers = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
  return data;
};

// Save sales
export const saveSales = async (salesData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(salesData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save sales');
  return data;
};

// Save credit sales
export const saveCreditSales = async (creditSalesData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/creditsales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(creditSalesData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save credit sales');
  return data;
};

// Save stock
export const saveStock = async (stockData) => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const response = await fetch(`${API_BASE_URL}/stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(stockData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save stock');
  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
};