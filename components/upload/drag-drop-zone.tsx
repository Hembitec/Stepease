"use client"

import type React from "react"

import { useState, useRef, type DragEvent } from "react"
import { Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DragDropZoneProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number
}

export function DragDropZone({
  onFileSelect,
  acceptedTypes = [".pdf", ".docx", ".md", ".txt"],
  maxSize = 10 * 1024 * 1024,
}: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    setError(null)

    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!acceptedTypes.some((type) => extension === type.toLowerCase())) {
      setError(`Invalid file type. Accepted: ${acceptedTypes.join(", ")}`)
      return false
    }

    if (file.size > maxSize) {
      setError(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`)
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
          isDragOver ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 bg-gray-50 hover:border-gray-400",
          selectedFile && "border-green-500 bg-green-50",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-green-600 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-1">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedFile(null)
              }}
              className="mt-4 bg-transparent"
            >
              Choose Different File
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className={cn("w-12 h-12 mb-4", isDragOver ? "text-blue-600" : "text-gray-400")} />
            <p className="text-lg font-medium text-gray-900 mb-1">Drag & Drop File Here</p>
            <p className="text-gray-500 mb-4">or</p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Files</Button>
            <p className="text-sm text-gray-400 mt-4">
              Supported: {acceptedTypes.join(", ")} | Max: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}
