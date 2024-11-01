import * as FileSystem from 'expo-file-system';

class ImageSet {
  title: string;
  description: string;
  startTime: string;
  endTime?: string;  // Optional until capturing ends
  folderName: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this.startTime = new Date().toISOString();
    this.folderName = `${this.title}_${Date.now()}`;
  }

  // Generates the folder structure for the image set
  async initializeFolderStructure() {
    const appFolder = `${FileSystem.documentDirectory}myAppFolder`;
    const imageSetsFolder = `${appFolder}/imageSets`;
    const imageSetFolder = `${imageSetsFolder}/${this.folderName}`;

    await FileSystem.makeDirectoryAsync(appFolder, { intermediates: true });
    await FileSystem.makeDirectoryAsync(imageSetsFolder, { intermediates: true });
    await FileSystem.makeDirectoryAsync(imageSetFolder, { intermediates: true });

    return imageSetFolder;
  }

  // Save metadata as a JSON file in the image set folder
  async saveMetadata() {
    const imageSetFolder = await this.initializeFolderStructure();
    const metaFilePath = `${imageSetFolder}/meta.json`;

    const metadata = {
      title: this.title,
      description: this.description,
      startTime: this.startTime,
      endTime: this.endTime || null,
    };

    await FileSystem.writeAsStringAsync(metaFilePath, JSON.stringify(metadata, null, 2));
  }

  // Call this when ending the capture to set the end time and update metadata
  async endCapture() {
    this.endTime = new Date().toISOString();
    await this.saveMetadata();
  }
}

export default ImageSet;
