
import React, { useRef } from 'react';
import { Video } from '@/pages/Index';
import { Upload, ArrowUp, ArrowDown, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoManagerProps {
  videos: Video[];
  onAddVideo: (file: File) => void;
  onReorderVideos: (startIndex: number, endIndex: number) => void;
  onRemoveVideo: (id: string) => void;
  onResetProgress: () => void;
}

export const VideoManager: React.FC<VideoManagerProps> = ({
  videos,
  onAddVideo,
  onReorderVideos,
  onRemoveVideo,
  onResetProgress
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('video/')) {
          onAddVideo(file);
        }
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        onAddVideo(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < videos.length) {
      onReorderVideos(index, newIndex);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors duration-300 cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Videos</h3>
        <p className="text-gray-600 mb-4">
          Drag and drop video files here, or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports MP4, WebM, and other video formats
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Video Playlist ({videos.length} videos)
              </h3>
              <Button onClick={onResetProgress} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Progress
              </Button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {videos.map((video, index) => (
              <div key={video.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  {/* Order Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      video.watched 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {video.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {video.watched ? 'Completed' : 'Not watched'}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {video.watched && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => moveVideo(index, 'up')}
                      disabled={index === 0}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => moveVideo(index, 'down')}
                      disabled={index === videos.length - 1}
                      variant="ghost"
                      size="sm"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onRemoveVideo(video.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {videos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded</h3>
          <p className="text-gray-500">Upload your first video to get started</p>
        </div>
      )}
    </div>
  );
};
