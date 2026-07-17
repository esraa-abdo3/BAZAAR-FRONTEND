"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, ShoppingBag, Tag, Store, ChevronRight, Bot } from "lucide-react";

const API_URL = "https://bazary-backend.vercel.app/api/assistant/chat";

function ProductCard({ product, onViewProduct }) {
  const hasOffer = product.priceAfterOffer && product.priceAfterOffer < product.price;
  const discount = hasOffer
    ? Math.round(((product.price - product.priceAfterOffer) / product.price) * 100)
    : null;

  return (
    <div className="flex gap-3 bg-white rounded-2xl border border-[#e8e4df] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {product.images?.[0] && (
        <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-[#f5f2ee]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}
      <div className="flex flex-col justify-between py-2 pr-3 min-w-0 flex-1">
        <div>
          <p className="text-sm font-semibold text-[#22301D] leading-tight truncate">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Store size={11} className="text-[#50604A]" />
            <span className="text-[11px] text-[#50604A] truncate">{product.brandName} · {product.bazaarName}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-[#9A5F4C]">
              {hasOffer ? product.priceAfterOffer : product.price} EGP
            </span>
            {hasOffer && (
              <span className="text-[11px] text-gray-400 line-through">{product.price}</span>
            )}
            {discount && (
              <span className="text-[10px] font-bold bg-[#9A5F4C]/10 text-[#9A5F4C] px-1.5 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          <button
            onClick={() => onViewProduct(product)}
            className="flex items-center gap-0.5 text-[11px] font-semibold text-[#50604A] hover:text-[#22301D] transition-colors"
          >
            عرض <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ msg, onViewProduct }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#50604A] to-[#22301D] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles size={13} className="text-white" />
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-[#22301D] text-white rounded-tr-sm"
              : "bg-white border border-[#e8e4df] text-[#22301D] rounded-tl-sm shadow-sm"
          }`}
          dir="auto"
        >
          {msg.text}
        </div>

        {msg.products?.length > 0 && (
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {msg.products.map((p) => (
              <ProductCard key={p._id} product={p} onViewProduct={onViewProduct} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#50604A] to-[#22301D] flex items-center justify-center flex-shrink-0">
        <Sparkles size={13} className="text-white" />
      </div>
      <div className="bg-white border border-[#e8e4df] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#50604A] animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#50604A] animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#50604A] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "عايزه فستان سواريه",
  "إيه أحسن عطر نسائي؟",
  "حلويات للهدية",
  "شنط يد جلد",
];

export default function BazaaryAIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "أهلاً! 👋 أنا مساعد Bazaary الذكي. قولي إيه اللي بتدور عليه وهساعدك تلاقيه من أحسن البازارات! 🛍️",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const userMsg = { id: Date.now(), role: "user", text: userText, products: [] };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });

      const json = await res.json();
      const data = json.data;
      console.log(data)

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.message,
        products: data.products || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userText },
        data.assistantMessage || { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "معلش، في مشكلة في الاتصال. حاول تاني بعد شوية 🙏",
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    if (product.bazaarId && product._id) {
      window.open(`/Bazaarprofile/${product.bazaarId}/brand/${product.brandId}/product/${product._id}`, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      <div
        className="pointer-events-auto flex flex-col w-full max-w-sm h-[600px] bg-[#faf9f7] rounded-3xl shadow-2xl border border-[#e8e4df] overflow-hidden"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#22301D] to-[#3a4e34] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">مساعد Bazaary</p>
              <p className="text-[11px] text-white/60 mt-0.5">بيساعدك تلاقي أحسن المنتجات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <X size={14} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} onViewProduct={handleViewProduct} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions (show only when only the welcome message is there) */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-full bg-white border border-[#d8d4ce] text-[#50604A] hover:bg-[#50604A] hover:text-white hover:border-[#50604A] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-2 flex-shrink-0 border-t border-[#e8e4df] bg-white">
          <div className="flex items-center gap-2 bg-[#faf9f7] rounded-2xl border border-[#e0dbd4] px-3 py-2 focus-within:border-[#50604A] transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="ابحث عن أي منتج..."
              dir="rtl"
              className="flex-1 bg-transparent text-sm text-[#22301D] placeholder:text-gray-400 outline-none"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-xl bg-[#50604A] flex items-center justify-center disabled:opacity-40 hover:bg-[#22301D] transition-colors flex-shrink-0"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}