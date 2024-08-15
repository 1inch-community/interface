import { css, unsafeCSS } from 'lit';

export const themeDarkBlue= (targetName = ':root') => css`

    ${unsafeCSS(targetName)} {
        --logo-text-color: var(--color-core-white);

        --color-background-bg-active: #475467;
        --color-background-bg-body: #090e1a;
        --color-background-bg-critical: #f048322e;
        --color-background-bg-critical-hover: #f048323d;
        --color-background-bg-disabled: #1d2939;
        --color-background-bg-info: #2f8af52e;
        --color-background-bg-info-hover: #2f8af53d;
        --color-background-bg-positive: #008a7c2e;
        --color-background-bg-positive-hover: #008a7c3d;
        --color-background-bg-primary: #101828;
        --color-background-bg-secondary: #1d2939;
        --color-background-bg-tertiary: #344054;
        --color-background-bg-warning: #ff9c082e;
        --color-background-bg-warning-hover: #ff9c083d;
        --color-border-border-primary: #475467;
        --color-border-border-secondary: #344054;
        --color-border-border-tertiary: #1d2939;
        --color-content-content-disabled: #475467;
        --color-content-content-primary: #fcfcfd;
        --color-content-content-primary-inv: #101828;
        --color-content-content-secondary: #98a2b3;
        --color-content-content-tertiary: #667085;
        --color-core-black: #101828;
        --color-core-white: #ffffff;
        --color-core-blue-info: #2f8af5;
        --color-core-blue-info-hover: #157cf4;
        --color-core-green-positive: #21c187;
        --color-core-green-positive-hover: #1ca674;
        --color-core-orange-warning: #ff9c08;
        --color-core-orange-warning-hover: #eb8d00;
        --color-core-red-critical: #f04832;
        --color-core-red-critical-hover: #ee2f16;
    }

`
