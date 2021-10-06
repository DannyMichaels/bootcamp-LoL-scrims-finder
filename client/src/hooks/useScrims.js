import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useInterval from '../hooks/useInterval';
import { getAllScrims } from './../services/scrims';
import devLog from '../utils/devLog';
import { useDispatch, useSelector } from 'react-redux';
import { showEarliestFirst, showLatestFirst } from '../utils/getSortedScrims';

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

export default function useScrims() {
  const {
    scrims,
    scrimsRegion,
    scrimsDate,
    filteredScrims,
    scrimsLoaded,
    ...rest
  } = useSelector(({ scrims }) => scrims);

  const dispatch = useDispatch();

  const fetchScrims = () => {
    dispatch({ type: 'scrims/toggleFetch' });
  };

  const setScrims = (newScrimsValue) =>
    dispatch({ type: 'scrims/setScrims', payload: newScrimsValue });

  const dateFilteredScrims = useMemo(
    () =>
      scrims.filter(({ gameStartTime }) => {
        //  if gameStartTime equals to the scrimsDate, show it.
        return (
          new Date(gameStartTime).toLocaleDateString() ===
          new Date(scrimsDate).toLocaleDateString()
        );
      }),
    // change date filtered scrims whenever scrims and scrimsDate changes.
    [scrims, scrimsDate]
  );

  const filteredScrimsByDateAndRegion = useMemo(
    () => dateFilteredScrims.filter((scrim) => scrim.region === scrimsRegion),
    // change filteredScrimsByDateAndRegion whenever dateFilteredScrims and scrimsRegion changes
    [dateFilteredScrims, scrimsRegion]
  );

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

  return {
    scrims,
    previousScrims,
    currentScrims,
    upcomingScrims,
    setScrims,
    scrimsLoaded,
    fetchScrims,
    dateFilteredScrims,
    filteredScrimsByDateAndRegion,
    filteredScrims,
    ...rest,
  };
}

// sets the scrim region to the users scrim region
export const useSetScrimsRegion = () => {
  const [{ scrimsLoaded, scrimsRegion }, currentUser] = useSelector(
    ({ scrims, auth }) => [scrims, auth?.currentUser]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser?.region) return; // don't run this when we don't have a user yet.

    // if the scrims region is already equal to the currentUsers region, don't proceed
    if (scrimsRegion === currentUser?.region) return;

    // if the scrims have loaded, but the users region is already equal to the scrims region return.
    if (scrimsLoaded && scrimsRegion === currentUser?.region) return;

    // set the scrims region on mount when user is available, or when user changes his region in the settings.
    dispatch({ type: 'scrims/setScrimsRegion', payload: currentUser?.region });

    // eslint-disable-next-line
  }, [currentUser?.region, scrimsLoaded]);

  return null;
};

export const useFetchScrims = () => {
  const { fetch } = useSelector(({ scrims }) => scrims);
  const dispatch = useDispatch();

  const initScrims = (newScrimsValue) =>
    dispatch({ type: 'scrims/fetchScrims', payload: newScrimsValue });

  const { pathname } = useLocation();

  useEffect(() => {
    const fetchScrims = async () => {
      devLog('fetching scrims');
      const scrimsData = await getAllScrims();
      initScrims(scrimsData);
    };

    fetchScrims();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, pathname]);

  return null;
};

const FETCH_INTERVAL = 10000;

// // load scrims every 10 seconds
export const useFetchScrimsInterval = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const loadScrims = async () => {
    if (pathname !== '/sign-up') {
      devLog('fetching scrims (interval)');
      const scrimsData = await getAllScrims();
      dispatch({ type: 'scrims/setScrims', payload: scrimsData });
    }

    // eslint-disable-next-line
  };

  useInterval(loadScrims, FETCH_INTERVAL);

  return null;
};