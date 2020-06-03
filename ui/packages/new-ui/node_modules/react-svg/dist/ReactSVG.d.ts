import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Props, State, WrapperType } from './types';
export declare class ReactSVG extends React.Component<Props, State> {
    static defaultProps: {
        afterInjection: () => undefined;
        beforeInjection: () => undefined;
        evalScripts: string;
        fallback: null;
        loading: null;
        renumerateIRIElements: boolean;
        wrapper: string;
    };
    static propTypes: {
        afterInjection: PropTypes.Requireable<(...args: any[]) => any>;
        beforeInjection: PropTypes.Requireable<(...args: any[]) => any>;
        evalScripts: PropTypes.Requireable<string>;
        fallback: PropTypes.Requireable<string | object>;
        loading: PropTypes.Requireable<string | object>;
        renumerateIRIElements: PropTypes.Requireable<boolean>;
        src: PropTypes.Validator<string>;
        wrapper: PropTypes.Requireable<string>;
    };
    initialState: {
        hasError: boolean;
        isLoading: boolean;
    };
    state: {
        hasError: boolean;
        isLoading: boolean;
    };
    _isMounted: boolean;
    container?: WrapperType | null;
    svgWrapper?: WrapperType | null;
    refCallback: (container: HTMLDivElement | HTMLSpanElement | null) => void;
    renderSVG(): void;
    removeSVG(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
