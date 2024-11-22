import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ResumeUploader from '../components/ResumeUploader';
import { api } from '../services/api';

export default function Upload() {
  const navigate = useNavigate();

  const handleUpload = async (content: string) => {
    try {
      const response = await api.uploadResume(content);
      localStorage.setItem('session_id', response.session_id);
      toast.success('Resume uploaded successfully');
      navigate('/interview');
    } catch (error) {
      console.error('Error handling resume:', error);
      toast.error('Failed to upload resume');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload your resume to get personalized interview preparation
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <ResumeUploader onUpload={handleUpload} />
        </div>
      </div>
    </div>
  );
}