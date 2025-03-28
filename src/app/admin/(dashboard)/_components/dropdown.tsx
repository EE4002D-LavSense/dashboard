import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

export const renderFileDropdown = (urls: string[]) => {
  if (!urls || urls.length === 0)
    return <span className="text-gray-400">No files</span>;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          aria-label="Files"
          variant="light"
          size="sm"
          endContent={<ChevronDown className="h-4 w-4" />}
        >
          {urls.length} {urls.length === 1 ? "File" : "Files"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Files">
        {urls.map((url, index) => (
          <DropdownItem key={index} textValue={`File ${index + 1}`}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-blue-500"
              onClick={(e) => e.stopPropagation()}
            >
              File {index + 1}
            </a>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
