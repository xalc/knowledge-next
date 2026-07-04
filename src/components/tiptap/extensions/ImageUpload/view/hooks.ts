import { DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { upload } from "@vercel/blob/client";

export const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const uploadFile = useCallback(
    async (file: File) => {
      // 已有上传正在进行时，直接返回
      if (loading) return;
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const result = await upload(`tt_images/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          abortSignal: abortRef.current.signal,
        });

        onUpload(result.url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (errPayload: any) {
        // 主动取消：不弹错误
        if (errPayload?.name === "AbortError" || abortRef.current?.signal.aborted) return;
        const error = errPayload?.message || "Something went wrong";
        toast({ title: error });
      }
      setLoading(false);
      abortRef.current = null;
    },
    [onUpload, toast, loading],
  );

  const cancelUpload = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
    abortRef.current = null;
  }, []);

  return { loading, uploadFile, cancelUpload };
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
