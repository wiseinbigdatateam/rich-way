import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ProductStatus = "판매중" | "준비중" | "판매중지";

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  regular_price: number | null;
  provider: string | null;
  rate_info: string | null;
  risk_level: string | null;
  features: string[];
  rating: number;
  sales_count: number;
  status: ProductStatus;
  thumbnail_url: string | null;
  link_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface UseProductsOptions {
  status?: ProductStatus | ProductStatus[];
  category?: string | string[];
  onlyActive?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (options.onlyActive) {
        query = query.eq("status", "판매중");
      } else if (options.status) {
        const statuses = Array.isArray(options.status) ? options.status : [options.status];
        query = query.in("status", statuses);
      }

      if (options.category) {
        const categories = Array.isArray(options.category) ? options.category : [options.category];
        query = query.in("category", categories);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProducts(
        (data || []).map((row: any) => ({
          ...row,
          features: row.features || [],
          rating: Number(row.rating) || 0,
          sales_count: row.sales_count || 0,
          sort_order: row.sort_order || 0,
        }))
      );
    } catch (err: any) {
      console.error("상품 조회 오류:", err);
      setError(err.message || "상품 조회에 실패했습니다.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.onlyActive, JSON.stringify(options.status), JSON.stringify(options.category)]);

  return { products, loading, error, refetch: fetchProducts };
};

export const formatProductPrice = (price: number) => {
  if (price <= 0) return "문의";
  if (price < 100000) return `월 ${price.toLocaleString()}원`;
  return `${price.toLocaleString()}원`;
};
