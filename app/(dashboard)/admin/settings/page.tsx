'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { QrCode, Key, Shield } from 'lucide-react'

export default function AdminSettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [verificationCode, setVerificationCode] = useState('')

  const enableTwoFactor = () => {
    // In a real application, this would generate a QR code
    // For now, we'll just simulate it
    setQrCode('sample-qr-code')
    setTwoFactorEnabled(true)
  }

  const disableTwoFactor = () => {
    setTwoFactorEnabled(false)
    setQrCode('')
    setVerificationCode('')
  }

  const verifyCode = () => {
    // In a real application, this would verify the code
    // For now, we'll just simulate it
    alert('2FA setup completed successfully!')
  }

  return (
    <DashboardLayout 
      title="Admin Settings" 
      subtitle="Manage system configuration and security"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure authentication and security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex space-x-2">
                  {twoFactorEnabled ? (
                    <Button variant="destructive" onClick={disableTwoFactor}>
                      Disable
                    </Button>
                  ) : (
                    <Button onClick={enableTwoFactor}>
                      Enable
                    </Button>
                  )}
                </div>
              </div>

              {twoFactorEnabled && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <Label>Scan QR Code</Label>
                    <div className="mt-2 p-4 bg-white rounded border flex items-center justify-center">
                      {qrCode ? (
                        <div className="text-center">
                          <QrCode className="h-24 w-24 mx-auto" />
                          <p className="text-sm mt-2">Sample QR Code</p>
                        </div>
                      ) : (
                        <p>Generating QR code...</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Enter Verification Code</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>

                  <Button onClick={verifyCode} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Verify and Enable
                  </Button>
                </div>
              )}

              {!twoFactorEnabled && (
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication is currently disabled. Enable it to add an extra layer of security.
                </p>
              )}
            </div>

            {/* Other Security Options */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-medium">Password Requirements</h3>
                <p className="text-sm text-muted-foreground">
                  Configure password complexity rules
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minLength">Minimum Length</Label>
                  <Input id="minLength" type="number" defaultValue="8" />
                </div>
                <div>
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">Enabled</span>
                    <Badge variant="default">ON</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Manage global system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Company Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your company details
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="IOM Sales" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Contact Email</Label>
                <Input id="companyEmail" type="email" defaultValue="admin@iomsales.com" />
              </div>
            </div>

            {/* Session Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-medium">Session Management</h3>
                <p className="text-sm text-muted-foreground">
                  Configure session timeout and limits
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" defaultValue="480" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSessions">Maximum Concurrent Sessions</Label>
                <Input id="maxSessions" type="number" defaultValue="5" />
              </div>
            </div>

            {/* File Upload Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <h3 className="font-medium">File Upload Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Configure file upload restrictions
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                <Input id="maxFileSize" type="number" defaultValue="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allowedTypes">Allowed File Types</Label>
                <Input id="allowedTypes" defaultValue="jpg,jpeg,png,pdf" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button size="lg">Save Settings</Button>
      </div>
    </DashboardLayout>
  )
}