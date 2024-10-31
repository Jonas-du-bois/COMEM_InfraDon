// src/types/database.types.ts

export interface DatabaseDocument {
    _id?: string;
    _rev?: string;
    title: string;
    content: string;
    createdAt: string;
  }
  
  export interface DatabaseResponse {
    ok: boolean;
    id: string;
    rev: string;
  }
  
  export interface DatabaseError {
    status: number;
    message: string;
    error?: any;
  }