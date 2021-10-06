import { Fragment } from 'react';
import { InnerColumn } from '../shared/PageComponents';
import Typography from '@mui/material/Typography';
import { Fade } from 'react-awesome-reveal';
import ScrimSection from './ScrimSection';

export default function ScrimsColumn({ show, scrims, headerText }) {
  return (
    show && (
      <>
        {scrims.length > 0 ? (
          <>
            <InnerColumn>
              <div
                style={{
                  marginBottom: '40px',
                  borderBottom: '1px solid white',
                }}>
                <Typography align="center" variant="h1" gutterBottom>
                  {scrims.length > 0 && headerText}
                </Typography>
              </div>
            </InnerColumn>

            {scrims.map((scrim) => (
              <Fragment key={scrim._id}>
                <Fade triggerOnce>
                  <ScrimSection scrim={scrim} />
                </Fade>
                <div className="page-break" />
              </Fragment>
            ))}
            <div className="page-break" />
          </>
        ) : null}
      </>
    )
  );
}
