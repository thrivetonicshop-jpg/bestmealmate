'use client'

import { useState } from 'react'
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  Mail,
  Printer,
  Copy,
  Check,
  Share2,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

interface GroceryItem {
  id: string
  name: string
  quantity: string
  aisle?: string
  is_purchased: boolean
}

interface GroceryList {
  id: string
  name: string
  items: GroceryItem[]
}

interface GroceryListExportProps {
  list: GroceryList
  onClose: () => void
}

type ExportFormat = 'text' | 'csv' | 'json' | 'print' | 'email' | 'sms'

export default function GroceryListExport({ list, onClose }: GroceryListExportProps) {
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null)

  // Generate text format
  const generateText = (includeChecked = false): string => {
    const items = includeChecked
      ? list.items
      : list.items.filter(i => !i.is_purchased)

    const grouped: Record<string, GroceryItem[]> = {}
    items.forEach(item => {
      const aisle = item.aisle || 'Other'
      if (!grouped[aisle]) grouped[aisle] = []
      grouped[aisle].push(item)
    })

    let text = `${list.name}\n${'='.repeat(list.name.length)}\n\n`

    Object.entries(grouped).forEach(([aisle, aisleItems]) => {
      text += `${aisle}:\n`
      aisleItems.forEach(item => {
        const check = item.is_purchased ? '✓' : '○'
        text += `  ${check} ${item.name} (${item.quantity})\n`
      })
      text += '\n'
    })

    text += `\nTotal: ${items.length} items`
    if (!includeChecked) {
      text += ` (${list.items.filter(i => i.is_purchased).length} already purchased)`
    }

    return text
  }

  // Generate CSV format
  const generateCSV = (): string => {
    let csv = 'Name,Quantity,Aisle,Purchased\n'
    list.items.forEach(item => {
      csv += `"${item.name}","${item.quantity}","${item.aisle || 'Other'}",${item.is_purchased ? 'Yes' : 'No'}\n`
    })
    return csv
  }

  // Generate JSON format
  const generateJSON = (): string => {
    return JSON.stringify({
      name: list.name,
      exportedAt: new Date().toISOString(),
      items: list.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        aisle: item.aisle || 'Other',
        purchased: item.is_purchased
      }))
    }, null, 2)
  }

  // Generate simple list for sharing
  const generateSimpleList = (): string => {
    const unpurchased = list.items.filter(i => !i.is_purchased)
    let text = `${list.name}\n\n`
    unpurchased.forEach(item => {
      text += `• ${item.name} (${item.quantity})\n`
    })
    text += `\n${unpurchased.length} items total`
    return text
  }

  // Copy to clipboard
  const copyToClipboard = async (format: ExportFormat) => {
    let content = ''
    switch (format) {
      case 'text':
        content = generateText(true)
        break
      case 'csv':
        content = generateCSV()
        break
      case 'json':
        content = generateJSON()
        break
      default:
        content = generateSimpleList()
    }

    try {
      await navigator.clipboard.writeText(content)
      setCopiedFormat(format)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedFormat(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy')
    }
  }

  // Download file
  const downloadFile = (format: 'text' | 'csv' | 'json') => {
    let content = ''
    let mimeType = ''
    let extension = ''

    switch (format) {
      case 'text':
        content = generateText(true)
        mimeType = 'text/plain'
        extension = 'txt'
        break
      case 'csv':
        content = generateCSV()
        mimeType = 'text/csv'
        extension = 'csv'
        break
      case 'json':
        content = generateJSON()
        mimeType = 'application/json'
        extension = 'json'
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${list.name.replace(/\s+/g, '-').toLowerCase()}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success(`Downloaded as ${extension.toUpperCase()}`)
  }

  // Print list
  const printList = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${list.name} - BestMealMate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
            h1 { color: #22c55e; margin-bottom: 5px; }
            .subtitle { color: #6b7280; margin-bottom: 20px; }
            .aisle { background: #f3f4f6; padding: 8px 12px; margin: 15px 0 8px; border-radius: 6px; font-weight: 600; }
            .item { display: flex; align-items: center; padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
            .checkbox { width: 18px; height: 18px; border: 2px solid #d1d5db; border-radius: 50%; margin-right: 12px; }
            .purchased .checkbox { background: #22c55e; border-color: #22c55e; }
            .purchased .name { text-decoration: line-through; color: #9ca3af; }
            .quantity { color: #6b7280; margin-left: 8px; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${list.name}</h1>
          <p class="subtitle">Generated by BestMealMate</p>
          ${Object.entries(
            list.items.reduce((acc, item) => {
              const aisle = item.aisle || 'Other'
              if (!acc[aisle]) acc[aisle] = []
              acc[aisle].push(item)
              return acc
            }, {} as Record<string, GroceryItem[]>)
          ).map(([aisle, items]) => `
            <div class="aisle">${aisle}</div>
            ${items.map(item => `
              <div class="item ${item.is_purchased ? 'purchased' : ''}">
                <div class="checkbox"></div>
                <span class="name">${item.name}</span>
                <span class="quantity">(${item.quantity})</span>
              </div>
            `).join('')}
          `).join('')}
          <div class="footer">
            <p>${list.items.length} total items • ${list.items.filter(i => i.is_purchased).length} purchased</p>
            <p>Printed from BestMealMate • bestmealmate.com</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  // Email list
  const emailList = () => {
    const subject = encodeURIComponent(list.name)
    const body = encodeURIComponent(generateSimpleList())
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  // SMS list
  const smsShare = () => {
    const body = encodeURIComponent(generateSimpleList())
    window.open(`sms:?body=${body}`)
  }

  // Native share
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: list.name,
          text: generateSimpleList()
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Share failed')
        }
      }
    } else {
      copyToClipboard('text')
    }
  }

  const exportOptions = [
    {
      id: 'text' as ExportFormat,
      icon: FileText,
      label: 'Plain Text',
      description: 'Simple text format',
      action: () => downloadFile('text'),
      copyAction: () => copyToClipboard('text')
    },
    {
      id: 'csv' as ExportFormat,
      icon: FileSpreadsheet,
      label: 'Spreadsheet (CSV)',
      description: 'For Excel, Google Sheets',
      action: () => downloadFile('csv'),
      copyAction: () => copyToClipboard('csv')
    },
    {
      id: 'json' as ExportFormat,
      icon: FileText,
      label: 'JSON',
      description: 'For developers',
      action: () => downloadFile('json'),
      copyAction: () => copyToClipboard('json')
    },
    {
      id: 'print' as ExportFormat,
      icon: Printer,
      label: 'Print',
      description: 'Print shopping list',
      action: printList
    },
    {
      id: 'email' as ExportFormat,
      icon: Mail,
      label: 'Email',
      description: 'Send via email',
      action: emailList
    },
    {
      id: 'sms' as ExportFormat,
      icon: MessageSquare,
      label: 'Text Message',
      description: 'Send via SMS',
      action: smsShare
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export List</h2>
            <p className="text-sm text-gray-500">{list.name} • {list.items.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Quick Share */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={nativeShare}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share List
          </button>
        </div>

        {/* Export Options */}
        <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto">
          {exportOptions.map(option => (
            <div
              key={option.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors"
            >
              <div className="p-2 bg-gray-100 rounded-lg">
                <option.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500 truncate">{option.description}</p>
              </div>
              <div className="flex gap-1">
                {option.copyAction && (
                  <button
                    onClick={option.copyAction}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedFormat === option.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
                <button
                  onClick={option.action}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title={option.id === 'print' ? 'Print' : 'Download'}
                >
                  <Download className="w-4 h-4 text-brand-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Export includes {list.items.filter(i => !i.is_purchased).length} unpurchased items
          </p>
        </div>
      </div>
    </div>
  )
}
