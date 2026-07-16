"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine API base URL dynamically
  const getApiBaseUrl = () => {
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost") {
        return "https://bazary-backend.vercel.app";
      }
    }
    return "https://bazary-backend.vercel.app";
  };

  const API_BASE_URL = getApiBaseUrl();
  const WISHLIST_API_URL = `${API_BASE_URL}/api/events/wishlist`;

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const getOrCreateGuestId = () => {
    if (typeof window === "undefined") return "test-guest-123";
    let guestId = localStorage.getItem("x-guest-id");
    if (!guestId) {
      guestId = `guest-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("x-guest-id", guestId);
    }
    return guestId;
  };

  // Helper to construct headers
  const getHeaders = (includeGuestHeader = true) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = getToken();
    if (token && token !== "undefined" && token !== "null") {
      headers["Authorization"] = `Bearer ${token}`;
    } else if (includeGuestHeader) {
      headers["x-guest-id"] = getOrCreateGuestId();
    }
    return headers;
  };

  // Fetch Wishlist
  const getWishlist = async () => {
    const token = getToken();
    if (token && token !== "undefined" && token !== "null") {
      try {
        const headers = getHeaders();
        const res = await fetch(WISHLIST_API_URL, { headers });

        if (res.ok) {
          const data = await res.json();
          if (data && data.data) {
            setWishlist(data.data);
          } else {
            setWishlist({ items: [] });
          }
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    } else {
      // Load from localStorage for guest
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("bazaarna-guest-wishlist");
        if (stored) {
          try {
            const items = JSON.parse(stored);
            setWishlist({ items });
          } catch (e) {
            setWishlist({ items: [] });
          }
        } else {
          setWishlist({ items: [] });
        }
      }
    }
  };

  // Merge guest wishlist into customer wishlist on login
  const mergeGuestWishlist = async () => {
    if (typeof window === "undefined") return;
    const token = getToken();
    const stored = localStorage.getItem("bazaarna-guest-wishlist");

    if (token && token !== "undefined" && token !== "null" && stored) {
      try {
        const items = JSON.parse(stored);
        if (items && items.length > 0) {
          // Post each item to the backend wishlist API (authenticated)
          for (const item of items) {
            const productId = item.productId?._id || item.productId;
            const bazaarId = item.bazaarId?._id || item.bazaarId;
            if (productId) {
              await fetch(WISHLIST_API_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, bazaarId }),
              });
            }
          }
        }
        localStorage.removeItem("bazaarna-guest-wishlist");
      } catch (err) {
        console.error("Error merging wishlist:", err);
      }
      await getWishlist();
    }
  };

  // Toggle wishlist (with Optimistic UI updates)
  const toggleWishlist = async (product, bazaarId) => {
    const productId = product._id || product;
    const isCurrentlyWishlisted = isInWishlist(productId);
    const token = getToken();

    if (token && token !== "undefined" && token !== "null") {
      // Logged in user flow - Use Backend API
      const previousWishlist = { ...wishlist };

      // 1. Optimistic Update
      if (isCurrentlyWishlisted) {
        // Remove from list
        setWishlist((prev) => ({
          ...prev,
          items: prev.items.filter(
            (item) => (item.productId?._id || item.productId) !== productId
          ),
        }));
      } else {
        // Add to list
        const newItem = {
          productId: product, // Store the full product object so Wishlist page can render it immediately
          bazaarId: bazaarId,
        };
        setWishlist((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
      }

      // 2. Perform API request
      try {
        if (isCurrentlyWishlisted) {
          // DELETE /api/events/wishlist/:productId?bazaarId=:bazaarId
          const url = `${WISHLIST_API_URL}/${productId}${
            bazaarId ? `?bazaarId=${bazaarId}` : ""
          }`;
          const res = await fetch(url, {
            method: "DELETE",
            headers: getHeaders(),
          });

          if (!res.ok) {
            throw new Error("Failed to remove item from wishlist");
          }
        } else {
          // POST /api/events/wishlist
          const res = await fetch(WISHLIST_API_URL, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              productId,
              bazaarId,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to add item to wishlist");
          }
        }

        // 3. Re-fetch wishlist to ensure we have the most accurate/populated data from backend
        await getWishlist();
      } catch (err) {
        console.error(err);
        // Rollback to previous state on error
        setWishlist(previousWishlist);
        setError(err.message);
      }
    } else {
      // Guest flow - Use localStorage
      if (typeof window === "undefined") return;
      let newItems = [...wishlist.items];
      if (isCurrentlyWishlisted) {
        newItems = newItems.filter(
          (item) => (item.productId?._id || item.productId) !== productId
        );
      } else {
        newItems.push({
          productId: product,
          bazaarId: bazaarId,
        });
      }
      setWishlist({ items: newItems });
      localStorage.setItem("bazaarna-guest-wishlist", JSON.stringify(newItems));
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.items.some(
      (item) => (item.productId?._id || item.productId) === productId
    );
  };

  // Run on mount
  useEffect(() => {
    const init = async () => {
      await mergeGuestWishlist();
      await getWishlist();
    };
    init();
  }, []);

  const wishlistCount = wishlist.items?.length || 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        error,
        isInWishlist,
        toggleWishlist,
        getWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
