// Type declarations for jspdf-autotable
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

declare module 'jspdf-autotable' {
  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: any;
    styles?: any;
    columnStyles?: any;
    margin?: any;
    didDrawPage?: (data: any) => void;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
