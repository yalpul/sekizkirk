import { createMuiTheme } from "@material-ui/core/styles";

const sekizkirkOrange = "#fca311";
const sekizkirkGrey = "#e5e5e5";
const sekizkirkUltramarine = "#14213d";
const listBackground = "#d6d6d6";

export default createMuiTheme({
    palette: {
        common: {
            sekizkirkOrange,
            sekizkirkGrey,
            sekizkirkUltramarine,
            listBackground,
        },
        primary: {
            main: sekizkirkOrange,
        },
        secondary: {
            main: sekizkirkUltramarine,
        },
    },
    typography: {
        h1: {
            fontFamily: "Agrandir",
            fontSize: "12rem",
            textTransform: "uppercase",
            margin: 0,
        },
        h2: {
            fontFamily: "Agrandir",
            color: sekizkirkUltramarine,
        },
        h6: {
            fontFamily: "Agrandir",
            fontWeight: 700,
            lineHeight: 3,
            color: sekizkirkUltramarine,
        },
        fontFamily: ["CashMarket"],
    },
});
