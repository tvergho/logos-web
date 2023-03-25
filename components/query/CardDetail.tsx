/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */
import { useRef, useContext } from 'react';
import { FaCopy } from 'react-icons/fa';
import { AppContext } from '../../lib/appContext';
import type { Card } from '../../lib/types';
import { generateStyledCite, generateStyledParagraph } from '../../lib/utils';
import DownloadLink from '../DownloadLink';
import styles from './styles.module.scss';

type CardProps = {
  card?: Card;
  downloadUrls?: string[];
}

const LINE_HEIGHT = '107%';

const CardDetail = ({ card, downloadUrls }: CardProps) => {
  const styledCite = generateStyledCite(card?.cite, card?.cite_emphasis);
  const container = useRef<HTMLDivElement>(null);
  const { highlightColor } = useContext(AppContext);

  /**
   * Programatically copy the content of the card to the clipboard.
   */
  const copy = () => {
    if (container.current) {
      window.getSelection()?.removeAllRanges();

      const range = document.createRange();
      range.selectNode(container.current);
      window.getSelection()?.addRange(range);

      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <div className={styles.card}>
      {!!card && (
        <>
          <div ref={container}>
            <div className={styles['copy-container']}>
              <h4 style={{
                fontSize: '13pt', marginTop: 2, marginBottom: 0, lineHeight: LINE_HEIGHT,
              }}
              >{card.tag}
              </h4>
              <button
                className={styles.copy}
                type="button"
                onClick={copy}
              ><FaCopy color="rgba(0,0,0,0.4)" size={20} />
              </button>
            </div>

            {!!card.tag_sub && (
              <p className="MsoNormal" style={{ fontSize: '11pt', margin: '0in 0in 8pt', lineHeight: LINE_HEIGHT }}>{card.tag_sub}</p>
            )}

            <p className="MsoNormal"
              style={{
                fontSize: '11pt', marginTop: 0, marginBottom: 8, lineHeight: LINE_HEIGHT,
              }}
              dangerouslySetInnerHTML={{ __html: styledCite || '' }}
            />

            {card.body.map((paragraph, i) => {
              const styledParagraph = generateStyledParagraph(card, i, paragraph, highlightColor);

              return (
                <p className="MsoNormal"
                  style={{ fontSize: '11pt', margin: '0in 0in 8pt', lineHeight: LINE_HEIGHT }}
                  key={i}
                  dangerouslySetInnerHTML={{ __html: styledParagraph }}
                />
              );
            })}
          </div>
          <div className={styles.download}>
            <DownloadLink url={downloadUrls || card.download_url || card.s3_url} />
          </div>
        </>
      )}
    </div>
  );
};

export default CardDetail;
