
export interface Section {
    id?: number | undefined;
    indent: number;
    index: string;
    title: string;
    variable: boolean;
    optional: boolean;
    dynamic: boolean;
    options: string[];
    styledOptions: string[];
    summary?: string[];
    icons?: string[];
    descriptionOfChange: string;
  }
