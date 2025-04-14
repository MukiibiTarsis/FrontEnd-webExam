import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API_URL:', import.meta.env.VITE_API_URL);

export function useApi(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchData = async () => {
      if (!user?.token) {
        setError('Please log in to view data');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          cancelToken: source.token,
        });
        const mappedData = response.data.data.map((item) => ({
          ...item,
          dealerName: item.dealer_name,
          sellingPrice: item.selling_price,
          produceName: item.name,
        }));
        setData({ ...response.data, data: mappedData });
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (endpoint) {
      fetchData();
    }
    return () => source.cancel('Request cancelled');
  }, [endpoint, user?.token]);

  const execute = async (payload, method = 'POST') => {
    setLoading(true);
    try {
      const cleanPayload = {
        name: String(payload.produceName),
        type: String(payload.type),
        date: String(payload.date),
        time: String(payload.time),
        tonnage: parseFloat(payload.tonnage),
        cost: parseFloat(payload.cost),
        dealer_name: String(payload.dealerName),
        branch: String(payload.branch),
        contact: String(payload.contact),
        selling_price: parseFloat(payload.sellingPrice),
      };
      const response = await axios({
        method,
        url: `${API_URL}/${endpoint}`,
        data: cleanPayload,
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });
      const newData = {
        ...response.data.data,
        dealerName: response.data.data.dealer_name,
        sellingPrice: response.data.data.selling_price,
        produceName: response.data.data.name,
      };
      setData((prev) =>
        prev ? { ...prev, data: [...prev.data, newData] } : { data: [newData] }
      );
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}