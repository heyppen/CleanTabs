

// references:
// - https://github.com/chromium/chromium

import { SVGProps } from "react"


export const ChromeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#a)" fill="#5F6368">
      <path d="M5.225 10.265A6.996 6.996 0 0 1 12 5h9.733a11.976 11.976 0 0 0-19.512.061l3.004 5.204zM22.898 7h-6.003a6.979 6.979 0 0 1 1.162 8.498l.008.004-4.872 8.438A11.98 11.98 0 0 0 22.898 7zm-9.009 11.735A6.964 6.964 0 0 1 5.944 15.5l-.004.002-4.87-8.435a11.98 11.98 0 0 0 9.812 16.877l3.007-5.21z" />
      <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
)

export const ChromeSettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
)


export const ChromeExtensionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
  </svg>
)

// ui/webui/resources/images/icon_bookmark.svg
export const ChromeBookmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <path d="M16 23.027 24.24 28l-2.187-9.373 7.28-6.307-9.586-.813L16 2.667l-3.747 8.84-9.586.813 7.28 6.307L7.76 28z" />
  </svg>
)

export const GitHub = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      fill="#24292f"
    />
  </svg>
);

export const ChromeStore = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 192 192"
    {...props}
  >
    <path d="M0 0h192v192H0z" fill="none" />
    <defs>
      <path
        d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"
        id="a"
      />
    </defs>
    <clipPath id="b">
      <use overflow="visible" xlinkHref="#a" />
    </clipPath>
    <path clipPath="url(#b)" d="M8 20h176v152H8z" fill="#eee" />
    <path
      clipPath="url(#b)"
      d="M116 36H76c-4.42 0-8 3.58-8 8s3.58 8 8 8h40c4.42 0 8-3.58 8-8s-3.58-8-8-8z"
      fill="#fff"
    />
    <g clipPath="url(#b)">
      <defs>
        <circle cx={96} cy={160} id="c" r={76} />
      </defs>
      <clipPath id="d">
        <use overflow="visible" xlinkHref="#c" />
      </clipPath>
      <path
        clipPath="url(#d)"
        d="M32.07 84v93.27h34.01L96 125.45h76V84zm0 0v93.27h34.01L96 125.45h76V84z"
        fill="#DB4437"
      />
      <path
        clipPath="url(#d)"
        d="M20 236h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24zm0 0h72.34l33.58-33.58v-25.14l-59.84-.01L20 98.24z"
        fill="#0F9D58"
      />
      <path
        clipPath="url(#d)"
        d="M96 125.45l29.92 51.82L92.35 236H172V125.45zm0 0l29.92 51.82L92.35 236H172V125.45z"
        fill="#FFCD40"
      />
      <g clipPath="url(#d)">
        <circle cx={96} cy={160} fill="#F1F1F1" r={34.55} />
        <circle cx={96} cy={160} fill="#4285F4" r={27.64} />
      </g>
    </g>
    <path
      clipPath="url(#b)"
      d="M8 20h176v76H8z"
      fill="#212121"
      fillOpacity={0.05}
    />
    <path d="M8 95h176v1H8z" fill="#212121" fillOpacity={0.02} />
    <path d="M8 96h176v1H8z" fill="#fff" fillOpacity={0.05} />
    <path
      d="M116 52H76c-4.25 0-7.72-3.32-7.97-7.5-.02.17-.03.33-.03.5 0 4.42 3.58 8 8 8h40c4.42 0 8-3.58 8-8 0-.17-.01-.33-.03-.5-.25 4.18-3.72 7.5-7.97 7.5zM8 20v1h176v-1H8z"
      fill="#212121"
      fillOpacity={0.02}
    />
    <path
      d="M76 36h40c4.25 0 7.72 3.32 7.97 7.5.01-.17.03-.33.03-.5 0-4.42-3.58-8-8-8H76c-4.42 0-8 3.58-8 8 0 .17.01.33.03.5.25-4.18 3.72-7.5 7.97-7.5zm96 135H20c-6.6 0-12-5.4-12-12v1c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12v-1c0 6.6-5.4 12-12 12z"
      fill="#231F20"
      fillOpacity={0.1}
    />
    <radialGradient
      cx={7.502}
      cy={19.344}
      gradientUnits="userSpaceOnUse"
      id="e"
      r={227.596}
    >
      <stop offset={0} stopColor="#fff" stopOpacity={0.1} />
      <stop offset={1} stopColor="#fff" stopOpacity={0} />
    </radialGradient>
    <path
      d="M8 20v140c0 6.6 5.4 12 12 12h152c6.6 0 12-5.4 12-12V20H8zm108 32H76c-4.42 0-8-3.58-8-8s3.58-8 8-8h40c4.42 0 8 3.58 8 8s-3.58 8-8 8z"
      fill="url(#e)"
    />
  </svg>
);
