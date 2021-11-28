/* eslint-disable react/no-array-index-key */
import type { Card } from '../../lib/types';
import styles from './styles.module.scss';

type CardProps = {
  card?: Card;
}

const CardDetail = ({ card }: CardProps) => {
  return (
    <div className={styles.card}>
      {!!card && (
        <>
          <h4>{card.tag}</h4>
          <p>{card.cite}</p>
          {card.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </>
      )}
    </div>
  );
};

export default CardDetail;
