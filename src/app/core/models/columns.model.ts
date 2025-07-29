export interface Column {
  columnDef: string;
  header: string;
  icons?: {
    name: string;
    action: string;
    tooltip?: string;
  }[];
}
