'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  onUploadComplete?: (url: string) => void
  accept?: string
  maxSize?: number // in MB
  label?: string
}

export function FileUpload({ onFileSelect, onUploadComplete, accept = 'image/*', maxSize = 5, label }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (!file) {
      setSelectedFile(null)
      setPreview(null)
      setError('')
      onFileSelect(null)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setSelectedFile(file)
    setError('')
    setUploading(true)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }

    // Upload file to Cloudinary
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        if (onUploadComplete) {
          onUploadComplete(data.url)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }

    onFileSelect(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setError('')
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!selectedFile ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="w-full"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        
        <p className="text-xs text-muted-foreground">
          Max file size: {maxSize}MB
        </p>
      </div>
    </div>
  )
}
