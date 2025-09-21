import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="space-y-4">
          <Button 
            className="items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border shadow-xs hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 bg-white text-black hover:bg-white block w-full"
            onClick={() => setCount((count) => count + 1)}
          >
            Admin Panel
          </Button>
          
          <p className="text-gray-600">
            Button clicked {count} times
          </p>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Click the Admin Panel button to test functionality</p>
        </div>
      </div>
    </div>
  )
}

export default App
