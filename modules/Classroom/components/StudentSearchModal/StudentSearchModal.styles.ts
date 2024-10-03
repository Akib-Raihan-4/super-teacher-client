import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  dropdown: {
    overflow: "auto",
  },
  input: {
    zIndex: 1,
  },
  error: {
    marginTop: "0.5rem",
  },
  label: {
    color: "#4CAF50",
    fontWeight: 700,
  },

  select: {
    "& .mantine-Select-input": {
      "&[data-selected]": {
        color: theme.black,
        "&::placeholder": {
          color: theme.black,
        },
      },
    },
    "& .mantine-Select-item[data-selected]": {
      "&, &:hover": {
        backgroundColor: theme.colors.gray[2],
        color: theme.black,
      },
    },
  },
}));
