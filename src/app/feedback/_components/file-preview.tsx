export function FilePreview({ files }: { files: FileList | null }) {
  return (
    <>
      {files && files.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">
            {files.length} file(s) selected
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="relative h-16 w-16 overflow-hidden rounded"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
