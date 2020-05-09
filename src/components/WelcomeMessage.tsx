import React from 'react';
import { Container, Card, CardContent, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import MenuIcon from "@material-ui/icons/Menu";

export default function WelcomeMessage() {
    return (
        <CardStyled>
            <CardContent>
                <HeadingStyled variant="h3">
                    Welcome
                </HeadingStyled>
                <ParagraphStyled variant="body1">
                    Welcome to TrainBoard! To get started, open the settings menu (<MenuIconStyled />) and configure your From and To stops.
                </ParagraphStyled>
            </CardContent>
        </CardStyled>
    );
}

const CardStyled = styled(Card)({
    margin: '40px',
    padding: '24px'
});
const HeadingStyled = styled(Typography)({
    marginBottom: '0.5em'
});
const MenuIconStyled = styled(MenuIcon)({
    verticalAlign: 'middle',
    lineHeight: 'initial'
});
const ParagraphStyled = styled(Typography)({
    lineHeight: '2em'
});