interface ImageSetParams {
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
}

class ImageSet {
  title: string;
  description: string;
  startTime: Date;
  endTime?: Date;

  constructor({ title, description, startTime, endTime }: ImageSetParams) {
    this.title = title;
    this.description = description || "";
    this.startTime = startTime;
    this.endTime = endTime;
  }

  // Method to update the endTime, if needed
  setEndTime(endTime: Date) {
    this.endTime = endTime;
  }

  // Method to convert ImageSet instance to a JSON object
  toJSON() {
    return JSON.stringify({
      title: this.title,
      description: this.description,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime?.toISOString(),
    });
  }

  // Static method to create an ImageSet instance from a JSON object
  static fromJSON(json: string) {
    const { title, description, startTime, endTime } = JSON.parse(json);
    return new ImageSet({
      title,
      description,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : undefined,
    });
  }
}

export default ImageSet;
