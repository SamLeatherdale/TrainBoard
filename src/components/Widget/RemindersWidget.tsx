import React from "react";

import {CardContent} from "@mui/material";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import SettingsSet from "../../classes/SettingsSet";

interface RemindersWidgetProps {
    settings: SettingsSet
}

export default function RemindersWidget(props: RemindersWidgetProps) {
    const {reminders} = props.settings;
    if (!reminders.enabled) {
        return null;
    }

    return (
        <Card id="reminders-panel">
            <CardContent>
                <div>{reminders.title}</div>

                <List>
                    {reminders.itemList.map((item, i) => {
                        const labelId = `reminder-${i}`;
                        return (
                        <ListItem
                            dense
                            key={i}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={item} />
                        </ListItem>
                    )})}
                </List>
            </CardContent>
        </Card>
    );
}