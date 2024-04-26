import { svg } from 'lit';
import { IconContext } from '../icon-context';

export const aurora24Svg = ({ width, height }: IconContext) => svg`
<svg width="${width ?? 24}" height="${height ?? 24}" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12.6597" r="12" fill="#1A373D"/>
  <g clip-path="url(#clip0_6718_21389)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.8576 6.85099C10.7497 5.1903 13.2455 5.1903 14.1375 6.85098L18.4814 14.9378C19.298 16.458 18.1367 18.2617 16.3415 18.2617H7.65364C5.85837 18.2617 4.69711 16.458 5.51368 14.9378L9.8576 6.85099ZM13.1498 7.33061C12.6695 6.43639 11.3256 6.43639 10.8453 7.33061L6.50135 15.4175C6.06166 16.236 6.68696 17.2072 7.65364 17.2072H16.3415C17.3082 17.2072 17.9335 16.236 17.4938 15.4175L13.1498 7.33061Z" fill="#86D65B"/>
  </g>
  <defs>
    <clipPath id="clip0_6718_21389">
      <rect width="15" height="15" fill="white" transform="translate(4.5 5.15967)"/>
    </clipPath>
  </defs>
</svg>
`