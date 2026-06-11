import { type ReactNode } from 'react';
type Props = {
    modules?: string[];
    children?: ReactNode;
};
declare const ThunkContext: (props: Props) => ReactNode;
export default ThunkContext;
