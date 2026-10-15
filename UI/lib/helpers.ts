export function calculateBMI(weight: string, height: string): string {
  const weightNum = parseFloat(weight)
  const heightNum = parseFloat(height) / 100 // Convert cm to m
  
  if (isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) {
    return "N/A"
  }
  
  const bmi = weightNum / (heightNum * heightNum)
  return bmi.toFixed(1)
}

export function getBMICategory(bmi: string): string {
  const bmiNum = parseFloat(bmi)
  
  if (isNaN(bmiNum)) return "N/A"
  
  if (bmiNum < 18.5) return "Underweight"
  if (bmiNum < 25) return "Normal"
  if (bmiNum < 30) return "Overweight"
  return "Obese"
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function generatePrescriptionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `AYR-${timestamp}-${random}`.toUpperCase()
}

export function getDoshaAnalysis(symptoms: string): string {
  const symptomsLower = symptoms.toLowerCase()
  
  const vataKeywords = ["anxiety", "dry", "cold", "constipation", "insomnia", "pain", "nervous", "restless"]
  const pittaKeywords = ["heat", "burning", "acid", "inflammation", "anger", "rash", "hot", "fever"]
  const kaphaKeywords = ["heavy", "sluggish", "congestion", "mucus", "weight", "swelling", "tired", "lethargic"]
  
  const vataScore = vataKeywords.filter(k => symptomsLower.includes(k)).length
  const pittaScore = pittaKeywords.filter(k => symptomsLower.includes(k)).length
  const kaphaScore = kaphaKeywords.filter(k => symptomsLower.includes(k)).length
  
  const maxScore = Math.max(vataScore, pittaScore, kaphaScore)
  
  if (maxScore === 0) {
    return "Based on the symptoms described, a comprehensive dosha assessment would be beneficial. Consider consulting with an Ayurvedic practitioner for personalized guidance."
  }
  
  const doshas = []
  if (vataScore === maxScore) doshas.push("Vata")
  if (pittaScore === maxScore) doshas.push("Pitta")
  if (kaphaScore === maxScore) doshas.push("Kapha")
  
  return `The symptoms suggest a potential ${doshas.join(" and ")} imbalance. This analysis is preliminary and should be confirmed with a qualified Ayurvedic practitioner.`
}
