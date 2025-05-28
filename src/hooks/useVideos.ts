
import { useState, useEffect } from 'react'
import { supabase, type Video } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: "Error",
        description: "Failed to load videos",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addVideo = async (title: string, file: File, description?: string) => {
    try {
      // Upload video to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName)

      // Save video record to database
      const { data, error } = await supabase
        .from('videos')
        .insert([
          {
            title,
            url: publicUrl,
            description,
            uploaded_by: 'admin' // You can change this to actual user ID later
          }
        ])
        .select()

      if (error) throw error

      await fetchVideos()
      toast({
        title: "Success",
        description: "Video uploaded successfully"
      })

      return data[0]
    } catch (error) {
      console.error('Error adding video:', error)
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive"
      })
      throw error
    }
  }

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchVideos()
      toast({
        title: "Success",
        description: "Video deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return {
    videos,
    loading,
    addVideo,
    deleteVideo,
    refetch: fetchVideos
  }
}
