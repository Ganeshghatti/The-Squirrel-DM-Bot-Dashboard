"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const standardFeatures = [
    "10,000 monthly messages",
    "Customer data collection (email & phone)",
    "Product/service explanation bot",
    "Analytics dashboard access",
    "AI-based lead classification"
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-4">
            Simple, transparent{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              pricing
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your business. Start with our Standard plan 
            or get a custom solution tailored to your specific needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Standard Tier */}
          <Card className="relative overflow-hidden border-2 border-zinc-800 hover:border-blue-500 transition-all duration-300 hover:shadow-2xl group bg-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-white">Standard</CardTitle>
                <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-800/50">
                  Most Popular
                </div>
              </div>
              <CardDescription className="text-gray-400 text-lg">
                Perfect for small to medium businesses looking to automate customer interactions
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 pb-6">
              {/* Pricing Section */}
              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white">₹3,999</span>
                  <span className="text-gray-400 ml-2 text-xs sm:text-sm">setup fee</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold text-white">₹1,500</span>
                  <span className="text-gray-400 ml-2 text-xs sm:text-sm">/month from month 2</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-base sm:text-lg mb-4">Everything you need to get started:</h4>
                {standardFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-300 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="relative z-10 pt-6 mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow hover:-translate-y-0.5 group"
                size="lg"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Tier */}
          <Card className="relative overflow-hidden border-2 border-zinc-800 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl group bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-white">Enterprise</CardTitle>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Premium
                </div>
              </div>
              <CardDescription className="text-gray-400 text-lg">
                Custom AI solutions designed specifically for your business requirements
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 pb-6">
              {/* Pricing Section */}
              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Custom AI Solutions</span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Starting from ₹15,000
                  </span>
                </div>
              </div>

              {/* Enterprise Features */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-base sm:text-lg mb-4">Enterprise includes:</h4>
                {[
                  "Unlimited monthly messages",
                  "Advanced customer analytics & insights",
                  "Custom AI model training",
                  "Multi-channel integration",
                  "Dedicated account manager",
                  "Priority support & onboarding",
                  "Custom integrations & APIs",
                  "Advanced security & compliance"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-gray-900" />
                    </div>
                    <span className="text-gray-300 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="relative z-10 pt-6">
              <Button 
                variant="secondary"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 py-3 text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow hover:-translate-y-0.5 group border-0"
                size="lg"
              >
                Contact Sales
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-8 p-8 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 max-w-5xl mx-auto">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
            Not sure which plan is right for you?
          </h3>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            Our team can help you choose the perfect solution for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="sm" className="text-sm px-6 py-3 border-zinc-700 text-gray-300 hover:bg-zinc-800 hover:text-white">
              Schedule a Demo
            </Button>
            <Button size="sm" className="text-sm px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}