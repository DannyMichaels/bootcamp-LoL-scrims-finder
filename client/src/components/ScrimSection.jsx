import { useContext, useEffect, useState, useMemo } from 'react';
import { CurrentUserContext } from '../context/currentUser';
import { useScrimSectionStyles } from '../styles/scrimSection.styles';

//  components
import CountdownTimer from './CountdownTimer';
import ScrimTeamList from './ScrimTeamList';
import Moment from 'react-moment';
import AdminArea from './shared/AdminArea';
import { Box, Button, Grid } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

// utils / services
import {
  updateScrim,
  deleteScrim,
  removeCasterFromScrim,
} from '../services/scrims';
import { copyTextToClipboard } from '../utils/copyToClipboard';
import { ScrimsContext } from '../context/scrimsContext';
import { insertCasterInScrim } from './../services/scrims';

// icons
import ShareIcon from '@material-ui/icons/Share';
import SettingsIcon from '@material-ui/icons/Settings';
import UploadPostGameImage from './UploadPostGameImage';

const compareDates = (scrim) => {
  let currentTime = new Date().getTime();
  let gameStartTime = new Date(scrim.gameStartTime).getTime();

  if (currentTime < gameStartTime) {
    return -1;
  } else if (currentTime > gameStartTime) {
    return 1;
  } else {
    return 0;
  }
};

const MAX_CASTER_AMOUNT = 2;

export default function ScrimSection({ scrim, isInDetail }) {
  const { toggleFetch, setScrims } = useContext(ScrimsContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [playerEntered, setPlayerEntered] = useState(false);
  const [casterEntered, setCasterEntered] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);

  // if the scrim has a winning team, it means it has ended.
  const gameEnded = useMemo(() => scrim.teamWon, [scrim.teamWon]);

  const classes = useScrimSectionStyles({ imageUploaded, scrim });
  const history = useHistory();

  const { teamOne, teamTwo, casters } = scrim;

  const getNewScrimsData = () => toggleFetch((prevState) => !prevState);

  const gameUrl = useMemo(
    () => `${window.location.origin}/scrims/${scrim._id}`,
    [scrim._id]
  );

  useEffect(() => {
    let gameHasStarted = compareDates(scrim) > 0;

    if (gameHasStarted) {
      setGameStarted(scrim._id);
    }
  }, [scrim]);

  useEffect(() => {
    const teams = [...teamOne, ...teamTwo];

    let foundPlayer = teams.find((player) => player?.uid === currentUser?.uid);

    let foundCaster = scrim.casters.find(
      (caster) => caster?.uid === currentUser?.uid
    );

    if (foundCaster) {
      setCasterEntered(foundCaster);
    } else {
      setCasterEntered(false);
    }

    if (foundPlayer) {
      setPlayerEntered(foundPlayer);
    } else {
      setPlayerEntered(false);
    }
  }, [scrim, currentUser?.uid, teamOne, teamTwo]);

  useEffect(() => {
    if (scrim.postGameImage) {
      setImageUploaded(scrim._id);
    } else {
      setImageUploaded(false);
    }
  }, [scrim]);

  const joinCast = async () => {
    if (playerEntered) {
      alert("You're already in a team!");
      return;
    }

    if (casterEntered) return;
    if (casters.length === MAX_CASTER_AMOUNT) return;

    getNewScrimsData();

    const dataSending = {
      casterData: {
        name: currentUser?.name,
        uid: currentUser?.uid,
        email: currentUser?.email,
        discord: currentUser?.discord,
      },
    };

    const updatedScrim = await insertCasterInScrim(scrim._id, dataSending);

    if (updatedScrim) {
      console.log(
        `%cadded ${currentUser?.name} as a caster for scrim: ${scrim._id}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  const leaveCast = async () => {
    getNewScrimsData();

    const updatedScrim = await removeCasterFromScrim(scrim._id, {
      casterData: casterEntered,
    });

    if (updatedScrim) {
      console.log(
        `%cremoved ${currentUser?.name} from the caster list for scrim: ${scrim._id}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  const handleDeleteScrim = async () => {
    let yes = window.confirm('Are you sure you want to close this scrim?');
    if (!yes) return;

    let deletedScrim = await deleteScrim(scrim._id);

    if (deletedScrim) {
      setScrims((prevState) => prevState.filter((s) => s._id !== scrim._id));

      if (isInDetail) {
        history.push('/');
        getNewScrimsData();
      }
    }
  };

  const teamOneDifference = 5 - teamOne.length;
  const teamTwoDifference = 5 - teamTwo.length;

  return (
    <div className="page-section one-scrim__container">
      <div className={classes.scrimBox}>
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
                <h1 className="text-black">
                  {/* if scrim has a title show title, else show createdby.name's scrim */}
                  {`${scrim.title ?? `${scrim.createdBy.name}'s Scrim`} (${
                    scrim.region
                  })`}
                </h1>
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

          <div className={classes.gameMetaInfo}>
            <div>
              <h2 className="text-black">
                Game Start:&nbsp;
                <Moment format="MM/DD/yyyy | hh:mm A">
                  {scrim.gameStartTime}
                </Moment>
              </h2>

              <div className="casters-container ">
                {casters.length === 2 ? (
                  <h2 className="text-black">
                    Casters: {casters.map((caster) => caster?.name).join(' & ')}
                  </h2>
                ) : (
                  <div className="d-flex align-center gap-20">
                    {casters.length === 0 ? (
                      <h2 className="text-black">No Casters</h2>
                    ) : null}
                    {casters[0] && (
                      <h2 className="text-black">
                        {/* if game didn't and say current casters, else say one caster: */}
                        {!gameEnded ? 'Current Casters:' : 'Caster:'}{' '}
                        {casters[0].name}
                      </h2>
                    )}
                  </div>
                )}

                {/* don't show cast buttons if game ended */}
                {!gameEnded && (
                  <div className="d-flex align-center gap-20">
                    {casters.length !== MAX_CASTER_AMOUNT && (
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={
                          casters.length === MAX_CASTER_AMOUNT ||
                          scrim.casters.find(
                            ({ uid }) => uid === currentUser?.uid
                          )
                            ? true
                            : false
                        }
                        onClick={joinCast}>
                        join cast
                      </Button>
                    )}

                    {casterEntered && (
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={leaveCast}>
                        Leave cast
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Grid>

        <div className={classes.teamsContainer}>
          {/* teamOne */}
          <ScrimTeamList
            teamOne={teamOne}
            teamTwo={teamTwo}
            teamData={{
              teamRoles: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
              teamName: 'teamOne',
              teamTitleName: 'Team 1 (Blue Side)',
              teamArray: teamOne,
            }}
            scrim={scrim}
            playerEntered={playerEntered}
            casterEntered={casterEntered}
            getNewScrimsData={() => toggleFetch((prevState) => !prevState)}
          />

          <div className={classes.teamsVersusSeparator}>
            <div
              className="lobby__info-box"
              style={{
                background: `rgba(255, 255, 255,${
                  imageUploaded === scrim._id
                    ? '0.8'
                    : gameStarted === scrim._id
                    ? '0.7'
                    : '0.5'
                })`,
                padding: '10px',
                borderRadius: '4px',
              }}>
              {gameStarted !== scrim._id && (
                <h2 className="text-black">Game starting in...</h2>
              )}

              <CountdownTimer
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
                scrim={scrim}
              />

              {gameStarted === scrim._id &&
                (scrim.teamOne.length === 5 && scrim.teamTwo.length === 5 ? (
                  <>
                    {!gameEnded && (
                      <>
                        {/* show lobby name and pswd only to players in lobby or admins */}
                        {playerEntered ||
                        casterEntered ||
                        process.env.REACT_APP_ADMIN_KEY ===
                          currentUser?.adminKey ? (
                          <>
                            <h2 className="text-black">
                              Lobby host / captain: {scrim.lobbyHost?.name}
                            </h2>
                            <h3 className="text-black">
                              please make the lobby name: <br />"
                              {scrim.lobbyName}"
                            </h3>
                            <h3 className="text-black">
                              with the password: {scrim.lobbyPassword}
                            </h3>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}

                    {/* WHO WON ? BUTTONS */}
                    {/* show buttons if is admin or is lobby captain */}
                    {/* don't show if game has ended */}
                    {(scrim.lobbyHost.email === currentUser?.email ||
                      currentUser?.adminKey ===
                        process.env.REACT_APP_ADMIN_KEY) &&
                      !gameEnded && (
                        // WHO WON BUTTONS
                        <Grid
                          item
                          container
                          alignItems="center"
                          direction="row"
                          spacing={2}>
                          <Grid item>
                            <h3 className="text-black">Who won?</h3>
                          </Grid>

                          {['Team 1 (Blue Side)', 'Team 2 (Red Side)'].map(
                            (teamTitle, idx) => (
                              <Grid item key={idx}>
                                <Button
                                  style={{
                                    backgroundColor: idx === 0 ? 'blue' : 'red',
                                    color: '#fff',
                                  }}
                                  variant="contained"
                                  onClick={async () => {
                                    // set team won for scrim
                                    let yes =
                                      window.confirm(`Are you sure ${teamTitle} won this game? \n 
                                  You cannot reverse this.
                                  `);

                                    if (!yes) return;

                                    const dataSending = {
                                      teamWon: teamTitle,
                                    };
                                    const updatedScrim = await updateScrim(
                                      scrim._id,
                                      dataSending
                                    );
                                    if (updatedScrim) {
                                      getNewScrimsData();
                                    }
                                  }}>
                                  {teamTitle}
                                </Button>
                              </Grid>
                            )
                          )}
                        </Grid>
                      )}

                    {/*  allow image upload if both teams are filled and 
                    the current user is the host or creator of scrim or an admin.
                  */}
                    {(scrim.lobbyHost?.uid === currentUser?.uid ||
                      currentUser?.adminKey ===
                        process.env.REACT_APP_ADMIN_KEY) && (
                      <>
                        <Box marginTop={2} />

                        <UploadPostGameImage
                          isUploaded={imageUploaded === scrim._id}
                          scrim={scrim}
                        />
                      </>
                    )}

                    {imageUploaded === scrim._id && (
                      <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>
                        <Grid item>
                          <h3 className="text-black">
                            Post-Game Image Uploaded!
                          </h3>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            color="primary"
                            component="a"
                            href={scrim.postGameImage?.location}
                            rel="noreferrer"
                            target="_blank">
                            View Image
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-black">
                      Not enough players:&nbsp;
                      {`${teamOne.length + teamTwo.length}/10`}
                    </h2>
                    <h5 className="text-black">
                      Please get {teamOneDifference} players in team one <br />
                      and {teamTwoDifference} players in team two <br />
                      to unlock lobby name and password
                    </h5>
                    {scrim.createdBy?.email === currentUser?.email ? (
                      <AdminArea>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={handleDeleteScrim}>
                          Close event
                        </Button>
                      </AdminArea>
                    ) : null}
                  </>
                ))}
            </div>
          </div>

          {/* teamTwo */}
          <ScrimTeamList
            teamOne={teamOne}
            teamTwo={teamTwo}
            teamData={{
              teamRoles: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
              teamName: 'teamTwo',
              teamTitleName: 'Team 2 (Red Side)',
              teamArray: teamTwo,
            }}
            scrim={scrim}
            playerEntered={playerEntered}
            casterEntered={casterEntered}
            getNewScrimsData={getNewScrimsData}
          />
        </div>
      </div>
    </div>
  );
}
