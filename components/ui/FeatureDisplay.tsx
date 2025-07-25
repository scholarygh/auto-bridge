'use client'

import React, { useState } from 'react'

interface FeatureDisplayProps {
  features: string[] | string
  className?: string
  maxFeatures?: number
  showAll?: boolean
}

export default function FeatureDisplay({ 
  features, 
  className = "", 
  maxFeatures = 20,
  showAll = false 
}: FeatureDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Convert features to array and clean them up
  const processFeatures = (featuresInput: string[] | string): string[] => {
    if (Array.isArray(featuresInput)) {
      return featuresInput
        .flatMap(feature => feature.split(','))
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)
    } else if (typeof featuresInput === 'string') {
      return featuresInput
        .split(',')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)
    }
    return []
  }

  const processedFeatures = processFeatures(features)
  const shouldShowLimit = !showAll && !isExpanded && processedFeatures.length > maxFeatures
  const displayFeatures = shouldShowLimit ? processedFeatures.slice(0, maxFeatures) : processedFeatures
  const hasMore = processedFeatures.length > maxFeatures && !isExpanded

  if (processedFeatures.length === 0) {
    return (
      <div className={`text-gray-500 text-sm italic ${className}`}>
        No features listed
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {displayFeatures.map((feature, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
          >
            {feature}
          </span>
        ))}
        {hasMore && (
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            +{processedFeatures.length - maxFeatures} more
          </span>
        )}
      </div>
      {hasMore && (
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          onClick={() => setIsExpanded(true)}
        >
          Show all features
        </button>
      )}
      {isExpanded && processedFeatures.length > maxFeatures && (
        <button 
          className="text-gray-600 hover:text-gray-800 text-sm font-medium mt-2"
          onClick={() => setIsExpanded(false)}
        >
          Show less
        </button>
      )}
    </div>
  )
} 