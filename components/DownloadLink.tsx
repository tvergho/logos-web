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

  const urls = Array.isArray(url) ? url : [url];

  return (
    <>
      {urls.map((url) => (
        <a href={url || '#'} className={`${styles.filename} ${className}`} target="_blank" rel="noreferrer" key={url}>
          {url.split('/')[url.split('/').length - 1].split('?')[0]}
        </a>
      ))}
    </>
  );
};

export default DownloadLink;
