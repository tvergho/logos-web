import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import styles from './styles.module.scss';

type DownloadLinkProps = {
  className?: string;
  url?: string | string[];
}
/**
 * Converts a wiki download link to a filename, and renders a link for download.
 * @param {string} url - The url to convert.
 * @param {string} className - The class name to apply to the link element (optional).
 */
const DownloadLink = ({ url, className = '' }: DownloadLinkProps) => {
  if (!url) return null;
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});

  const urls = Array.isArray(url) ? url : [url];
  const uniqueUrls = urls.filter((url, index) => urls.indexOf(url) === index);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus({ ...copyStatus, [text]: true });
      setTimeout(() => {
        setCopyStatus({ ...copyStatus, [text]: false });
      }, 2000);
    });
  };

  return (
    <>
      {uniqueUrls.map((url) => {
        // Check if this is a local file path (starts with '/' and doesn't have http/https)
        const isLocalPath = url && url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://');

        let filename = '';
        if (url) {
          try {
            const parsedUrl = new URL(url);
            const pathParam = parsedUrl.searchParams.get('path');
            if (pathParam) {
              const decodedPath = decodeURIComponent(pathParam);
              filename = decodedPath.split('/').pop() || '';
            } else {
              filename = decodeURIComponent(url.split('/').pop()?.split('?')[0] || '');
            }
          } catch (e) {
            filename = '';
          }
        }

        if (isLocalPath) {
          return (
            <div className={`${styles.filename} ${className}`} key={url} style={{ display: 'flex', alignItems: 'center' }}>
              <span title={`Local file: ${url}`}>{filename} (local file)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(url)}
                style={{
                  marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                }}
                title="Copy file path to clipboard"
              >
                <FaCopy size={14} />
              </button>
              {copyStatus[url] && <span style={{ fontSize: '0.8em', marginLeft: '5px' }}>Copied!</span>}
            </div>
          );
        }

        return (
          <a href={url || '#'} className={`${styles.filename} ${className}`} target="_blank" rel="noreferrer" key={url}>
            {filename}
          </a>
        );
      })}
    </>
  );
};

export default DownloadLink;
