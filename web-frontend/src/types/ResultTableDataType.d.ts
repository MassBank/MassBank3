type ResultTableDataType = {
  key: React.Key;
  index: number;
  score: number | string | undefined;
  accession: string | JSX.Element;
  title: string;
  chart: JSX.Element;
  structure: JSX.Element;
};

export default ResultTableDataType;
