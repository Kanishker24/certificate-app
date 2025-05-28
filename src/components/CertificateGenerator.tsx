
import React, { useRef } from 'react';
import { CertificateData } from '@/pages/Index';
import { Download, Award, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onUpdateCertificate: (data: CertificateData) => void;
  allVideosWatched: boolean;
  totalVideos: number;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificateData,
  onUpdateCertificate,
  allVideosWatched,
  totalVideos
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof CertificateData, value: string) => {
    onUpdateCertificate({ ...certificateData, [field]: value });
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: certificateData.backgroundColor,
        width: 800,
        height: 600
      });
      
      const link = document.createElement('a');
      link.download = `${certificateData.studentName || 'Certificate'}_${certificateData.courseName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating certificate:', error);
      // Fallback: create a simple text version
      const content = `
Certificate of Completion

This certifies that
${certificateData.studentName || '[Student Name]'}

has successfully completed the course
${certificateData.courseName}

Completion Date: ${certificateData.completionDate}
Videos Completed: ${totalVideos}

${certificateData.signature}
Course Administrator
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${certificateData.studentName || 'Certificate'}_${certificateData.courseName.replace(/\s+/g, '_')}.txt`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Editor */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Edit className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Certificate Editor</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="studentName">Student Name</Label>
            <input
              id="studentName"
              type="text"
              value={certificateData.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              placeholder="Enter student name"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="courseName">Course Name</Label>
            <input
              id="courseName"
              type="text"
              value={certificateData.courseName}
              onChange={(e) => updateField('courseName', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="signature">Administrator Signature</Label>
            <input
              id="signature"
              type="text"
              value={certificateData.signature}
              onChange={(e) => updateField('signature', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="completionDate">Completion Date</Label>
            <input
              id="completionDate"
              type="date"
              value={certificateData.completionDate}
              onChange={(e) => updateField('completionDate', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <input
              id="backgroundColor"
              type="color"
              value={certificateData.backgroundColor}
              onChange={(e) => updateField('backgroundColor', e.target.value)}
              className="w-full mt-1 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <input
              id="textColor"
              type="color"
              value={certificateData.textColor}
              onChange={(e) => updateField('textColor', e.target.value)}
              className="w-full mt-1 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <Label htmlFor="borderColor">Border Color</Label>
            <input
              id="borderColor"
              type="color"
              value={certificateData.borderColor}
              onChange={(e) => updateField('borderColor', e.target.value)}
              className="w-full mt-1 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Certificate Preview</h3>
          </div>
          <Button
            onClick={downloadCertificate}
            disabled={!allVideosWatched}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Certificate
          </Button>
        </div>

        {!allVideosWatched && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Complete all {totalVideos} videos to unlock your certificate download.
            </p>
          </div>
        )}

        {/* Certificate Design */}
        <div className="flex justify-center">
          <div
            ref={certificateRef}
            className="relative w-full max-w-4xl aspect-[4/3] border-8 rounded-lg shadow-lg"
            style={{
              backgroundColor: certificateData.backgroundColor,
              borderColor: certificateData.borderColor,
              color: certificateData.textColor
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: certificateData.borderColor }} />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: certificateData.borderColor }} />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: certificateData.borderColor }} />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: certificateData.borderColor }} />

            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: certificateData.borderColor }}>
                  Certificate of Completion
                </h1>
                <div className="w-24 h-1 mx-auto" style={{ backgroundColor: certificateData.borderColor }} />
              </div>

              {/* Main Content */}
              <div className="mb-8 space-y-4">
                <p className="text-lg">This certifies that</p>
                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: certificateData.borderColor }}>
                  {certificateData.studentName || '[Student Name]'}
                </h2>
                <p className="text-lg">has successfully completed the course</p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {certificateData.courseName}
                </h3>
                <p className="text-base">
                  Videos Completed: {totalVideos}
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto flex justify-between items-end w-full">
                <div className="text-left">
                  <p className="text-sm mb-2">Completion Date:</p>
                  <p className="text-base font-semibold">{certificateData.completionDate}</p>
                </div>
                <div className="text-right">
                  <div className="w-32 border-b-2 mb-2" style={{ borderColor: certificateData.textColor }} />
                  <p className="text-sm">{certificateData.signature}</p>
                  <p className="text-xs text-gray-600">Course Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
