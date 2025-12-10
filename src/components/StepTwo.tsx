import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface StepTwoProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData: any;
}

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  type: string;
}

export function StepTwo({ onNext, onBack, initialData }: StepTwoProps) {
  const [transcript12, setTranscript12] = useState<UploadedFile | null>(initialData.transcript12 || null);
  const [bachelorTranscript, setBachelorTranscript] = useState<UploadedFile | null>(initialData.bachelorTranscript || null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleFileUpload = (
    file: File,
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5 MB limit");
      return;
    }

    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      progress: 0,
      type: file.type,
    };

    setter(uploadedFile);

    // Simulate upload progress
    const interval = setInterval(() => {
      setter((prev) => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 10, 100);
        if (newProgress === 100) {
          clearInterval(interval);
        }
        return { ...prev, progress: newProgress };
      });
    }, 100);
  };

  const handleDrop = (
    e: React.DragEvent,
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, setter);
    }
  };

  const handleFileInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, setter);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleNext = () => {
    onNext({ transcript12, bachelorTranscript });
  };

  const UploadCard = ({
    title,
    file,
    setter,
    id,
  }: {
    title: string;
    file: UploadedFile | null;
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>;
    id: string;
  }) => (
    <div
      className={`border-2 border-dashed rounded-xl p-6 transition-all ${
        dragOver === id
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(id);
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => handleDrop(e, setter)}
    >
      {!file ? (
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-gray-400 mb-4">PDF, JPG, PNG (Max 5 MB)</p>
          <label htmlFor={id}>
            <Button type="button" variant="outline" asChild>
              <span>Upload File</span>
            </Button>
          </label>
          <input
            id={id}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileInput(e, setter)}
          />
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setter(null)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {file.progress < 100 ? (
            <div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">{file.progress}% uploaded</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Upload complete</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto lg:mx-0">
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step 2 of 4</span>
              <span className="text-sm text-gray-600">Documents</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          <h1 className="text-center mb-2">Upload Your Academic Documents</h1>
          <p className="text-center text-gray-600 mb-6">
            Your documents help us match you to verified scholarships
          </p>

          <div className="space-y-4 mb-6">
            <UploadCard
              title="+2 Transcript / Certificate"
              file={transcript12}
              setter={setTranscript12}
              id="transcript12"
            />
            <UploadCard
              title="Bachelor Transcript / Certificate"
              file={bachelorTranscript}
              setter={setBachelorTranscript}
              id="bachelorTranscript"
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              ← Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1"
              style={{ backgroundColor: '#007BFF' }}
            >
              Next →
            </Button>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1518893560155-b89cac6db0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHVwbG9hZCUyMHBhcGVyc3xlbnwxfHx8fDE3NjIzMjQxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Document upload"
              className="rounded-2xl shadow-2xl w-full max-w-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
              <p className="text-sm">📄 Secure & encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
