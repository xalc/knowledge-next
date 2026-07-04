import { Spinner } from "@/components/ui/spinner";
import { useDropZone, useFileUpload, useUploader } from "./hooks";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { ChangeEvent, useCallback } from "react";
import { X, Upload as UploadIcon } from "lucide-react";

export const ImageUploader = ({
  onUpload,
  onRemove,
}: {
  onUpload: (url: string) => void;
  onRemove?: () => void;
}) => {
  const { loading, uploadFile, cancelUpload } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({ uploader: uploadFile });

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => (e.target.files ? uploadFile(e.target.files[0]) : null),
    [uploadFile],
  );

  const handleClose = useCallback(() => {
    cancelUpload();
    onRemove?.();
  }, [cancelUpload, onRemove]);

  if (loading) {
    return (
      <div
        className="relative flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted/30 p-8"
        contentEditable={false}
      >
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7 rounded-full text-muted-foreground hover:bg-background"
            onClick={handleClose}
            title="取消上传"
            aria-label="取消上传"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Spinner className="text-neutral-500" size={1.5} />
        <div className="text-sm text-muted-foreground">正在上传...</div>
        <Button variant="secondary" size="sm" onClick={handleClose}>
          取消上传
        </Button>
      </div>
    );
  }

  const wrapperClass = cn(
    "relative flex flex-col items-center justify-center px-8 py-10 rounded-lg border border-dashed border-border bg-muted/20 transition-colors",
    draggedInside && "bg-neutral-100 border-solid",
  );

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
    >
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7 rounded-full text-muted-foreground hover:bg-background"
          onClick={onRemove}
          title="移除"
          aria-label="移除"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <Icon name="Image" className="mb-4 h-12 w-12 text-black opacity-20 dark:text-white" />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center text-sm font-medium text-neutral-400 dark:text-neutral-500">
          {draggedInside ? "Drop image here" : "Drag and drop or"}
        </div>
        <div>
          <Button disabled={draggedInside} onClick={handleUploadClick} variant="default" size="sm">
            <UploadIcon className="mr-1 h-4 w-4" />
            Upload an image
          </Button>
        </div>
      </div>
      <input
        className="h-0 w-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
    </div>
  );
};

export default ImageUploader;
