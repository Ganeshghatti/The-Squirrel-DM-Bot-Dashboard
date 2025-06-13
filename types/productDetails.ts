export interface ProductDetailsInput {
  company_instagram_id: string;
  text_content: string;
}

export interface ProductDetailsDocument extends ProductDetailsInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDetailsResponse {
  success: boolean;
  message?: string;
  data?: ProductDetailsDocument | ProductDetailsDocument[];
  error?: string;
  details?: string | string[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
