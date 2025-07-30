import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, File, Image, Video, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploaderProps {
  bucket?: string;
  allowedTypes?: string[];
  maxSize?: number; // in MB
  onUpload?: (files: UploadedFile[]) => void;
}

const FileUploader = ({ 
  bucket = 'course-materials',
  allowedTypes = ['image/*', 'video/*', 'application/pdf'],
  maxSize = 100,
  onUpload
}: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileIndex = files.length + i;

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setFiles(prev => prev.map((f, index) => 
          index === fileIndex 
            ? { ...f, status: 'error' as const }
            : f
        ));
        toast({
          title: "Archivo muy grande",
          description: `${file.name} excede el tamaño máximo de ${maxSize}MB`,
          variant: "destructive"
        });
        continue;
      }

      // Validate file type
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -2));
        }
        return file.type === type;
      });

      if (!isValidType) {
        setFiles(prev => prev.map((f, index) => 
          index === fileIndex 
            ? { ...f, status: 'error' as const }
            : f
        ));
        toast({
          title: "Tipo de archivo no válido",
          description: `${file.name} no es un tipo de archivo permitido`,
          variant: "destructive"
        });
        continue;
      }

      try {
        // Use the upload-file edge function
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);

        const { data, error } = await supabase.functions.invoke('upload-file', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (error) throw error;

        setFiles(prev => prev.map((f, index) => 
          index === fileIndex 
            ? { 
                ...f, 
                progress: 100, 
                status: 'completed' as const,
                url: data.url
              }
            : f
        ));

        toast({
          title: "Archivo subido",
          description: `${file.name} se ha subido correctamente`
        });

      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map((f, index) => 
          index === fileIndex 
            ? { ...f, status: 'error' as const }
            : f
        ));
        toast({
          title: "Error de subida",
          description: `No se pudo subir ${file.name}`,
          variant: "destructive"
        });
      }
    }

    // Call onUpload callback
    if (onUpload) {
      const completedFiles = files.filter(f => f.status === 'completed');
      onUpload(completedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (type.startsWith('video/')) return <Video className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Archivos</CardTitle>
        <CardDescription>
          Arrastra y suelta archivos aquí o haz clic para seleccionar. 
          Tamaño máximo: {maxSize}MB
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">
            {dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí'}
          </p>
          <p className="text-sm text-muted-foreground">
            o haz clic para seleccionar archivos
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Archivos</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <div className="w-16">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}
                  
                  {file.status === 'completed' && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                  
                  {file.status === 'error' && (
                    <X className="h-5 w-5 text-red-600" />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <Button 
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Seleccionar Archivos
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploader;