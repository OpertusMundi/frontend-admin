
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
    suboptions: { [key:number ]: Suboption[] }
    summary?: string[];
    icons?: string[];
    descriptionOfChange: string;
  }

  export interface Suboption {
    id: number;
    body: string;
  }