import React from "react";
import autoBindReact from "auto-bind/react";

/**
 * Automatically binds non-React methods to `this`.
 */
export default abstract class AutoBoundComponent<P, S> extends React.Component<P, S> {
    constructor(props) {
        super(props);
        autoBindReact(this);
    }
}