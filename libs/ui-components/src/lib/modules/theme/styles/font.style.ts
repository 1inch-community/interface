import { css, CSSResult, unsafeCSS } from 'lit';

export const fontStyle = css`

    @font-face {
        font-family: InterVariable;
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url("fonts/Inter/InterVariable.woff2") format("woff2");
    }
    @font-face {
        font-family: InterVariable;
        font-style: italic;
        font-weight: 100 900;
        font-display: swap;
        src: url("fonts/Inter/InterVariable-Italic.woff2") format("woff2");
    }

    @font-face { font-family: "Inter"; font-style: normal; font-weight: 100; font-display: swap; src: url("fonts/Inter/Inter-Thin.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 100; font-display: swap; src: url("fonts/Inter/Inter-ThinItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 200; font-display: swap; src: url("fonts/Inter/Inter-ExtraLight.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 200; font-display: swap; src: url("fonts/Inter/Inter-ExtraLightItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 300; font-display: swap; src: url("fonts/Inter/Inter-Light.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 300; font-display: swap; src: url("fonts/Inter/Inter-LightItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Regular.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 400; font-display: swap; src: url("fonts/Inter/Inter-Italic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-Medium.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 500; font-display: swap; src: url("fonts/Inter/Inter-MediumItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 600; font-display: swap; src: url("fonts/Inter/Inter-SemiBoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 700; font-display: swap; src: url("fonts/Inter/Inter-Bold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 700; font-display: swap; src: url("fonts/Inter/Inter-BoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 800; font-display: swap; src: url("fonts/Inter/Inter-ExtraBold.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 800; font-display: swap; src: url("fonts/Inter/Inter-ExtraBoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: normal; font-weight: 900; font-display: swap; src: url("fonts/Inter/Inter-Black.woff2") format("woff2"); }
    @font-face { font-family: "Inter"; font-style: italic; font-weight: 900; font-display: swap; src: url("fonts/Inter/Inter-BlackItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 100; font-display: swap; src: url("fonts/Inter/InterDisplay-Thin.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 100; font-display: swap; src: url("fonts/Inter/InterDisplay-ThinItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 200; font-display: swap; src: url("fonts/Inter/InterDisplay-ExtraLight.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 200; font-display: swap; src: url("fonts/Inter/InterDisplay-ExtraLightItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 300; font-display: swap; src: url("fonts/Inter/InterDisplay-Light.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 300; font-display: swap; src: url("fonts/Inter/InterDisplay-LightItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 400; font-display: swap; src: url("fonts/Inter/InterDisplay-Regular.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 400; font-display: swap; src: url("fonts/Inter/InterDisplay-Italic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 500; font-display: swap; src: url("fonts/Inter/InterDisplay-Medium.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 500; font-display: swap; src: url("fonts/Inter/InterDisplay-MediumItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 600; font-display: swap; src: url("fonts/Inter/InterDisplay-SemiBold.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 600; font-display: swap; src: url("fonts/Inter/InterDisplay-SemiBoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 700; font-display: swap; src: url("fonts/Inter/InterDisplay-Bold.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 700; font-display: swap; src: url("fonts/Inter/InterDisplay-BoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 800; font-display: swap; src: url("fonts/Inter/InterDisplay-ExtraBold.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 800; font-display: swap; src: url("fonts/Inter/InterDisplay-ExtraBoldItalic.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: normal; font-weight: 900; font-display: swap; src: url("fonts/Inter/InterDisplay-Black.woff2") format("woff2"); }
    @font-face { font-family: "InterDisplay"; font-style: italic; font-weight: 900; font-display: swap; src: url("fonts/Inter/InterDisplay-BlackItalic.woff2") format("woff2"); }


    * {
        font-family: 'Inter', sans-serif;
        font-style: normal;
    }

`
