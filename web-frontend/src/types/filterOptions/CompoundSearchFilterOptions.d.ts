interface CompoundSearchFilterOptions {
  compoundName?: string;
  compoundClass?: string;
  exactMass?: number;
  massTolerance?: number;
  formula?: string;
  inchi?: string;
  structure?: string;
}

export default CompoundSearchFilterOptions;
