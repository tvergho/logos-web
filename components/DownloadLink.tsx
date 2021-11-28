import styles from './styles.module.scss';

type DownloadLinkProps = {
  className?: string;
  url: string;
}

const DownloadLink = ({ url, className = '' }: DownloadLinkProps) => {
  return (
    <a href={url} className={`${styles.filename} ${className}`} target="_blank" rel="noreferrer">{url.split('/')[url.split('/').length - 1]}</a>
  );
};

export default DownloadLink;
