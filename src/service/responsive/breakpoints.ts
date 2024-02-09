import React, { ReactElement } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Breakpoint } from '@mui/material';

interface AboveBreakpointProps {
    breakpoint: Breakpoint;
    style: React.CSSProperties;
    children: ReactElement;
}

export const AboveBreakpoint = ({ breakpoint, style, children }: AboveBreakpointProps): ReactElement | null => {
    const theme = useTheme();
    const isAboveBreakpoint = useMediaQuery(theme.breakpoints.up(breakpoint));

    return isAboveBreakpoint ? React.cloneElement(children, { style }) : children;
};

interface BelowBreakpointProps {
    breakpoint: Breakpoint;
    style: React.CSSProperties;
    children: ReactElement;
}

export const BelowBreakpoint = ({ breakpoint, style, children }: BelowBreakpointProps): ReactElement | null => {
    const theme = useTheme();
    const isBelowBreakpoint = useMediaQuery(theme.breakpoints.down(breakpoint));

    return isBelowBreakpoint ? React.cloneElement(children, { style }) : children;
};

interface BreakpointRangeProps {
    from: Breakpoint;
    to: Breakpoint;
    style: React.CSSProperties;
    children: ReactElement;
    reverse?: boolean
}

export const BreakpointRange = ({ from, to, style, children, reverse }: BreakpointRangeProps) => {
    const theme = useTheme();
    let isInRange = useMediaQuery(theme.breakpoints.between(from, to));
    isInRange = reverse ? !isInRange : isInRange;

    return isInRange ? React.cloneElement(children, { style }) : children;
};

