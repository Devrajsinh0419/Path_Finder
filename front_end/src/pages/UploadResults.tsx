import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Upload, FileText } from 'lucide-react';

export function UploadResults() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('pdf_file', file);

      await api.post('/academics/upload-result-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success!',
        description: 'Your results have been analyzed',
      });

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.error || 'Failed to process PDF',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-2xl">
        <div className="glass-card-strong p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-2">
              Upload Your Grade Sheet
            </h2>
            <p className="text-muted-foreground">
              Upload your semester grade sheet PDF to get personalized career recommendations
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-accent/50 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="max-w-xs mx-auto"
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-4">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleUpload}
                disabled={!file || loading}
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
    </div>
  );
}