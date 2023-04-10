import { createTheme, PaletteMode, Theme } from "@mui/material";
import orange from "@mui/material/colors/orange";

declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}
declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        heightHd: true;
    }
}
export function createAppTheme(mode: PaletteMode) {
    return createTheme({
        palette: {
            mode: mode,
            primary: orange,
        },
        components: {
            MuiNativeSelect: {
                styleOverrides: {
                    outlined: ({ theme }) => ({
                        padding: `${theme.spacing(2)} !important`,
                        paddingRight: `${theme.spacing(4)} !important`,
                        outline: `1px solid ${theme.palette.divider}`,
                        "&:hover": {
                            outline: `1px solid ${theme.palette.text.primary}`,
                        },
                    }),
                },
            },
        },
    });
}
export const heightHd = 540;
