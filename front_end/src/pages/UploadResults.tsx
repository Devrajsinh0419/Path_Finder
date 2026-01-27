import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Upload, FileText, X } from 'lucide-react';

export function UploadResults() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ [key: number]: File | null }>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (semester: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file',
          variant: 'destructive',
        });
        return;
      }
      
      setFiles(prev => ({ ...prev, [semester]: selectedFile }));
    }
  };

  const removeFile = (semester: number) => {
    setFiles(prev => ({ ...prev, [semester]: null }));
  };

  const handleUpload = async () => {
    // Check if at least one file is selected
    const hasFiles = Object.values(files).some(file => file !== null);
    
    if (!hasFiles) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one PDF file to upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all selected files
      Object.entries(files).forEach(([semester, file]) => {
        if (file) {
          formData.append(`semester_${semester}`, file);
        }
      });

      const response = await api.post('/academics/upload-result-pdf/', formData);

      toast({
        title: 'Success!',
        description: response.data.message,
      });

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'Failed to process PDFs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const semesterNames = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="glass-card-strong p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
          {/* Header - Mobile Optimized */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              Upload Your Grade Sheets
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-0">
              Upload grade sheets for each semester. You can skip semesters you don't have yet.
            </p>
          </div>

          {/* File Upload Cards - Mobile Optimized */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <div
                key={sem}
                className="border border-border/50 rounded-lg p-3 sm:p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-sm font-medium">
                    {semesterNames[sem - 1]} Semester
                  </label>
                  {files[sem] && (
                    <button
                      onClick={() => removeFile(sem)}
                      className="text-red-500 hover:text-red-600 p-1 sm:p-0"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {!files[sem] ? (
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(sem, e)}
                      className="cursor-pointer h-10 sm:h-12 text-xs sm:text-sm"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
                  </div>
                ) : (
                  <div className="bg-accent/10 rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{files[sem].name}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">
                      {(files[sem].size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Manual Entry Button - Mobile Optimized */}
          <div className="mb-4 sm:mb-6">
            <Button
              onClick={() => navigate('/manual-marks-entry')}
              variant="outline"
              size="lg"
              className="w-full h-10 sm:h-12 text-xs sm:text-sm"
            >
              Enter Marks Manually
            </Button>
          </div>

          {/* Tip Box - Mobile Optimized */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-blue-400">
              💡 <strong>Tip:</strong> You can upload results for any semesters you've completed. 
              The analysis will be based on the data you provide.
            </p>
          </div>

          {/* Action Buttons - Mobile: Stack vertically, Desktop: Side-by-side */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleUpload}
              disabled={loading || !Object.values(files).some(f => f !== null)}
              variant="accent"
              size="lg"
              className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base order-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base order-2"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}