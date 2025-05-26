
import React from 'react';

interface IconProps {
  className?: string;
  title?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.096 3.242.26m-2.193.424l2.484.461M15.095 5.79l2.484.461m0 0L19.5 21M5.625 5.79L3.5 21" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L12.25 12l2.846.813a4.5 4.5 0 003.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09zM9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.242.934 2.393 2.25 2.393s2.25-1.151 2.25-2.393A2.25 2.25 0 0012 12z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

// Social Media Icons
export const FacebookIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5.52 4.5 10.02 10 10.02s10-4.5 10-10.02C22 6.53 17.5 2.04 12 2.04zm.82 15.42v-6.23h2.11l.31-2.4h-2.42v-1.53c0-.7.19-1.18 1.2-1.18h1.28V3.6c-.22-.03-.98-.09-1.87-.09c-1.85 0-3.12 1.11-3.12 3.21v1.79H8.37v2.4h2.05v6.23h2.4z"/></svg>
);
export const TwitterIcon: React.FC<IconProps> = ({ className, ...rest }) => (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
export const InstagramIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M12 2c2.72 0 3.05.01 4.12.06c1.06.05 1.79.24 2.42.51c.64.27 1.09.58 1.61 1.11c.52.52.84 1 1.11 1.61c.27.63.46 1.36.51 2.42c.05 1.07.06 1.4.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.24 1.79-.51 2.42c-.27.64-.58 1.09-1.11 1.61c-.52.52-1 .84-1.61 1.11c-.63.27-1.36.46-2.42.51c-1.07.05-1.4.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.24-2.42-.51c-.64-.27-1.09-.58-1.61-1.11c-.52-.52-.84-1-1.11-1.61c-.27-.63-.46-1.36-.51-2.42C2.01 15.05 2 14.72 2 12s.01-3.05.06-4.12c.05-1.06.24-1.79.51-2.42c.27-.64.58-1.09 1.11-1.61c.52-.52 1-.84 1.61-1.11c.63-.27 1.36-.46 2.42-.51C8.95 2.01 9.28 2 12 2zm0 1.8c-2.67 0-3 .01-4.05.06c-.99.04-1.5.23-1.86.37c-.42.16-.72.35-.99.62c-.27.27-.46.57-.62.99c-.14.36-.33.87-.37 1.86C4.01 9 4 9.33 4 12s.01 3 .06 4.05c.04.99.23 1.5.37 1.86c.16.42.35.72.62.99c.27.27.57.46.99.62c.36.14.87.33 1.86.37C9 19.99 9.33 20 12 20s3-.01 4.05-.06c.99-.04 1.5-.23 1.86-.37c.42-.16.72-.35.99-.62c.27-.27.46-.57-.62.99c.14-.36.33-.87.37-1.86c.05-1.05.06-1.38.06-4.05s-.01-3-.06-4.05c-.04-.99-.23-1.5-.37-1.86c-.16-.42-.35-.72-.62-.99c-.27-.27-.57-.46-.99-.62c-.36-.14-.87-.33-1.86-.37C15 4.01 14.67 4 12 4zm0 2.88c-2.83 0-5.12 2.29-5.12 5.12s2.29 5.12 5.12 5.12s5.12-2.29 5.12-5.12s-2.29-5.12-5.12-5.12zm0 8.44c-1.82 0-3.32-1.5-3.32-3.32s1.5-3.32 3.32-3.32s3.32 1.5 3.32 3.32s-1.5 3.32-3.32 3.32zm6.28-8.98c-.71 0-1.29.58-1.29 1.29s.58 1.29 1.29 1.29s1.29-.58 1.29-1.29s-.58-1.29-1.29-1.29z"/></svg>
);
export const YoutubeIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm5.78 11.39l-4.5 2.25c-.14.07-.29.07-.44 0c-.15-.07-.24-.21-.24-.39V8.75c0-.18.09-.32.24-.39c.15-.07.3-.07.44 0l4.5 2.25c.15.08.22.22.22.39s-.07.31-.22.39z"/></svg>
);
export const TiktokIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02c.08 0 .17.02.25.04c.54.12.98.49 1.27.97c.49.81.51 1.79.22 2.68c-.28.88-.89 1.53-1.69 1.91c-.51.23-1.07.31-1.64.3c-1.31-.03-2.62-.02-3.93-.02c-.19 0-.38.01-.56.04c-.97.15-1.89.6-2.59 1.28c-.96.93-1.48 2.21-1.46 3.56c.01 1.02.32 2.01.88 2.84c.67.99 1.64 1.68 2.79 1.95C9.74 15.58 11.3 16 12.94 16c.02 1.31.02 2.62.01 3.93c0 .13-.01.26-.02.39c-.03.8-.36 1.56-.94 2.12c-.73.71-1.7 1.04-2.74 1.01c-1.06-.03-2.04-.48-2.74-1.2c-.52-.54-.83-1.24-.94-1.97c-.08-.52-.07-1.04-.07-1.57c0-3.45.01-6.9-.01-10.35c-.01-.96-.28-1.88-.79-2.68c-.7-.98-1.74-1.58-2.87-1.77C1.24 4.09.65 3.3.62 2.41c-.03-.9.44-1.74 1.25-2.07C2.84.03 3.83-.01 4.85-.02c1.31.01 2.62.01 3.93.01c.12 0 .23 0 .35.01c.36.03.7.13 1.01.28c.58.28 1.04.72 1.32 1.25c.1.19.18.39.24.6c.03.11.05.22.07.33C12.06.82 12.29.42 12.525.02zM12.07 9.67c.96 0 1.93.01 2.89.01c.42 0 .82.13 1.15.38c.41.31.62.76.62 1.23c0 .49-.23.96-.67 1.25c-.37.24-.81.35-1.25.35c-.96 0-1.92.01-2.88.01c-.02-1.1-.01-2.19-.01-3.22z"/></svg>
);
export const LinkedinIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.5A1.5 1.5 0 0 1 14.42 12A1.5 1.5 0 0 1 15.92 13.5V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>
);
export const PinterestIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...rest}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1.1 14.06c-.77.23-1.58.03-2.03-.28c-.46-.31-.47-.58-.47-.58s-.14-1.12.12-2.06c.25-.94.79-1.74 1.27-2.4c.53-.73.53-1.25.33-1.98c-.2-.73-.86-1.42-1.53-1.71c-.8-.35-1.63-.1-2.2.41c-.58.51-.76 1.38-.76 1.38s-1.06-4.4 1.17-6.06c2.23-1.66 5.07-.46 5.07-.46s1.13 3.38-1.08 4.26c-2.2.88-.87 4.45-.87 4.45s1.18-.54 1.76-.36c.58.18.97.78.97 1.46c0 .68-.17 1.32-.95 1.68z"/></svg>
);

export const ImagePlaceholderIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM12 12a3 3 0 100-6 3 3 0 000 6z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

export const BrainIcon: React.FC<IconProps> = ({ className, ...rest }) => ( // Simple AI Brain
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v2.362a3.75 3.75 0 001.308 2.838L12 9.375l.938-1.07a3.75 3.75 0 001.308-2.838V3.104m0 0A6.339 6.339 0 0012 2.25a6.339 6.339 0 00-2.25.854m4.5 0A6.339 6.339 0 0112 2.25a6.339 6.339 0 012.25.854M4.187 6.05A7.5 7.5 0 002.25 12c0 4.142 3.358 7.5 7.5 7.5h4.5c4.142 0 7.5-3.358 7.5-7.5a7.5 7.5 0 00-1.937-5.95m-13.626 0A7.502 7.502 0 0112 4.5c2.236 0 4.234.982 5.625 2.537M21.75 12c0 .83-.136 1.63-.389 2.375M2.25 12c0 .83.136 1.63.389 2.375" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 16.5a.75.75 0 110-1.5.75.75 0 010 1.5zM12 9a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM8.25 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ className, ...rest }) => ( // For Expenses
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5v-1.5m-5.25-3v-1.5m0 0A2.25 2.25 0 1012 7.5M15.75 12H18m0 0v1.5m0 0A2.25 2.25 0 1112 16.5m3.75-3H12m0 0V7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-4.073M15.75 7.5V5.625a3.375 3.375 0 00-3.375-3.375h-1.5A3.375 3.375 0 007.5 5.625V7.5m6 0v2.25m0 0H8.25m6.75 0a2.25 2.25 0 012.25 2.25V14.15m0 0a2.25 2.25 0 01-2.25 2.25H8.25a2.25 2.25 0 01-2.25-2.25V12m0 0V7.5" />
  </svg>
);
export const LightbulbIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 000-6m0 6a3 3 0 013 3m-3-3a3 3 0 00-3 3m3-3V6M3 12H2.25m19.5 0H21.75M12 3V2.25m0 19.5V21.75M4.928 4.928L4.375 4.375m14.142 14.142l.553.553M4.928 19.072L4.375 19.625m14.142-14.142l.553-.553M12 6.75A5.25 5.25 0 006.75 12H17.25A5.25 5.25 0 0012 6.75z" />
  </svg>
);

export const BarChartSquareIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V5.75A2.25 2.25 0 0018 3.5H6A2.25 2.25 0 003.75 5.75v12.25A2.25 2.25 0 006 20.25z" />
  </svg>
);
export const CheckCircleIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const FileTextIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const ListChecksIcon: React.FC<IconProps> = ({ className, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} {...rest}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125-.504-1.125-1.125v-9M10.125 2.25c.621 0 1.125.504 1.125 1.125v3.375M10.125 2.25v3.375m0 0c0 .621.504 1.125 1.125 1.125h3.375M13.5 6.75c.621 0 1.125-.504 1.125-1.125V2.25m0 0h1.125c.621 0 1.125.504 1.125 1.125v17.25c0 .621-.504 1.125-1.125 1.125h-1.125m-1.5-18.375v3.375m0 0c0 .621-.504 1.125-1.125 1.125h-3.375m-1.125-4.5v3.375m0 0c0 .621.504 1.125 1.125 1.125h3.375m0 0c.621 0 1.125-.504 1.125-1.125v-3.375M10.125 6.75L6.375 10.5m0 0L2.625 6.75M6.375 10.5l3.75-3.75m-7.5 11.25L6.375 15m0 0l3.75 3.75M6.375 15l3.75-3.75M13.5 10.5l3.75 3.75m0 0l3.75-3.75m-3.75 3.75L13.5 10.5m0 0L17.25 6.75m-3.75 3.75L10.125 18M10.125 18L6.375 14.25" />
  </svg>
);
