import { MantineTheme } from "@mantine/core";

export const useClassroomFormModalStyles = (theme: MantineTheme) => ({
  title: {
    color: "#61c177",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    label: {
      color: "#61c177",
    },
    input: {
      "&[data-selected]": {
        color: theme.black,
        "&::placeholder": {
          color: theme.black,
        },
      },
    },
    item: {
      "&[data-selected]": {
        "&, &:hover": {
          backgroundColor: theme.colors.gray[2],
          color: theme.black,
        },
      },
    },
  },
  button: {
    background: "#49b359",
  },
  buttonGroup: {
    justifyContent: "flex-end",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
});
