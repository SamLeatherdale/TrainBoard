import React, { ReactElement } from "react";

import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type PropsType = {
    title: string | ReactElement;
    body: string | ReactElement;
};
export default function CardMessage({ title, body }: PropsType) {
    return (
        <CardStyled>
            <CardContent>
                <HeadingStyled variant="h3">{title}</HeadingStyled>
                <ParagraphStyled variant="body1">{body}</ParagraphStyled>
            </CardContent>
        </CardStyled>
    );
}

const CardStyled = styled(Card)({
    margin: "40px",
    padding: "24px",
});
const HeadingStyled = styled(Typography)({
    marginBottom: "0.5em",
});
const ParagraphStyled = styled(Typography)({
    lineHeight: "2em",
});
