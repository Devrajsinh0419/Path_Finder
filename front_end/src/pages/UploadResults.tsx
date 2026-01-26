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

      const response = await api.post('/academics/upload-result-pdf/', formData,);

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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="glass-card-strong p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-2">
              Upload Your Grade Sheets
            </h2>
            <p className="text-muted-foreground">
              Upload grade sheets for each semester. You can skip semesters you don't have yet.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <div
                key={sem}
                className="border border-border/50 rounded-lg p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    {semesterNames[sem - 1]} Semester
                  </label>
                  {files[sem] && (
                    <button
                      onClick={() => removeFile(sem)}
                      className="text-red-500 hover:text-red-600"
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
                      className="cursor-pointer"
                    />
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                ) : (
                  <div className="bg-accent/10 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-sm">{files[sem].name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {(files[sem].size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
            <div className="flex gap-4 mb-6">
  <Button
    onClick={handleUpload}
    disabled={loading || !Object.values(files).some(f => f !== null)}
    variant="accent"
    size="lg"
    className="flex-1"
  >
    {loading ? 'Processing...' : 'Upload & Analyze'}
  </Button>
  
  <Button
    onClick={() => navigate('/manual-marks-entry')}
    variant="outline"
    size="lg"
    className="flex-1"
  >
    Enter Marks Manually
  </Button>
</div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-400">
              💡 <strong>Tip:</strong> You can upload results for any semesters you've completed. 
              The analysis will be based on the data you provide.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleUpload}
              disabled={loading || !Object.values(files).some(f => f !== null)}
              variant="accent"
              size="lg"
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Upload & Analyze'}
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}