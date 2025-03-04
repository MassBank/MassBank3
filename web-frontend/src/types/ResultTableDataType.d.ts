type ResultTableDataType = {
  key: React.Key;
  index: number;
  score: number | string | undefined;
  accession: string | JSX.Element;
  title: string;
  chart: JSX.Element | null;
  structure: JSX.Element | null;
};

export default ResultTableDataType;
