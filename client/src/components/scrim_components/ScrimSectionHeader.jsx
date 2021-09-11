import { useMemo } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';

// utils
import { copyTextToClipboard } from './../../utils/copyToClipboard';
import AdminArea from './../shared/AdminArea';

// icons
import ShareIcon from '@material-ui/icons/Share';
import SettingsIcon from '@material-ui/icons/Settings';

const MAX_CASTER_AMOUNT = 2;

export default function ScrimSectionHeader({
  // props passed from ScrimSection.jsx
  scrim,
  gameEnded,
  casterEntered,
  joinCast,
  leaveCast,
  handleDeleteScrim,
}) {
  const { casters } = scrim;

  const history = useHistory();

  const gameUrl = useMemo(
    () => `${window.location.origin}/scrims/${scrim._id}`,
    [scrim._id]
  );

  return (
    <Grid
      item
      container
      direction="column"
      className="scrim__metadata pd-1"
      style={{ background: 'rgba(240,234,240,0.8)' }}>
      <Grid
        item
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between">
        <Grid item>
          <Link
            className="link"
            style={{ textDecorationColor: '#000' }}
            to={`/scrims/${scrim._id}`}>
            <Typography variant="h1" className="text-black">
              {/* if scrim has a title show title, else show createdby.name's scrim */}
              {`${scrim.title ?? `${scrim.createdBy.name}'s Scrim`} (${
                scrim.region
              })`}
            </Typography>
          </Link>
        </Grid>
        <Grid
          item
          container
          sm={8}
          md={6}
          alignItems="center"
          justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert('copied scrim link to clipboard!');
              copyTextToClipboard(gameUrl);
            }}>
            <ShareIcon /> Share Link
          </Button>

          <AdminArea>
            <Grid
              container
              item
              direction="row"
              alignItems="center"
              xs={6}
              justifyContent="flex-end"
              spacing={2}>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => history.push(`/scrims/${scrim._id}/edit`)}>
                  <SettingsIcon />
                  &nbsp; Edit
                </Button>
              </Grid>

              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleDeleteScrim}>
                  Close event
                </Button>
              </Grid>
            </Grid>
          </AdminArea>
        </Grid>
      </Grid>

      <Grid container>
        <Typography variant="h2" className="text-black">
          Game Start:&nbsp;
          <Moment format="MM/DD/yyyy | hh:mm A">{scrim.gameStartTime}</Moment>
        </Typography>

        {/*  casters text and buttons*/}
        <Grid container direction="column">
          {casters.length === 2 ? (
            <Typography variant="h2" className="text-black">
              Casters: {casters.map((caster) => caster?.name).join(' & ')}
            </Typography>
          ) : (
            <Grid item container direction="column" alignItems="flex-start">
              {casters.length === 0 ? (
                <Typography variant="h2" className="text-black">
                  No Casters
                </Typography>
              ) : null}
              {casters[0] && (
                <Typography variant="h2" className="text-black">
                  {/* if game didn't and say current casters, else say one caster: */}
                  {!gameEnded ? 'Current Casters:' : 'Caster:'}{' '}
                  {casters[0].name}
                </Typography>
              )}
            </Grid>
          )}

          {/* don't show cast buttons if game ended */}
          {!gameEnded && (
            <Grid container alignItems="center" direction="row" spacing={2}>
              {casters.length !== MAX_CASTER_AMOUNT && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      casters.length === MAX_CASTER_AMOUNT || casterEntered
                    }
                    onClick={joinCast}>
                    join cast
                  </Button>
                </Grid>
              )}

              {casterEntered && (
                <Grid item>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={leaveCast}>
                    Leave cast
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}