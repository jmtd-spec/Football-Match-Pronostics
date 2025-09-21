import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { CreditCard, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react'

const Checkout = ({ selectedPackage, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    paymentMethod: 'card'
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const packageDetails = {
    starter: {
      name: 'Starter Kit',
      price: '9.99',
      description: '5 Top Daily Predictions',
      features: ['5 Top Daily Predictions', 'Expert Analysis', 'Instant Delivery'],
      refundable: false
    },
    joker: {
      name: 'Joker Package',
      price: '15.99',
      description: '2 Match Predictions with Guarantee',
      features: ['2 Match Predictions', 'Minimum Odds: 1.4 (2/5)', 'Money Back Guarantee'],
      refundable: true
    }
  }

  const currentPackage = packageDetails[selectedPackage]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess({
        package: currentPackage,
        email: formData.email,
        phone: formData.phone,
        orderId: `ORD-${Date.now()}`
      })
    }, 2000)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Checkout</CardTitle>
          <CardDescription>Complete your purchase securely</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Package Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{currentPackage.name}</h3>
                <p className="text-gray-600 text-sm">{currentPackage.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">€{currentPackage.price}</div>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              {currentPackage.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {currentPackage.refundable ? (
              <Badge variant="secondary" className="mt-3 bg-blue-100 text-blue-800">
                Money Back Guarantee
              </Badge>
            ) : (
              <Badge variant="destructive" className="mt-3">
                Final Price - Non-Refundable
              </Badge>
            )}
          </div>

          {/* Contact Information */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Contact Information</span>
              </h4>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('paymentMethod', 'card')}
                  className="h-12"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
                <Button
                  type="button"
                  variant={formData.paymentMethod === 'paypal' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('paymentMethod', 'paypal')}
                  className="h-12"
                >
                  PayPal
                </Button>
              </div>
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="mb-2">
                <strong>Delivery:</strong> You will receive your predictions via email immediately after payment confirmation.
              </p>
              {currentPackage.refundable && (
                <p>
                  <strong>Guarantee:</strong> If both predictions fail, your money will be automatically refunded within 24 hours.
                </p>
              )}
            </div>
          </form>
        </CardContent>

        <CardFooter className="space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Pay €${currentPackage.price}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Checkout
