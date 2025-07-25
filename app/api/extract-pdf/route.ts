import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromPDF, extractVehicleInfoFromText } from '@/lib/pdfExtractor'

// Initialize OpenAI client only if API key is available
let openai: any = null

if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai')
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface ExtractedVehicleData {
  make: string
  model: string
  year: number
  trim: string
  mileage: number
  color: string
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'automatic' | 'manual'
  vin: string
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  features: string[]
  accidentHistory: string
  serviceHistory: string
  ownershipHistory: string
  description: string
  estimatedPrice: number
  location: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get('pdfFile') as File

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'PDF file is required' },
        { status: 400 }
      )
    }

    // Check file type
    if (!pdfFile.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    if (pdfFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    console.log('🚀 Starting PDF extraction for:', pdfFile.name)
    console.log('📊 File size:', pdfFile.size, 'bytes')

    // Convert File to Buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())

    // Step 1: Extract text from PDF
    console.log('📄 Step 1: Extracting text from PDF...')
    const pdfData = await extractTextFromPDF(pdfBuffer)
    
    if (!pdfData.success) {
      return NextResponse.json(
        { error: 'Failed to extract text from PDF', details: pdfData.error },
        { status: 500 }
      )
    }

    console.log('📊 PDF text length:', pdfData.text.length)
    console.log('📄 Number of pages:', pdfData.pages)

    // Step 2: Extract basic vehicle info using regex patterns
    console.log('🔍 Step 2: Extracting basic vehicle info...')
    const basicInfo = extractVehicleInfoFromText(pdfData.text)
    console.log('📋 Basic info extracted:', basicInfo)

    // Step 3: Use AI to extract comprehensive information
    if (openai) {
      try {
        console.log('🤖 Step 3: Sending to OpenAI for comprehensive analysis...')
        
        const prompt = `
You are an expert automotive data analyst. Extract comprehensive vehicle information from the following Carfax PDF report text and return the data in JSON format.

IMPORTANT: Only extract information that is clearly visible in the text below. If something is not mentioned, use null or empty string. Do not hallucinate or make assumptions.

PDF REPORT TEXT:
"""
${pdfData.text}
"""

BASIC INFO EXTRACTED:
${JSON.stringify(basicInfo, null, 2)}

Please extract and return the following information in valid JSON format:

{
  "make": "string (e.g., Toyota, BMW, Mercedes) or null if not found",
  "model": "string (e.g., Tundra, X5, C-Class) or null if not found",
  "year": "number (e.g., 2020) or null if not found",
  "trim": "string (e.g., SR5, xDrive40i, C 300) or null if not found",
  "mileage": "number (current mileage) or null if not found",
  "color": "string (exterior color) or null if not found",
  "fuelType": "gasoline|diesel|electric|hybrid or null if not found",
  "transmission": "automatic|manual or null if not found",
  "vin": "string (17-character VIN) or null if not found",
  "condition": "excellent|good|fair|poor (based on history) or null if not found",
  "features": ["array of features found] or empty array if none found",
  "accidentHistory": "string (summary of accidents/damage) or null if not found",
  "serviceHistory": "string (summary of service records) or null if not found",
  "ownershipHistory": "string (summary of ownership) or null if not found",
  "description": "string (comprehensive vehicle description) or null if not found",
  "estimatedPrice": "number (estimated market value in USD) or null if not found",
  "location": "string (location if mentioned) or null if not found"
}

CRITICAL RULES:
1. Only extract information that is explicitly mentioned in the text
2. If information is not available, use null or empty string
3. Do not make assumptions or guess values
4. Return only valid JSON - no explanatory text
5. Use the basic info as fallback if not found in detailed text
6. For condition, assess based on accident/service history mentioned
7. For features, only include features explicitly listed
8. For estimatedPrice, only include if a price is mentioned
9. Look for accident reports, service records, and ownership history
10. Extract any maintenance history, recalls, or damage reports

Return only the JSON object, no additional text or explanations.
`

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert automotive data analyst. Extract vehicle information from Carfax PDF reports and return only valid JSON. Do not hallucinate or make assumptions."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
        })

        const responseText = completion.choices[0]?.message?.content || ''
        
        console.log('📝 Raw AI response length:', responseText.length)
        
        // Parse the JSON response
        let extractedData: ExtractedVehicleData
        
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/)
          if (!jsonMatch) {
            throw new Error('No JSON found in AI response')
          }
          
          extractedData = JSON.parse(jsonMatch[0])
          console.log('✅ Successfully parsed AI response')
        } catch (parseError) {
          console.error('❌ Error parsing AI response:', parseError)
          console.log('Raw AI response:', responseText)
          
          // Fallback to basic data extraction
          extractedData = {
            make: basicInfo.make || 'Unknown',
            model: basicInfo.model || 'Unknown',
            year: parseInt(basicInfo.year) || new Date().getFullYear(),
            trim: basicInfo.trim || '',
            mileage: parseInt(basicInfo.mileage?.replace(/,/g, '')) || 0,
            color: basicInfo.color || 'Unknown',
            fuelType: (basicInfo.fuelType?.toLowerCase() as any) || 'gasoline',
            transmission: (basicInfo.transmission?.toLowerCase() as any) || 'automatic',
            vin: basicInfo.vin || '',
            condition: 'good',
            features: [],
            accidentHistory: 'Unable to extract from AI response',
            serviceHistory: 'Unable to extract from AI response',
            ownershipHistory: 'Unable to extract from AI response',
            description: 'Vehicle information extracted from Carfax PDF report',
            estimatedPrice: 0,
            location: 'Unknown'
          }
        }

        // Validate and clean the extracted data
        const validatedData = {
          ...extractedData,
          make: extractedData.make || basicInfo.make || 'Unknown',
          model: extractedData.model || basicInfo.model || 'Unknown',
          year: extractedData.year || parseInt(basicInfo.year) || new Date().getFullYear(),
          mileage: extractedData.mileage || parseInt(basicInfo.mileage?.replace(/,/g, '')) || 0,
          vin: extractedData.vin || basicInfo.vin || '',
          features: Array.isArray(extractedData.features) ? extractedData.features : [],
          estimatedPrice: extractedData.estimatedPrice || 0,
          location: extractedData.location || 'Unknown'
        }

        console.log('🎉 PDF extraction completed successfully!')
        console.log('📊 Extracted data:', {
          make: validatedData.make,
          model: validatedData.model,
          year: validatedData.year,
          vin: validatedData.vin,
          features: validatedData.features.length
        })

        return NextResponse.json({
          success: true,
          data: validatedData,
          pdfInfo: {
            pages: pdfData.pages,
            textLength: pdfData.text.length,
            fileName: pdfFile.name,
            fileSize: pdfFile.size
          },
          basicInfo,
          message: 'PDF uploaded successfully. Please review and manually enter any missing information from the PDF.',
          rawResponse: responseText // For debugging
        })

      } catch (error: any) {
        console.error('❌ OpenAI API error:', error)
        
        // Check if it's a quota error
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          console.log('⚠️ OpenAI quota exceeded, using basic extraction')
          
          // Provide fallback data extraction
          const fallbackData: ExtractedVehicleData = {
            make: basicInfo.make || 'Unknown',
            model: basicInfo.model || 'Unknown',
            year: parseInt(basicInfo.year) || new Date().getFullYear(),
            trim: basicInfo.trim || '',
            mileage: parseInt(basicInfo.mileage?.replace(/,/g, '')) || 0,
            color: basicInfo.color || 'Unknown',
            fuelType: (basicInfo.fuelType?.toLowerCase() as any) || 'gasoline',
            transmission: (basicInfo.transmission?.toLowerCase() as any) || 'automatic',
            vin: basicInfo.vin || '',
            condition: 'good',
            features: [],
            accidentHistory: 'Please enter manually - AI quota exceeded',
            serviceHistory: 'Please enter manually - AI quota exceeded',
            ownershipHistory: 'Please enter manually - AI quota exceeded',
            description: `Vehicle information for ${basicInfo.make} ${basicInfo.model} (VIN: ${basicInfo.vin})`,
            estimatedPrice: 0,
            location: 'Unknown'
          }

          return NextResponse.json({
            success: true,
            data: fallbackData,
            warning: 'OpenAI quota exceeded - using basic extraction. Please manually review the PDF and enter missing information.',
            fallback: true,
            pdfInfo: {
              pages: pdfData.pages,
              textLength: pdfData.text.length,
              fileName: pdfFile.name,
              fileSize: pdfFile.size
            },
            basicInfo,
            message: 'PDF uploaded successfully. Please review the PDF and manually enter any missing information.'
          })
        }

        throw error
      }
    } else {
      // No OpenAI available, use basic extraction only
      console.log('⚠️ OpenAI not available, using basic extraction only')
      
      const basicData: ExtractedVehicleData = {
        make: basicInfo.make || 'Unknown',
        model: basicInfo.model || 'Unknown',
        year: parseInt(basicInfo.year) || new Date().getFullYear(),
        trim: basicInfo.trim || '',
        mileage: parseInt(basicInfo.mileage?.replace(/,/g, '')) || 0,
        color: basicInfo.color || 'Unknown',
        fuelType: (basicInfo.fuelType?.toLowerCase() as any) || 'gasoline',
        transmission: (basicInfo.transmission?.toLowerCase() as any) || 'automatic',
        vin: basicInfo.vin || '',
        condition: 'good',
        features: [],
        accidentHistory: 'Please enter manually - basic extraction only',
        serviceHistory: 'Please enter manually - basic extraction only',
        ownershipHistory: 'Please enter manually - basic extraction only',
        description: `Vehicle information for ${basicInfo.make} ${basicInfo.model} (VIN: ${basicInfo.vin})`,
        estimatedPrice: 0,
        location: 'Unknown'
      }

      return NextResponse.json({
        success: true,
        data: basicData,
        warning: 'OpenAI not configured - using basic extraction only. Please manually review the PDF and enter missing information.',
        fallback: true,
        pdfInfo: {
          pages: pdfData.pages,
          textLength: pdfData.text.length,
          fileName: pdfFile.name,
          fileSize: pdfFile.size
        },
        basicInfo,
        message: 'PDF uploaded successfully. Please review the PDF and manually enter any missing information.'
      })
    }

  } catch (error) {
    console.error('❌ Error extracting PDF data:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to extract vehicle data from PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 