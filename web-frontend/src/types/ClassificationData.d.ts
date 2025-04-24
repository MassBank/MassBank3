type ClassificationData = {
  labels: string[];
  parents: string[];
  values: number[];
  hashmapParents: Map<string, string>;
  hashmapChildren: Map<string, string[]>;
  hashmapLevels: Map<string, number>;
};

export default ClassificationData;
