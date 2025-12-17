
import React from 'react';

export const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const ForkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zM10.75 12.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clipRule="evenodd"/>
    </svg>
);

export const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06z" clipRule="evenodd"/>
    </svg>
);

export const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.42 5.5 5.5 0 017.342-3.713l.21-1.052a.75.75 0 011.285.648l-1.353 6.763a.75.75 0 01-1.18.514l-4.242-2.828a.75.75 0 11.894-1.342l1.378.919a4 4 0 102.823 4.204a.75.75 0 01.815-1.055z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M4.688 8.576a5.5 5.5 0 019.201 4.42 5.5 5.5 0 01-7.342 3.713l-.21 1.052a.75.75 0 01-1.285-.648l1.353-6.763a.75.75 0 011.18-.514l4.242 2.828a.75.75 0 11-.894 1.342l-1.378-.919a4 4 0 10-2.823-4.204a.75.75 0 01-.815 1.055z" clipRule="evenodd" />
    </svg>
);

export const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z"/>
        <path d="M8.603 16.117a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z"/>
    </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.724 1.724 0 00-1.42 1.42l-.41.1c-1.56.38-1.56 2.6 0 2.98l.41.1a1.724 1.724 0 001.42 1.42l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.724 1.724 0 001.42-1.42l.41-.1c1.56-.38 1.56-2.6 0-2.98l-.41-.1a1.724 1.724 0 00-1.42-1.42l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        <path d="M10 4.5c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1s-1-.45-1-1V5.5c0-.55.45-1 1-1zM14.5 10c.55 0 1 .45 1 1h.5c0 .55-.45 1-1 1s-1-.45-1-1h-.5c0-.55.45-1 1-1zM5.5 10c.55 0 1 .45 1 1H6c0 .55-.45 1-1 1s-1-.45-1-1H4.5c0-.55.45-1 1-1zM10 14.5c.55 0 1 .45 1 1v.5c0 .55-.45 1-1 1s-1-.45-1-1V15.5c0-.55.45-1 1-1z"/>
    </svg>
);

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const GridIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M3 3a1 1 0 00-1 1v3h4V3H3zm5 0v4h4V3H8zm5 0v4h4V4a1 1 0 00-1-1h-3zM3 8v4h4V8H3zm5 0v4h4V8H8zm5 0v4h4V8h-4zM3 13v3a1 1 0 001 1h3v-4H3zm5 0v4h4v-4H8zm5 0v4h3a1 1 0 001-1v-3h-4z" />
    </svg>
);

export const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
);

export const DataSourceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM2 15a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
    </svg>
);

export const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.74 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.527-1.963 6.002 6.002 0 01-.485 3.065A7.47 7.47 0 0010 9.75a7.47 7.47 0 00-5.668-1.723z" clipRule="evenodd" />
    </svg>
);

export const GlobeAmericasIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM5.036 3.912a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM13.964 3.912a.75.75 0 011.06 1.06l-1.06 1.061a.75.75 0 01-1.06-1.06l1.06-1.06zM3.75 9.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM16.25 9.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM8.939 15.061a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.061a.75.75 0 010-1.06zM15.06 13.964a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-5.904-2.81a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);


export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
);

export const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.25a.75.75 0 011.08 0l4.25 4.25a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
    </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
);

export const ChartBarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M11.5 2.5a.5.5 0 01.5.5v14a.5.5 0 01-1 0V3a.5.5 0 01.5-.5zM8.5 6.5a.5.5 0 01.5.5v10a.5.5 0 01-1 0V7a.5.5 0 01.5-.5zM5.5 10.5a.5.5 0 01.5.5v6a.5.5 0 01-1 0v-6a.5.5 0 01.5-.5zM14.5 8.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8a.5.5 0 01.5-.5z" />
    <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5V3.5A1.5 1.5 0 0016.5 2h-13zM3 3.5a.5.5 0 01.5-.5h13a.5.5 0 01.5.5v13a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5v-13z" clipRule="evenodd" />
  </svg>
);

export const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2.25 4.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V7.25a.75.75 0 01.75-.75zM7 9.25a.75.75 0 000 1.5h6a.75.75 0 000-1.5H7zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5H7zM11.5 6.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V7.25a.75.75 0 01.75-.75zM9.25 6.5a.75.75 0 01.75.75v.01a.75.75 0 01-1.5 0V7.25a.75.75 0 01.75-.75zM7 6.5a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V6.5z" clipRule="evenodd" />
  </svg>
);

export const CircleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 3.5a1.5 1.5 0 011.125.43l6.5 5.5a1.5 1.5 0 010 2.14l-6.5 5.5A1.5 1.5 0 0110 18.5v-15zm0 2.14v10.72l5.005-4.243L10 5.64z" />
    <path d="M2.875 9.43A1.5 1.5 0 002 10.5v0a1.5 1.5 0 00.875 1.07l6.5 5.5A1.5 1.5 0 0011 16.5v-3.32a.75.75 0 00-1.5 0v2.49l-5.005-4.243A.75.75 0 014 10.5v0a.75.75 0 01.495-.707L10 5.64V3.5a1.5 1.5 0 00-1.625-.93l-6.5 5.5z" />
  </svg>
);

export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0l-.1.41a1.724 1.724 0 00-1.42 1.42l-.41.1c-1.56.38-1.56 2.6 0 2.98l.41.1a1.724 1.724 0 001.42 1.42l.1.41c.38 1.56 2.6 1.56 2.98 0l.1-.41a1.724 1.724 0 001.42-1.42l.41-.1c1.56-.38 1.56-2.6 0-2.98l-.41-.1a1.724 1.724 0 00-1.42-1.42l-.1-.41zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

export const ArrowLeftOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.152 4.152a1.5 1.5 0 012.121 0l3.586 3.586a.75.75 0 010 1.06l-3.586 3.586a1.5 1.5 0 01-2.121-2.121L5.692 10 4.152 8.461a1.5 1.5 0 010-2.121z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M8.5 2A1.5 1.5 0 007 3.5v13A1.5 1.5 0 008.5 18h8a1.5 1.5 0 001.5-1.5V14a.75.75 0 00-1.5 0v2.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-13a.5.5 0 01.5-.5h8a.5.5 0 01.5.5V6a.75.75 0 001.5 0V3.5A1.5 1.5 0 0016.5 2h-8z" clipRule="evenodd" />
  </svg>
);

export const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
  </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

export const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.945a.75.75 0 01-1.5 0v-1a1.5 1.5 0 00-1.46-1.441c-.789-.026-1.407-.614-1.407-1.399a1.5 1.5 0 012.56-1.07zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

export const FlagCNIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" {...props}>
    <rect fill="#de2910" width="900" height="600"/>
    <path fill="#ffde00" d="M150 150.3l-22.9 70.4 59.8-43.5h-73.9l59.8 43.5zM225 75.3l-8.8 27 23-16.7h-28.4l23 16.7zM270 120.3l-15.3 47.2 39.9-29h-49.3l39.9 29zM225 180.3l-8.8-27 23 16.7h-28.4l23-16.7z"/>
  </svg>
);

export const FlagUSIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 526" {...props}>
    <path fill="#b22234" d="M0 0h1000v526H0z"/>
    <path fill="#fff" d="M0 40h1000v41H0zm0 82h1000v41H0zm0 82h1000v41H0zm0 82h1000v41H0zm0 82h1000v41H0z"/>
    <path fill="#3c3b6e" d="M0 0h400v288H0z"/>
    <path fill="#fff" d="m80 48 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zM40 96l8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zM80 144l8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zM40 192l8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm-280 48 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26zm80 0 8 25h26l-21 16 8 25-21-15-21 15 8-25-21-16h26z"/>
  </svg>
);

export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
  </svg>
);

export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
  </svg>
);

export const ArrowTopRightOnSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 000 1.5h5.69l-8.22 8.22a.75.75 0 001.06 1.06l8.22-8.22v5.69a.75.75 0 001.5 0v-8.5a.75.75 0 00-.75-.75h-8.5a.75.75 0 00-.75.75z" clipRule="evenodd" />
  </svg>
);

export const DocumentMagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8 3a.75.75 0 01.75.75V4h4.5a.75.75 0 010 1.5H10v1.51a3.502 3.502 0 012.37 1.13l1.838 1.837a.75.75 0 01-1.06 1.06L11.3 8.19A2.002 2.002 0 008 7.27V10H3V3.75A.75.75 0 013.75 3H8zm-3 8.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    <path d="M9.053 12.26a4.5 4.5 0 11-6.364 6.364 4.5 4.5 0 016.364-6.364zM2 15.5a3 3 0 106 0 3 3 0 00-6 0z" />
  </svg>
);
