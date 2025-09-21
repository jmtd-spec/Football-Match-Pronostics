import { useState, useEffect } from 'react'
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

  const handleDeletePrediction = (id) => {
    if (confirm('Are you sure you want to delete this prediction?')) {
      setPredictions(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleBulkUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csvData = e.target.result
          const lines = csvData.split('\n')
          const newPredictions = []

          // Skip header row
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim()
            if (line) {
              const [team1, team2, odds, prediction, confidence, type] = line.split(',')
              if (team1 && team2 && odds && prediction) {
                newPredictions.push({
                  id: Date.now() + i,
                  team1: team1.trim(),
                  team2: team2.trim(),
                  odds: odds.trim(),
                  prediction: prediction.trim(),
                  confidence: confidence?.trim() || 'high',
                  type: type?.trim() || 'starter',
                  createdAt: new Date().toISOString(),
                  status: 'active'
                })
              }
            }
          }

          setPredictions(prev => [...prev, ...newPredictions])
          alert(`Successfully uploaded ${newPredictions.length} predictions`)
        } catch (error) {
          alert('Error parsing CSV file. Please check the format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const PredictionCard = ({ prediction }) => {
    const [editData, setEditData] = useState(prediction)
    const isEditing = editingId === prediction.id

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={editData.team1}
                      onChange={(e) => setEditData(prev => ({ ...prev, team1: e.target.value }))}
                      placeholder="Team 1"
                      className="flex-1"
                    />
                    <span className="self-center">vs</span>
                    <Input
                      value={editData.team2}
                      onChange={(e) => setEditData(prev => ({ ...prev, team2: e.target.value }))}
                      placeholder="Team 2"
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <CardTitle className="text-lg">{prediction.team1} vs {prediction.team2}</CardTitle>
              )}
            </div>
            <div className="flex space-x-2">
              <Badge variant={prediction.type === 'starter' ? 'default' : 'secondary'}>
                {prediction.type === 'starter' ? 'Starter Kit' : 'Joker'}
              </Badge>
              <Badge variant={prediction.confidence === 'high' ? 'default' : 'outline'}>
                {prediction.confidence} confidence
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Odds</Label>
                  <Input
                    value={editData.odds}
                    onChange={(e) => setEditData(prev => ({ ...prev, odds: e.target.value }))}
                    placeholder="e.g., 1.85"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="starter">Starter Kit</option>
                    <option value="joker">Joker</option>
                  </select>
                </div>
              </div>
              <div>
                <Label>Prediction</Label>
                <Textarea
                  value={editData.prediction}
                  onChange={(e) => setEditData(prev => ({ ...prev, prediction: e.target.value }))}
                  placeholder="Prediction details..."
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Odds:</span>
                <span>{prediction.odds}</span>
              </div>
              <div>
                <span className="font-medium">Prediction:</span>
                <p className="text-gray-600 mt-1">{prediction.prediction}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3">
          <div className="flex justify-between w-full">
            <span className="text-sm text-gray-500">
              Created: {new Date(prediction.createdAt).toLocaleDateString()}
            </span>
            <div className="space-x-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleSavePrediction(prediction.id, editData)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditPrediction(prediction.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePrediction(prediction.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl bg-white max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>Manage daily football predictions</CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="predictions" className="p-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="predictions" className="space-y-6">
              {/* No Predictions Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Prediction Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">No Predictions Mode</p>
                      <p className="text-sm text-gray-600">
                        When enabled, shows "No predictions available" message to visitors
                      </p>
                    </div>
                    <Button
                      variant={noPredictionsMode ? "destructive" : "outline"}
                      onClick={() => setNoPredictionsMode(!noPredictionsMode)}
                    >
                      {noPredictionsMode ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Prediction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Team 1</Label>
                      <Input
                        value={newPrediction.team1}
                        onChange={(e) => setNewPrediction(prev => ({ ...prev, team1: e.target.value }))}
                        placeholder="e.g., Manchester United"
                      />
                    </div>
                    <div>
                      <Label>Team 2</Label>
                      <Input
                        value={newPrediction.team2}
                        onChange={(e) => setNewPrediction(prev => ({ ...prev, team2: e.target.value }))}
                        placeholder="e.g., Liverpool"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Odds</Label>
                      <Input
                        value={newPrediction.odds}
                        onChange={(e) => setNewPrediction(prev => ({ ...prev, odds: e.target.value }))}
                        placeholder="e.g., 1.85"
                      />
                    </div>
                    <div>
                      <Label>Confidence</Label>
                      <select
                        value={newPrediction.confidence}
                        onChange={(e) => setNewPrediction(prev => ({ ...prev, confidence: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <Label>Package Type</Label>
                      <select
                        value={newPrediction.type}
                        onChange={(e) => setNewPrediction(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="starter">Starter Kit</option>
                        <option value="joker">Joker</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>Prediction Details</Label>
                    <Textarea
                      value={newPrediction.prediction}
                      onChange={(e) => setNewPrediction(prev => ({ ...prev, prediction: e.target.value }))}
                      placeholder="Detailed prediction analysis..."
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddPrediction} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Prediction
                  </Button>
                </CardFooter>
              </Card>

              {/* Current Predictions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Current Predictions ({predictions.length})
                </h3>
                {predictions.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      No predictions added yet. Add your first prediction above.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {predictions.map(prediction => (
                      <PredictionCard key={prediction.id} prediction={prediction} />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bulk Upload Predictions</CardTitle>
                  <CardDescription>
                    Upload multiple predictions using a CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">Upload CSV File</p>
                    <p className="text-gray-600 mb-4">
                      Select a CSV file with your predictions data
                    </p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label htmlFor="csv-upload">
                      <Button asChild className="cursor-pointer">
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">CSV Format:</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your CSV file should have the following columns:
                    </p>
                    <code className="text-sm bg-white p-2 rounded block">
                      team1,team2,odds,prediction,confidence,type
                    </code>
                    <p className="text-sm text-gray-600 mt-2">
                      Example: Manchester United,Liverpool,1.85,Home win,high,starter
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.totalSales}</p>
                        <p className="text-sm text-gray-600">Total Sales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.todaysSales}</p>
                        <p className="text-sm text-gray-600">Today's Sales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.activeUsers}</p>
                        <p className="text-sm text-gray-600">Active Users</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-2xl font-bold">{stats.successRate}%</p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>New prediction added: Manchester United vs Liverpool</span>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Starter Kit purchased by user@example.com</span>
                      <span className="text-sm text-gray-500">3 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span>Joker package purchased by customer@test.com</span>
                      <span className="text-sm text-gray-500">5 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

export default AdminPanel
