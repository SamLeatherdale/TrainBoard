import {CardContent} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
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