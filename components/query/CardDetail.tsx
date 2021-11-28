/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-danger */
/* eslint-disable react/no-array-index-key */
import type { Card } from '../../lib/types';
import { generateStyledCite } from '../../lib/utils';
import DownloadLink from '../DownloadLink';
import styles from './styles.module.scss';

type CardProps = {
  card?: Card;
}

const CardDetail = ({ card }: CardProps) => {
  const styledCite = generateStyledCite(card?.cite, card?.cite_emphasis);

  return (
    <div className={styles.card}>
      {!!card && (
        <>
          <h4 style={{
            fontSize: '13pt', marginTop: 2, marginBottom: 0, lineHeight: 1.08,
          }}
          >{card.tag}
          </h4>
          <p className="MsoNormal"
            style={{
              fontSize: '11pt', marginTop: 0, marginBottom: 8, lineHeight: '15.6933px',
            }}
            dangerouslySetInnerHTML={{ __html: styledCite || '' }}
          />
          {card.body.map((paragraph, i) => {
            const highlights = card.highlights.filter((h) => h[0] === i + 2);
            const underlines = card.underlines.filter((u) => u[0] === i + 2);
            const emphases = card.emphasis.filter((u) => u[0] === i + 2);

            const obj: Record<string, string> = {};
            for (const [_, s, e] of highlights) {
              obj[s] = `${obj[s] || ''}<span style="background:yellow;">`;
              obj[e] = `${obj[e] || ''}</span>`;
            }
            for (const [_, s, e] of emphases) {
              obj[s] = `${obj[s] || ''}<b><u>`;
              obj[e] = `${obj[e] || ''}</u></b>`;
            }
            for (const [_, s, e] of underlines) {
              obj[s] = `${obj[s] || ''}<u>`;
              obj[e] = `${obj[e] || ''}</u>`;
            }

            const styledParagraph = paragraph.replace(/(?:)/g, (_, index) => obj[index] || '');

            return (
              <p className="MsoNormal" style={{ fontSize: '11pt', margin: '0in 0in 8pt', lineHeight: '15.6933px' }} key={i} dangerouslySetInnerHTML={{ __html: styledParagraph }} />
            );
          })}

          <div className={styles.download}>
            <DownloadLink url={card.download_url || card.s3_url} />
          </div>
        </>
      )}
    </div>
  );
};

export default CardDetail;
