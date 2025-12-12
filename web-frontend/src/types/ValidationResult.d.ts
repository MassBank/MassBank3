type ValidationResult = {
  message: string;
  line: number | null;
  column: number | null;
};

export default ValidationResult;
