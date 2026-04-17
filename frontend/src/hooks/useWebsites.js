import { useState, useEffect, useCallback } from "react";
import { websiteApi } from "../lib/api";
import toast from "react-hot-toast";

export function useWebsites(params = {}) {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWebsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await websiteApi.getAll(params);
      setWebsites(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load websites");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchWebsites(); }, [fetchWebsites]);

  const createWebsite = async (data) => {
    const res = await websiteApi.create(data);
    setWebsites((prev) => [res.data.data, ...prev]);
    toast.success("Website added!");
    return res.data.data;
  };

  const updateWebsite = async (id, data) => {
    const res = await websiteApi.update(id, data);
    setWebsites((prev) =>
      prev.map((w) => (w._id === id ? res.data.data : w))
    );
    toast.success("Website updated!");
    return res.data.data;
  };

  const deleteWebsite = async (id) => {
    await websiteApi.delete(id);
    setWebsites((prev) => prev.filter((w) => w._id !== id));
    toast.success("Website deleted!");
  };

  const reorderWebsites = async (newOrder) => {
    setWebsites(newOrder);
    const items = newOrder.map((w, idx) => ({ id: w._id, order: idx }));
    await websiteApi.reorder(items);
  };

  return {
    websites,
    loading,
    error,
    refetch: fetchWebsites,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    reorderWebsites,
  };
}
