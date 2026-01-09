import { type ReactNode } from 'react';
type Props = {
    classes?: string[];
    children?: ReactNode;
};
declare const ThunkContext: (props: Props) => string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | import("react").ReactPortal | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
export default ThunkContext;
