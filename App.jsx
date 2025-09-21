import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Clock, Calendar, Trophy, Shield, Star, CheckCircle } from 'lucide-react'
import Checkout from './components/Checkout.jsx'
import SuccessModal from './components/SuccessModal.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCheckout, setShowCheckout] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [noPredictions, setNoPredictions] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sync noPredictions state with localStorage
  useEffect(() => {
    const savedNoPredictionsMode = localStorage.getItem('noPredictionsMode')
    if (savedNoPredictionsMode) {
      setNoPredictions(JSON.parse(savedNoPredictionsMode))
    }
  }, [])

  // Listen for localStorage changes to sync admin panel changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedNoPredictionsMode = localStorage.getItem('noPredictionsMode')
      if (savedNoPredictionsMode) {
        setNoPredictions(JSON.parse(savedNoPredictionsMode))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events for same-tab updates
    const handleCustomUpdate = () => {
      handleStorageChange()
    }
    
    window.addEventListener('adminUpdate', handleCustomUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('adminUpdate', handleCustomUpdate)
    }
  }, [])

  // Calculate time until midnight (next day)
  const getTimeUntilMidnight = () => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const diff = midnight - now
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return { hours, minutes, seconds }
  }

  const timeLeft = getTimeUntilMidnight()

  const handlePurchase = (packageType) => {
    setSelectedPackage(packageType)
    setShowCheckout(true)
  }

  const handleCheckoutSuccess = (details) => {
    setOrderDetails(details)
    setShowCheckout(false)
    setShowSuccess(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    setOrderDetails(null)
    setSelectedPackage(null)
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-black">Football Predictions</h1>
            </div>
            <div className="flex items-center space-x-4 text-gray-800">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">{formatDate(currentTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Daily Football Predictions
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Get expert football predictions with proven track record. Choose your package and start winning today!
          </p>
          
          {/* Timer */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-6 w-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Time Until Next Predictions</h3>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-700">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-700">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-700">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* No Predictions Message */}
      {noPredictions && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <Card className="max-w-md mx-auto bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-yellow-600 mb-2">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Predictions Available</h3>
                <p className="text-yellow-700">No predictions are available for today. Please check back tomorrow!</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Packages Section */}
      {!noPredictions && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Starter Kit */}
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Star className="h-12 w-12 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-800">Starter Kit</CardTitle>
                  <CardDescription className="text-lg">Perfect for beginners</CardDescription>
                  <div className="text-4xl font-bold text-green-600 mt-4">€9.99</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>5 Top Daily Predictions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Expert Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Instant Delivery</span>
                    </div>
                  </div>
                  <Badge variant="destructive" className="w-full justify-center">
                    Final Price - Non-Refundable
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handlePurchase('starter')}
                  >
                    Purchase Starter Kit
                  </Button>
                </CardFooter>
              </Card>

              {/* Joker Package */}
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">MONEY BACK GUARANTEE</Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-4">
                    <Shield className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-800">Joker</CardTitle>
                  <CardDescription className="text-lg">Risk-free option</CardDescription>
                  <div className="text-4xl font-bold text-blue-600 mt-4">€15.99</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>2 Match Predictions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Minimum Odds: 1.4 (2/5)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Premium Analysis</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center bg-blue-100 text-blue-800">
                    Money Refunded if Both Predictions Fail
                  </Badge>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handlePurchase('joker')}
                  >
                    Purchase Joker Package
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout
          selectedPackage={selectedPackage}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Success Modal */}
      {showSuccess && orderDetails && (
        <SuccessModal
          orderDetails={orderDetails}
          onClose={handleCloseSuccess}
        />
      )}

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-white">
          <p className="mb-4">© 2024 Football Predictions. All rights reserved.</p>
          <p className="text-sm text-green-100">
            Gambling can be addictive. Please play responsibly.
          </p>
        </div>
      </footer>

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {/* Admin Access (for demo) */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdmin(true)}
          className="bg-white/90 text-black hover:bg-white block w-full"
        >
          Admin Panel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNoPredictions(!noPredictions)}
          className="bg-white/90 text-black hover:bg-white block w-full"
        >
          Toggle No Predictions
        </Button>
      </div>
    </div>
  )
}

export default App
