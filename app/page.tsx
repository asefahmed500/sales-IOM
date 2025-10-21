import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BarChart3, Users, DollarSign, Shield, TrendingUp, CheckCircle, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IOM Sales
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <Link href="/login">
                <Button variant="outline">Create New Account</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by 1000+ Sales Teams
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Boost Your Sales
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Commission Management
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your sales operations with our comprehensive commission management platform. 
              Track performance, calculate commissions, and manage your sales team with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage sales commissions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your sales operations and boost team performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Real-time Analytics</CardTitle>
                <CardDescription>
                  Track sales performance and commission calculations in real-time with detailed analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage your sales team with role-based access and comprehensive team performance tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with role-based access control and data protection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>
                  Monitor individual and team performance with detailed metrics and insights.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Commission Calculator</CardTitle>
                <CardDescription>
                  Automated commission calculations based on customizable rules and performance metrics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>
                  Seamlessly integrate with your existing tools and workflows for maximum efficiency.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Mockup Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Dashboard Overview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get real-time insights into your sales performance and team metrics.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Sales Performance Dashboard</h3>
                <p className="text-gray-600">Real-time metrics and analytics</p>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stat Card 1 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100">Total Revenue</p>
                    <h4 className="text-2xl font-bold mt-2">$42,567</h4>
                    <p className="text-blue-100 text-sm mt-1">+12.5% from last month</p>
                  </div>
                  <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100">Active Users</p>
                    <h4 className="text-2xl font-bold mt-2">1,248</h4>
                    <p className="text-green-100 text-sm mt-1">+8.2% from last month</p>
                  </div>
                  <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              {/* Stat Card 3 */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100">Conversion Rate</p>
                    <h4 className="text-2xl font-bold mt-2">24.8%</h4>
                    <p className="text-purple-100 text-sm mt-1">+3.1% from last month</p>
                  </div>
                  <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </div>
              
              {/* Stat Card 4 */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-100">Avg. Deal Size</p>
                    <h4 className="text-2xl font-bold mt-2">$3,240</h4>
                    <p className="text-orange-100 text-sm mt-1">+5.7% from last month</p>
                  </div>
                  <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Chart */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Revenue Overview</h4>
                <div className="h-64 flex items-end space-x-2">
                  {[65, 80, 60, 90, 75, 95, 85, 100, 70, 85, 90, 110].map((height, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-all duration-300" 
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Team Performance */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Team Performance</h4>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', role: 'Sales Executive', performance: 95 },
                    { name: 'Jane Smith', role: 'Sales Executive', performance: 87 },
                    { name: 'Mike Johnson', role: 'Sales Executive', performance: 78 },
                    { name: 'Sarah Wilson', role: 'Sales Executive', performance: 92 }
                  ].map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" 
                            style={{ width: `${member.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{member.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {[
                  { action: 'New sale recorded', user: 'John Doe', amount: '$2,400', time: '2 min ago' },
                  { action: 'Commission calculated', user: 'Jane Smith', amount: '$360', time: '15 min ago' },
                  { action: 'Target achieved', user: 'Mike Johnson', amount: '105%', time: '1 hour ago' },
                  { action: 'New user registered', user: 'Sarah Wilson', amount: 'Executive', time: '3 hours ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{activity.amount}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your sales management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of sales teams already using IOM Sales to boost their performance.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">IOM Sales</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The complete sales commission management platform for modern sales teams. 
                Streamline operations, boost performance, and maximize revenue.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 IOM Sales. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}