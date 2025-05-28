
import { useState, useEffect } from 'react'
import { supabase, type Progress } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useProgress = (userId: string = 'guest') => {
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      setProgress(data || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
      toast({
        title: "Error",
        description: "Failed to load progress",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const markVideoCompleted = async (videoId: string) => {
    try {
      // Check if progress already exists
      const { data: existing } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('video_id', videoId)
        .single()

      if (existing) {
        // Update existing progress
        const { error } = await supabase
          .from('progress')
          .update({ 
            completed: true, 
            completed_at: new Date().toISOString() 
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new progress record
        const { error } = await supabase
          .from('progress')
          .insert([
            {
              user_id: userId,
              video_id: videoId,
              completed: true,
              completed_at: new Date().toISOString()
            }
          ])

        if (error) throw error
      }

      await fetchProgress()
      toast({
        title: "Progress saved",
        description: "Video marked as completed"
      })
    } catch (error) {
      console.error('Error updating progress:', error)
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      })
    }
  }

  const resetProgress = async () => {
    try {
      const { error } = await supabase
        .from('progress')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      setProgress([])
      toast({
        title: "Progress reset",
        description: "All progress has been cleared"
      })
    } catch (error) {
      console.error('Error resetting progress:', error)
      toast({
        title: "Error",
        description: "Failed to reset progress",
        variant: "destructive"
      })
    }
  }

  const isVideoCompleted = (videoId: string) => {
    return progress.some(p => p.video_id === videoId && p.completed)
  }

  const getCompletedCount = () => {
    return progress.filter(p => p.completed).length
  }

  useEffect(() => {
    fetchProgress()
  }, [userId])

  return {
    progress,
    loading,
    markVideoCompleted,
    resetProgress,
    isVideoCompleted,
    getCompletedCount,
    refetch: fetchProgress
  }
}
