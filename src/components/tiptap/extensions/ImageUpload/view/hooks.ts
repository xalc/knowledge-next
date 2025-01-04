import { DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { upload } from "@vercel/blob/client";
/* eslint-disable @typescript-eslint/no-explicit-any */
export const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true);
      try {
        const result = await upload(`tt_images/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        onUpload(result.url);
      } catch (errPayload: any) {
        const error = errPayload.message || "Something went wrong";
        toast({
          title: error,
        });
      }
      setLoading(false);
    },
    [onUpload, toast],
  );

  return { loading, uploadFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};

export const useDropZone = ({ uploader }: { uploader: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedInside, setDraggedInside] = useState<boolean>(false);

  useEffect(() => {
    const dragStartHandler = () => {
      setIsDragging(true);
    };

    const dragEndHandler = () => {
      setIsDragging(false);
    };

    document.body.addEventListener("dragstart", dragStartHandler);
    document.body.addEventListener("dragend", dragEndHandler);

    return () => {
      document.body.removeEventListener("dragstart", dragStartHandler);
      document.body.removeEventListener("dragend", dragEndHandler);
    };
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      setDraggedInside(false);
      if (e.dataTransfer.files.length === 0) {
        return;
      }

      const fileList = e.dataTransfer.files;

      const files: File[] = [];

      for (let i = 0; i < fileList.length; i += 1) {
        const item = fileList.item(i);
        if (item) {
          files.push(item);
        }
      }

      if (files.some(file => file.type.indexOf("image") === -1)) {
        return;
      }

      e.preventDefault();

      const filteredFiles = files.filter(f => f.type.indexOf("image") !== -1);

      const file = filteredFiles.length > 0 ? filteredFiles[0] : undefined;

      if (file) {
        uploader(file);
      }
    },
    [uploader],
  );

  const onDragEnter = () => {
    setDraggedInside(true);
  };

  const onDragLeave = () => {
    setDraggedInside(false);
  };

  return { isDragging, draggedInside, onDragEnter, onDragLeave, onDrop };
};
