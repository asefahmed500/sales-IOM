import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  value: number
  subtitle?: string
  icon?: React.ReactNode
  format?: 'currency' | 'number' | 'percentage'
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  format = 'number' 
}: DashboardCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      default:
        return value.toLocaleString()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue()}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
