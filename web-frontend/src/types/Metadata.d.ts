export default interface Metadata {
  git_commit: string;
  version: string;
  timestamp: string;
  spectra_count: number;
  compound_count: number;
  compound_class: { name: string; count: number }[];
  compound_class_chemont: { name: string; count: number }[];
}
