import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Upload, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Calendar, 
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle
} from 'lucide-react'

const AdminPanel = ({ onClose }) => {
  const [predictions, setPredictions] = useState([])
  const [newPrediction, setNewPrediction] = useState({
    team1: '',
    team2: '',
    odds: '',
    prediction: '',
    confidence: 'high',
    type: 'starter' // starter or joker
  })
  const [editingId, setEditingId] = useState(null)
  const [noPredictionsMode, setNoPredictionsMode] = useState(false)
  const [stats, setStats] = useState({
    totalSales: 1247,
    todaysSales: 23,
    activeUsers: 156,
    successRate: 78
  })

  // Load predictions from localStorage on component mount
  useEffect(() => {
    const savedPredictions = localStorage.getItem('footballPredictions')
    if (savedPredictions) {
      setPredictions(JSON.parse(savedPredictions))
    }
    
    const savedNoPredictionsMode = localStorage.getItem('noPredictionsMode')
    if (savedNoPredictionsMode) {
      setNoPredictionsMode(JSON.parse(savedNoPredictionsMode))
    }
  }, [])

  // Save predictions to localStorage whenever predictions change
  useEffect(() => {
    localStorage.setItem('footballPredictions', JSON.stringify(predictions))
  }, [predictions])

  // Save no predictions mode to localStorage
  useEffect(() => {
    localStorage.setItem('noPredictionsMode', JSON.stringify(noPredictionsMode))
  }, [noPredictionsMode])

  const handleAddPrediction = () => {
    if (!newPrediction.team1 || !newPrediction.team2 || !newPrediction.odds || !newPrediction.prediction) {
      alert('Please fill in all required fields')
      return
    }

    const prediction = {
      id: Date.now(),
      ...newPrediction,
      createdAt: new Date().toISOString(),
      status: 'active'
    }

    setPredictions(prev => [...prev, prediction])
    setNewPrediction({
      team1: '',
      team2: '',
      odds: '',
      prediction: '',
      confidence: 'high',
      type: 'starter'
    })
  }

  const handleEditPrediction = (id) => {
    setEditingId(id)
  }

  const handleSavePrediction = (id, updatedData) => {
    setPredictions(prev => 
      prev.map(p => p.id === id ? { ...p, ...updatedData } : p)
    )
    setEditingId(null)
  }

