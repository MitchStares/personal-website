export interface LayerCount {
    id: string;
    name: string;
    count: number;
  }

  //Rbush/Typescript likes to be precious. Needs it own structure
export interface RBushItem {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    feature: any;
  }
  export interface AttributeCounter {
    layerId: string;
    attribute: string;
    counts?: { [key: string]: number };
  }