import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { CheckCircle, Mail, Download, Calendar } from 'lucide-react'

const SuccessModal = ({ orderDetails, onClose }) => {
  const handleDownload = () => {
    // In a real application, this would generate and download the predictions
    const content = `
Football Predictions - ${orderDetails.package.name}
Order ID: ${orderDetails.orderId}
Email: ${orderDetails.email}
Date: ${new Date().toLocaleDateString()}

Thank you for your purchase! Your predictions will be delivered to your email shortly.
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `predictions-${orderDetails.orderId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          <CardDescription>Your order has been confirmed</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Package:</span>
              <span>{orderDetails.package.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="font-bold text-green-600">€{orderDetails.package.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="text-sm font-mono">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span className="text-sm">{orderDetails.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Email Delivery</p>
                <p className="text-blue-700">Your predictions will be sent to your email within the next 5 minutes.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Daily Updates</p>
                <p className="text-green-700">You'll receive fresh predictions every day at 8:00 AM.</p>
              </div>
            </div>

            {orderDetails.package.refundable && (
              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-800 mb-1">Money Back Guarantee</p>
                <p className="text-yellow-700">If both predictions fail, your money will be automatically refunded within 24 hours.</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={onClose}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SuccessModal
