import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Loader2 } from "lucide-react";
import { useProducts, formatProductPrice } from "@/hooks/useProducts";

const ProductsPage = () => {
  const { products, loading, error } = useProducts({ onlyActive: true });

  const featuredProducts = products.filter((p) =>
    ["투자", "보험", "부동산", "앱", "템플릿", "도구"].includes(p.category)
  ).slice(0, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">부자 상품</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            검증된 금융 상품으로 부자가 되는 길을 안내합니다
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500">등록된 상품이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {product.rate_info || formatProductPrice(product.price)}
                    </div>
                    {product.provider && (
                      <p className="text-sm text-slate-500 mb-2">{product.provider}</p>
                    )}
                    <ul className="space-y-1">
                      {(product.features || []).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-slate-600">
                          <Shield className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                    onClick={() => {
                      if (product.link_url) {
                        window.open(product.link_url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    disabled={!product.link_url}
                  >
                    {product.link_url ? "상품 보기" : "준비 중"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
