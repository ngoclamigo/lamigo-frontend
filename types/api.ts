export type ApiResponse<T> = {
  data: T;
  status: "success" | "error";
};

export type ListResponse<T> = {
  data: T[];
  status: "success" | "error";
  paging: {
    page: number;
    per_page: number;
    total: number;
  };
};
