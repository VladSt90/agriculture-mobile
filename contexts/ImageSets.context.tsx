import ImageSet from "@/models/ImageSet";
import { loadAllImageSets } from "@/utils/ImageSet.utils";
import React, { createContext, ReactNode, useState } from "react";

interface ImagesetsContextType {
  imageSets: ImageSet[];
  refreshImagesSets: () => Promise<void>;
}

export const ImagesetsContext = createContext<ImagesetsContextType>(
  undefined as unknown as ImagesetsContextType
);

interface ImagesetsProviderProps {
  children: ReactNode;
}

export const ImagesetsProvider: React.FC<ImagesetsProviderProps> = ({
  children,
}) => {
  const [imageSets, setImageSets] = useState<ImageSet[]>([]);

  const refreshImagesSets = async () => {
    const sets = await loadAllImageSets();
    setImageSets(sets);
  };

  // useEffect(() => {
  //   refreshImagesSets();
  // });

  return (
    <ImagesetsContext.Provider value={{ imageSets, refreshImagesSets }}>
      {children}
    </ImagesetsContext.Provider>
  );
};
