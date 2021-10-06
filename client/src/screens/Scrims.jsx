import { useState, useEffect, Fragment, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/styles/useTheme';
import useScrims from './../hooks/useScrims';
import { useDispatch } from 'react-redux';

// components
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { InnerColumn, PageContent } from '../components/shared/PageComponents';
import ScrimSection from '../components/scrim_components/ScrimSection';
import Loading from '../components/shared/Loading';
import Navbar from '../components/shared/Navbar/Navbar';
import Tooltip from '../components/shared/Tooltip';
import { Fade } from 'react-awesome-reveal'; // intersection observer fade on scrim box reveal.

// utils
import { showEarliestFirst, showLatestFirst } from '../utils/getSortedScrims';
import 'moment-timezone';
import { compareDateWithCurrentTime } from './../utils/compareDateWithCurrentTime';

// icons
import HelpIcon from '@mui/icons-material/Help';
import MenuIcon from '@mui/icons-material/Menu';

// compare scrim start time with now.
const compareDates = (scrim) => {
  let currentTime = new Date().getTime();
  let gameStartTime = new Date(scrim.gameStartTime).getTime();

  if (currentTime < gameStartTime) {
    // if the currentTime is less than the game start time, that means the game didn't start (game is in future)
    return -1;
  } else if (currentTime > gameStartTime) {
    // if the current time is greater than the game start time, that means the game started (game is in past)
    return 1;
  } else {
    return 0;
  }
};

export default function Scrims() {
  const {
    scrims,
    scrimsLoaded,
    scrimsDate,
    scrimsRegion,
    hidePreviousScrims,
    hideCurrentScrims,
    hideUpcomingScrims,
  } = useScrims();

  const dispatch = useDispatch();

  const [filteredScrims, setFilteredScrims] = useState([]); // the array of filtered scrims (both scrimsDate and scrimsRegion)

  const theme = useTheme();
  const matchesLg = useMediaQuery(theme.breakpoints.down('lg'));

  const dateFilteredScrims = useMemo(
    () =>
      scrims.filter(({ gameStartTime }) => {
        //  if gameStartTime equals to the scrimsDate, show it.
        return (
          new Date(gameStartTime).toLocaleDateString() ===
          new Date(scrimsDate).toLocaleDateString()
        );
      }),
    // change date filtered scrims whenever scrims and scrimsDate cahnges.
    [scrims, scrimsDate]
  );

  const filteredScrimsByDateAndRegion = useMemo(
    () => dateFilteredScrims.filter((scrim) => scrim.region === scrimsRegion),
    // change filteredScrimsByDateAndRegion whenever dateFilteredScrims and scrimsRegion changes
    [dateFilteredScrims, scrimsRegion]
  );

  useEffect(() => {
    //  set filteredScrims to filteredScrimsByDateAndRegion.
    setFilteredScrims(filteredScrimsByDateAndRegion);
    // this runs everytime scrimsRegion and datefilteredScrims changes.
  }, [filteredScrimsByDateAndRegion]);

  let upcomingScrims = useMemo(
    () =>
      // showEarliestFirst is a sorting method. (getSortedScrims.js)
      showEarliestFirst(filteredScrims).filter(
        (scrim) => compareDates(scrim) < 0 // game didn't start
      ),
    [filteredScrims]
  );

  let previousScrims = useMemo(
    () =>
      // showLatestFirst is a sorting method.
      showLatestFirst(
        filteredScrims.filter(
          // if the scrim has a winning team then it ended
          (scrim) => compareDates(scrim) > 0 && scrim.teamWon
        )
      ),
    [filteredScrims]
  );

  let currentScrims = useMemo(
    () =>
      showEarliestFirst(
        filteredScrims.filter(
          // scrims that have started but didn't end (don't have winning team)
          (scrim) => compareDates(scrim) > 0 && !scrim.teamWon
        )
      ),
    [filteredScrims]
  );

  useEffect(() => {
    // if scrimsDate < currentTime
    // if the scrim is in the past compared to filtered scrims date.
    if (compareDateWithCurrentTime(scrimsDate) > 0) {
      dispatch({ type: 'scrims/setHideScrims', hideUpcoming: true });
    } else {
      dispatch({ type: 'scrims/setHideScrims', hideUpcoming: false });
    }
  }, [scrimsDate]);

  if (!scrimsLoaded) {
    return <Loading text="Loading Scrims..." />;
  }

  return (
    <>
      <Navbar
        scrimsRegion={scrimsRegion}
        scrimsDate={scrimsDate}
        showDropdowns
        showCheckboxes
      />
      <div className="page-break" />

      <PageContent>
        <div id="scrims-container">
          {filteredScrims.length > 0 ? (
            <>
              {/* CURRENT SCRIMS */}
              {!hideCurrentScrims && (
                <>
                  {currentScrims.length > 0 ? (
                    <>
                      <InnerColumn>
                        <div
                          style={{
                            marginBottom: '40px',
                            borderBottom: '1px solid white',
                          }}>
                          <Typography align="center" variant="h1" gutterBottom>
                            {currentScrims.length > 0 && 'Current scrims'}
                          </Typography>
                        </div>
                      </InnerColumn>

                      {currentScrims.map((scrim) => (
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
              )}
              {/* CURRENT SCRIMS END */}

              {/* UPCOMING SCRIMS */}
              {!hideUpcomingScrims && (
                <>
                  <InnerColumn>
                    <div
                      style={{
                        marginBottom: '40px',
                        borderBottom: '1px solid white',
                      }}>
                      <Typography align="center" variant="h1" gutterBottom>
                        {upcomingScrims.length > 0
                          ? 'Upcoming scrims'
                          : 'No upcoming scrims'}
                      </Typography>
                    </div>
                  </InnerColumn>

                  {upcomingScrims.map((scrim) => (
                    <Fragment key={scrim._id}>
                      <Fade triggerOnce>
                        <ScrimSection scrim={scrim} />
                      </Fade>
                      <div className="page-break" />
                    </Fragment>
                  ))}
                  <div className="page-break" />
                </>
              )}
              {/* UPCOMING SCRIMS END */}

              {/* PREVIOUS SCRIMS */}
              {!hidePreviousScrims && (
                <>
                  {previousScrims.length > 0 ? (
                    <InnerColumn style={{ marginTop: '20px' }}>
                      <div
                        style={{
                          marginBottom: '40px',
                          borderBottom: '1px solid white',
                        }}>
                        <Typography align="center" variant="h1">
                          Previous scrims
                        </Typography>
                      </div>
                    </InnerColumn>
                  ) : null}
                  {previousScrims.map((scrim) => (
                    <Fragment key={scrim._id}>
                      <Fade triggerOnce>
                        <ScrimSection scrim={scrim} />
                      </Fade>
                      <div className="page-break" />
                    </Fragment>
                  ))}
                </>
              )}
            </>
          ) : (
            // if filteredScrims.length is <= 0
            <InnerColumn>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center">
                <Typography
                  align="center"
                  variant="h1"
                  component="h1"
                  className="text-white">
                  No scrims found in {scrimsRegion}
                </Typography>
                <Box marginRight={2} />
                <Box style={{ cursor: 'help' }}>
                  <Tooltip
                    title={
                      <>
                        use the Region dropdown in the
                        {matchesLg ? (
                          <Grid item container alignItems="center">
                            "More Options" ( <MenuIcon fontSize="small" /> )
                            menu
                          </Grid>
                        ) : (
                          ' Navbar/Header'
                        )}
                        &nbsp;to change the region
                      </>
                    }
                    placement="top">
                    <HelpIcon fontSize="large" />
                  </Tooltip>
                </Box>
              </Grid>
            </InnerColumn>
          )}
        </div>
      </PageContent>
    </>
  );
}
