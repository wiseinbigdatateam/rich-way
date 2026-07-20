
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, Users, BookOpen, Shield, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DiagnosisSection from "@/components/DiagnosisSection";
import ExpertSection from "@/components/ExpertSection";
import EducationSection from "@/components/EducationSection";
import ProductSection from "@/components/ProductSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <Hero />
      <DiagnosisSection />
      <ExpertSection />
      <EducationSection />
      <ProductSection />
      
      <Footer />
    </div>
  );
};

export default Index;
