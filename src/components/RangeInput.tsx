import React, { useRef } from "react";

import { alpha, css, Input, SliderProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import { getDpad } from "../util/dpad";
import { KeyCode } from "../util/KeyCode";

export default function RangeInput({
    min,
    max,
    onChange,
    value,
}: Pick<SliderProps, "min" | "max" | "value"> & {
    onChange: (value: number, delta: boolean) => void;
}) {
    const ref = useRef<HTMLInputElement>();
    const keyDownHandler = (e: React.KeyboardEvent) => {
        // if (e.key === "Enter") {
        //     // Prevent entering as it's hard to get back out
        //     e.preventDefault();
        //     return;
        // }
        const el = ref.current;
        if ([KeyCode.UP, KeyCode.DOWN].includes(e.keyCode)) {
            e.preventDefault();
            // Up and down
            getDpad().setCurrentFocusItemByElement(ref.current!);
            getDpad().moveFocus({
                y: e.keyCode === KeyCode.DOWN ? -1 : 1,
                x: 0,
            });
        }
    };
    return (
        <CustomInput
            inputRef={ref}
            fullWidth={true}
            disableUnderline={true}
            value={value}
            type="range"
            onChange={(e) => {
                const val = parseInt(e.target.value);
                onChange(val, false);
            }}
            onKeyDown={keyDownHandler}
            slotProps={{
                input: {
                    className: "dpad-focusable dpad-ignore-x",
                    tabIndex: 0,
                    onKeyDown: keyDownHandler,
                    min,
                    max,
                },
            }}
        />
    );
}

const CustomInput = styled(Input)(
    ({ theme }) => css`
        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
        }
        /***** Chrome, Safari, Opera, and Edge Chromium *****/
        input[type="range"]::-webkit-slider-runnable-track {
            background-color: ${alpha(theme.palette.primary.main, 0.4)};
            border-radius: 16px;
            height: 8px;
        }
        /******** Firefox ********/
        input[type="range"]::-moz-range-track {
            background: ${theme.palette.primary.main};
        }
        input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            background-color: ${theme.palette.primary.main};
            height: 20px;
            width: 20px;
            border-radius: 50%;
            margin-top: -6px;
        }
    `
);
