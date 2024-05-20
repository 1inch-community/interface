import { brandColorMap, mainColorMap } from './themes';
import { mainColorStyleElement, brandColorStyleElement } from './theme-elements';
import { MainColors, BrandColors } from './themes/themes';
import { applyStyle, setThemeColor } from '@one-inch-community/lit';
import { Observable, Subject } from 'rxjs';

let currentMainColor: MainColors
let currentBrandColor: BrandColors

const themeColors: Record<MainColors, (() => string)> = {
  [MainColors.systemSync]: () => getThemeColorsSystem(),
  [MainColors.light]: () => '#f1f1f1',
  [MainColors.lightBlue]: () => '#f1f1f1',
  [MainColors.dark]: () => '#0e0e0e',
  [MainColors.darkBlue]: () => '#0e0e0e',
}

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const change$ = new Subject<MediaQueryList>()

function getThemeColorsSystem() {
  if (mediaQuery.matches) {
    return themeColors[MainColors.dark]();
  }
  return themeColors[MainColors.light]();
}

export async function themeChangeMainColor(mainColorName: MainColors, event?: MouseEvent) {
  return await themeChange(mainColorName, currentBrandColor, event)
}

export async function themeChangeBrandColor(brandColorName: BrandColors, event?: MouseEvent) {
  return await themeChange(currentMainColor, brandColorName, event)
}

export function getThemeChange(): Observable<MediaQueryList> {
  return change$
}

mediaQuery.onchange = async () => {
  if (currentMainColor !== MainColors.systemSync) return
  await themeChange(MainColors.systemSync, currentBrandColor)
  change$.next(mediaQuery)
}

function isDarkTheme(theme: MainColors) {
  if (theme === MainColors.systemSync) return mediaQuery.matches
  return theme === MainColors.dark || theme === MainColors.darkBlue
}

export async function themeChange(
  mainColorName: MainColors,
  brandColorName: BrandColors,
  event?: MouseEvent
) {
  const changeTheme = async () => {
    const mainColor = await mainColorMap[mainColorName]()
    const brandColor = await brandColorMap[brandColorName]()
    applyStyle(mainColorStyleElement, mainColor)
    applyStyle(brandColorStyleElement, brandColor)
    setThemeColor(themeColors[mainColorName]())
    currentMainColor = mainColorName
    currentBrandColor = brandColorName
    const htmlElement = document.querySelector('html')
    htmlElement?.setAttribute('theme', isDarkTheme(mainColorName) ? 'dark' : 'light')
  }
  if (event && ('startViewTransition' in document)) {
    const x = event.clientX;
    const y = event.clientY;
    const right = window.innerWidth - y;
    const bottom = window.innerHeight - x;
    const maxRadius = Math.hypot(
      Math.max(y, right),
      Math.max(x, bottom),
    );

    (document as any).startViewTransition(() => {
      changeTheme()
    }).ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
    return
  }

  await changeTheme()
}
