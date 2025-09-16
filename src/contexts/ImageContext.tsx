import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { toast } from "sonner";

type ImageContextType = {
  imageList: File[];
  previewImageList: string[];
  addImageList: (files: File[], minimal?: number) => void;
  setImageList: Dispatch<SetStateAction<File[]>>;
  deleteImage: (index: number) => void;
};

const ImageContext = createContext<ImageContextType | null>(null);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [imageList, setImageList] = useState<File[]>([]);
  const [previewImageList, setPreivewImageList] = useState<string[]>([]);

  const addImageList = (files: File[], minimal?: number) => {
    if (files && files.length > 0) {
      if (minimal && imageList.length + files.length > minimal) {
        toast.warning(`You can upload a maximum of ${minimal} images`);
        return;
      }
    }
    const filesArray = Array.from(files);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setPreivewImageList((prev) => [...prev, ...newPreviews]);
    setImageList((prev) => [...prev, ...filesArray]);
  };

  const deleteImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i != index));
    setPreivewImageList((prev) => prev.filter((_, i) => i != index));
  };
  return (
    <ImageContext.Provider
      value={{
        imageList,
        previewImageList,
        addImageList,
        setImageList,
        deleteImage,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImage must be used within ImageProvider");
  }
  return context;
};
