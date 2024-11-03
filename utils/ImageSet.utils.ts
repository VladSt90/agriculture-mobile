import ImageSet from "@/models/ImageSet";
import * as FileSystem from "expo-file-system";

const IMAGESETS_DIR = FileSystem.documentDirectory + "imagesets/";

/**
 * Retrieves the paths of all image set folders.
 * @returns {Promise<string[]>} A promise that resolves to an array of folder paths.
 */
export const getAllImageSetFolderPaths = async (): Promise<string[]> => {
  try {
    // Check if the 'imagesets' directory exists
    const imagesetsDirInfo = await FileSystem.getInfoAsync(IMAGESETS_DIR);
    if (!imagesetsDirInfo.exists) {
      // If the directory doesn't exist, return an empty array
      return [];
    }

    // Read the contents of the 'imagesets' directory
    const folderNames = await FileSystem.readDirectoryAsync(IMAGESETS_DIR);

    // Construct full paths for each folder
    const folderPaths = folderNames.map(
      (folderName) => `${IMAGESETS_DIR}${folderName}/`
    );

    return folderPaths;
  } catch (error) {
    console.error("Error retrieving image set folder paths:", error);
    throw error;
  }
};

/**
 * Load an ImageSet based on the title.
 * It reads the meta.json file within the folder of the specified title.
 * @param title - The title of the ImageSet to load
 * @returns A promise that resolves to an ImageSet instance or null if not found.
 */
export async function loadImageSetByTitle(
  title: string
): Promise<ImageSet | null> {
  const folderPath = getImageSetFolderPath(title);
  const metaFilePath = folderPath + "meta.json";

  try {
    // Check if the image set folder exists
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      console.warn(`ImageSet with title "${title}" not found.`);
      return null;
    }

    // Load and parse meta.json
    const metaFile = await FileSystem.readAsStringAsync(metaFilePath);
    const metaData = JSON.parse(metaFile);

    // Create an ImageSet instance from the parsed data
    return ImageSet.fromJSON({ ...metaData });
  } catch (error) {
    console.error(`Failed to load ImageSet with title "${title}":`, error);
    return null;
  }
}

/**
 * Load all ImageSets from the imagesets directory.
 * It reads each subfolder in the imagesets directory and loads meta.json for each ImageSet.
 * @returns A promise that resolves to an array of ImageSet instances.
 */
export async function loadAllImageSets(): Promise<ImageSet[]> {
  try {
    const imageSets: ImageSet[] = [];

    const imageSetsFolders = await getAllImageSetFolderPaths();

    for (const folderPath of imageSetsFolders) {
      const metaFilePath = folderPath + "meta.json";

      try {
        // Load and parse meta.json for each ImageSet
        const metaFile = await FileSystem.readAsStringAsync(metaFilePath);
        const imageSet = ImageSet.fromJSON(metaFile);

        imageSets.push(imageSet);
      } catch (error) {
        console.warn(
          `Failed to load ImageSet from folder "${folderPath}":`,
          error
        );
      }
    }

    return imageSets;
  } catch (error) {
    console.error("Failed to load all ImageSets:", error);
    return [];
  }
}

export const saveImageSet = async (imageSet: ImageSet) => {
  // Ensure the 'imagesets' directory exists
  const imagesetsDirInfo = await FileSystem.getInfoAsync(IMAGESETS_DIR);
  if (!imagesetsDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(IMAGESETS_DIR, { intermediates: true });
  }

  // Define the path for the specific ImageSet directory
  const imageSetDir = getImageSetFolderPath(imageSet);

  // Check if the ImageSet directory already exists
  const imageSetDirInfo = await FileSystem.getInfoAsync(imageSetDir);
  if (imageSetDirInfo.exists) {
    throw new Error(`ImageSet with title "${imageSet.title}" already exists.`);
  }

  // Create the ImageSet directory
  await FileSystem.makeDirectoryAsync(imageSetDir);

  // Prepare the meta.json content
  const metaContent = imageSet.toJSON();

  // Define the path for the meta.json file
  const metaFilePath = `${imageSetDir}meta.json`;

  // Write the meta.json file
  await FileSystem.writeAsStringAsync(metaFilePath, metaContent);
};

/**
 * Retrieves the folder path for a given image set.
 * @param imageSet - The ImageSet object.
 * @returns The folder path corresponding to the image set.
 */
export function getImageSetFolderPath(imageSet: ImageSet): string;

/**
 * Retrieves the folder path for a given image set title.
 * @param imageSetTitle - The title of the image set.
 * @returns The folder path corresponding to the image set title.
 */
export function getImageSetFolderPath(imageSetTitle: string): string;

/**
 * Implementation of getImageSetFolderPath.
 * @param imageSetOrTitle - Either an ImageSet object or a string title.
 * @returns The folder path corresponding to the image set.
 */
export function getImageSetFolderPath(
  imageSetOrTitle: ImageSet | string
): string {
  const title =
    typeof imageSetOrTitle === "string"
      ? imageSetOrTitle
      : imageSetOrTitle.title;
  return `${IMAGESETS_DIR}${title}/`;
}

/**
 * Updates the metadata of an existing ImageSet in the filesystem.
 *
 * @param {ImageSet} imageSet - The ImageSet object containing updated metadata.
 * @throws Will throw an error if the ImageSet folder or meta.json file does not exist.
 */
export async function updateImageSet(imageSet: ImageSet): Promise<void> {
  // Get the folder path for the specified ImageSet
  const folderPath = getImageSetFolderPath(imageSet);
  const metaFilePath = `${folderPath}meta.json`;

  try {
    // Check if the ImageSet folder exists
    const folderInfo = await FileSystem.getInfoAsync(folderPath);
    if (!folderInfo.exists) {
      throw new Error(
        `Folder for ImageSet "${imageSet.title}" does not exist.`
      );
    }

    // Write the updated metadata to meta.json
    await FileSystem.writeAsStringAsync(metaFilePath, imageSet.toJSON());
    console.log(`ImageSet "${imageSet.title}" metadata updated successfully.`);
  } catch (error) {
    console.error(`Failed to update ImageSet "${imageSet.title}":`, error);
    throw error;
  }
}
