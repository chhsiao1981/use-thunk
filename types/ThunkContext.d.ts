import { type JSX } from 'react';
type Props = {
    classes?: string[];
    children?: JSX.Element | JSX.Element[];
};
declare const ThunkContext: (props: Props) => JSX.Element;
export default ThunkContext;
