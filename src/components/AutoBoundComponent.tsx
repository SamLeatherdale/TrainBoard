import React from "react";
import autoBind from "auto-bind";

/**
 * Automatically binds non-React methods to `this`.
 */
export default abstract class AutoBoundComponent<P, S> extends React.Component<P, S> {
    constructor(props) {
        super(props);
        autoBind.react(this);
    }
}