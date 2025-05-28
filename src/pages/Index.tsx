import React, { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoManager } from '@/components/VideoManager';
import { CertificateGenerator } from '@/components/CertificateGenerator';
import { Play, Upload, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVideos } from '@/hooks/useVideos';
import { useProgress } from '@/hooks/useProgress';

export interface Video {
  id: string;
  name: string;
  url: string;
  duration?: number;
  watched: boolean;
}

export interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  signature: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

const Index = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    studentName: '',
    courseName: 'Video Course Completion',
    completionDate: new Date().toLocaleDateString(),
    signature: 'Course Administrator',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    borderColor: '#3b82f6'
  });

  const { videos: supabaseVideos, loading: videosLoading, addVideo: addSupabaseVideo, deleteVideo } = useVideos();
  const { progress, markVideoCompleted, resetProgress, isVideoCompleted, getCompletedCount } = useProgress();

  // Convert Supabase videos to local format
  const videos: Video[] = supabaseVideos.map(video => ({
    id: video.id,
    name: video.title,
    url: video.url,
    watched: isVideoCompleted(video.id)
  }));

  const allVideosWatched = videos.length > 0 && videos.every(video => video.watched);

  const handleVideoComplete = async () => {
    const currentVideo = videos[currentVideoIndex];
    if (currentVideo) {
      await markVideoCompleted(currentVideo.id);
      
      // Move to next video if available
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      }
    }
  };

  const addVideo = async (file: File) => {
    try {
      await addSupabaseVideo(file.name, file, 'Uploaded video');
    } catch (error) {
      console.error('Failed to add video:', error);
    }
  };

  const reorderVideos = (startIndex: number, endIndex: number) => {
    // Note: Video reordering would require updating the database
    // For now, we'll keep this as a placeholder
    console.log('Video reordering not yet implemented with Supabase');
  };

  const removeVideo = async (id: string) => {
    await deleteVideo(id);
    if (currentVideoIndex >= videos.length - 1) {
      setCurrentVideoIndex(Math.max(0, videos.length - 2));
    }
  };

  const navigateToManage = () => {
    const manageTab = document.querySelector('[value="manage"]') as HTMLElement;
    if (manageTab) {
      manageTab.click();
    }
  };

  const navigateToCertificate = () => {
    const certificateTab = document.querySelector('[value="certificate"]') as HTMLElement;
    if (certificateTab) {
      certificateTab.click();
    }
  };

  if (videosLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Play className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Video Learning Platform
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload your videos, watch them sequentially, and earn your completion certificate
          </p>
        </div>

        {/* Progress Bar */}
        {videos.length > 0 && (
          <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Progress</span>
              <span className="text-sm text-gray-500">
                {getCompletedCount()} / {videos.length} videos completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${videos.length > 0 ? (getCompletedCount() / videos.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="player" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto">
            <TabsTrigger value="player" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Player</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="certificate" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificate</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-6">
            {videos.length > 0 ? (
              <VideoPlayer
                videos={videos}
                currentIndex={currentVideoIndex}
                onVideoComplete={handleVideoComplete}
                onVideoChange={setCurrentVideoIndex}
              />
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Yet</h3>
                <p className="text-gray-600 mb-6">Upload your first video to get started with your course</p>
                <Button onClick={navigateToManage}>
                  Go to Manage Videos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manage">
            <VideoManager
              videos={videos}
              onAddVideo={addVideo}
              onReorderVideos={reorderVideos}
              onRemoveVideo={removeVideo}
              onResetProgress={resetProgress}
            />
          </TabsContent>

          <TabsContent value="certificate">
            <CertificateGenerator
              certificateData={certificateData}
              onUpdateCertificate={setCertificateData}
              allVideosWatched={allVideosWatched}
              totalVideos={videos.length}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Course Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={certificateData.courseName}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, courseName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Administrator Signature
                  </label>
                  <input
                    type="text"
                    value={certificateData.signature}
                    onChange={(e) => setCertificateData(prev => ({ ...prev, signature: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button onClick={resetProgress} variant="outline" className="w-full">
                  Reset All Progress
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Success Message */}
        {allVideosWatched && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full text-center animate-scale-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
              <p className="text-gray-600 mb-6">
                You've completed all videos in the course. Your certificate is ready!
              </p>
              <Button 
                onClick={navigateToCertificate}
                className="w-full"
              >
                View Certificate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
