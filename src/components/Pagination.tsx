import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, Typography } from "@mui/material";
import type { FC } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const pages: (number | "...")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (
        (i === page - delta - 1 && page - delta > 2) ||
        (i === page + delta + 1 && page + delta < totalPages - 1)
      ) {
        pages.push("...");
      }
    }

    return [...new Set(pages)];
  };

  if (totalPages <= 1) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={1}
      mt={3}
    >
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {getVisiblePages().map((pageNum, index) =>
        pageNum === "..." ? (
          <Typography
            key={`ellipsis-${index}`}
            sx={{ px: 1 }}
            color="textSecondary"
          >
            ...
          </Typography>
        ) : (
          <button
            key={pageNum}
            onClick={() => onChange(pageNum as number)}
            type="button"
            className={`px-3 py-1 border rounded-md text-sm ${
              page === pageNum
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </Box>
  );
};

export default Pagination;
