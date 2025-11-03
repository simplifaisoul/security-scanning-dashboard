import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../services/api'

// Hook for getting recent scans
export const useRecentScans = (limit = 10) => {
  return useQuery(
    ['scans', 'recent', limit],
    async () => {
      const { data } = await api.get(`/scans?limit=${limit}`)
      return data
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

// Hook for getting scan history
export const useScanHistory = (limit = 50) => {
  return useQuery(
    ['scans', 'history', limit],
    async () => {
      const { data } = await api.get(`/scans?limit=${limit}`)
      return data
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

// Hook for getting single scan
export const useScan = (scanId) => {
  return useQuery(
    ['scan', scanId],
    async () => {
      const { data } = await api.get(`/scans/${scanId}`)
      return data
    },
    {
      enabled: !!scanId,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  )
}

// Hook for getting scan status
export const useScanStatus = (scanId) => {
  return useQuery(
    ['scan', scanId, 'status'],
    async () => {
      const { data } = await api.get(`/scans/${scanId}/status`)
      return data
    },
    {
      enabled: !!scanId,
      refetchInterval: 2000, // Poll every 2 seconds
    }
  )
}

// Hook for executing scans
export const useExecuteScan = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (scanData) => {
      const { data } = await api.post('/scans', scanData)
      return data
    },
    {
      onSuccess: (data) => {
        // Invalidate related queries
        queryClient.invalidateQueries('scans')
        queryClient.invalidateQueries('stats')
      },
      onError: (error) => {
        console.error('Scan execution failed:', error)
      },
    }
  )
}

// Hook for deleting scans
export const useDeleteScan = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    async (scanId) => {
      await api.delete(`/scans/${scanId}`)
      return scanId
    },
    {
      onSuccess: () => {
        // Invalidate related queries
        queryClient.invalidateQueries('scans')
        queryClient.invalidateQueries('stats')
      },
    }
  )
}

// Hook for getting tool configuration
export const useToolConfig = (toolId) => {
  return useQuery(
    ['tool', toolId, 'config'],
    async () => {
      // Mock tool configuration - in real app, this would come from API
      const toolConfigs = {
        nmap: {
          fields: [
            { name: 'target', label: 'Target IP/Domain', type: 'text', required: true },
            { name: 'ports', label: 'Ports', type: 'text', default: '22,80,443' },
            { name: 'scan_type', label: 'Scan Type', type: 'select', options: ['syn', 'connect', 'udp'], default: 'syn' },
            { name: 'timing', label: 'Timing Template', type: 'select', options: ['T0', 'T1', 'T2', 'T3', 'T4', 'T5'], default: 'T3' },
          ]
        },
        nikto: {
          fields: [
            { name: 'target', label: 'Target URL', type: 'text', required: true },
            { name: 'ports', label: 'Ports', type: 'text', default: '80,443' },
          ]
        },
        sqlmap: {
          fields: [
            { name: 'target', label: 'Target URL', type: 'text', required: true },
            { name: 'data', label: 'POST Data', type: 'text' },
            { name: 'level', label: 'Test Level', type: 'select', options: [1, 2, 3, 4, 5], default: 1 },
            { name: 'risk', label: 'Risk Level', type: 'select', options: [1, 2, 3], default: 1 },
          ]
        },
        wpscan: {
          fields: [
            { name: 'target', label: 'WordPress URL', type: 'text', required: true },
            { name: 'enumerate', label: 'Enumerate', type: 'select', options: ['plugins', 'themes', 'users', 'all'], default: 'all' },
          ]
        },
        dirb: {
          fields: [
            { name: 'target', label: 'Target URL', type: 'text', required: true },
            { name: 'wordlist', label: 'Wordlist', type: 'text', default: '/usr/share/dirb/wordlists/common.txt' },
            { name: 'extensions', label: 'Extensions', type: 'text', default: 'php,html,txt' },
          ]
        },
        searchsploit: {
          fields: [
            { name: 'term', label: 'Search Term', type: 'text', required: true },
            { name: 'limit', label: 'Result Limit', type: 'number', default: 20 },
          ]
        },
      }
      
      return toolConfigs[toolId] || { fields: [] }
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}

// Hook for getting system stats
export const useSystemStats = () => {
  return useQuery(
    ['stats', 'system'],
    async () => {
      // Mock system stats - in real app, this would come from API
      return {
        totalScans: 156,
        activeScans: 2,
        completedToday: 12,
        threatsFound: 8,
        scansTrend: 15,
        completionTrend: 8,
        threatsTrend: -5,
        systemStatus: {
          cpu: 45,
          memory: 62,
          disk: 38,
        },
      }
    },
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 30 * 1000, // Refresh every 30 seconds
    }
  )
}

// Hook for exporting scan results
export const useExportScan = () => {
  return useMutation(
    async ({ scanId, format }) => {
      const { data } = await api.post(`/scans/${scanId}/export`, { format })
      return data
    },
    {
      onSuccess: (data, variables) => {
        // Handle file download
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank')
        }
      },
    }
  )
}