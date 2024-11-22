import { useState } from 'react';
import { Upload } from 'lucide-react';

interface ResumeUploaderProps {
  onUpload: (content: string) => Promise<void>;
}

export default function ResumeUploader({ onUpload }: ResumeUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const content = await file.text();
      await onUpload(content);
    } catch (error) {
      console.error('Error reading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          disabled={loading}
        />
      </label>
      {loading && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Processing your resume...
        </div>
      )}
    </div>
  );
}