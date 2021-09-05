import { useContext, Fragment, useMemo } from 'react';
import { useScrimSectionStyles } from '../styles/scrimSection.styles';
import { CurrentUserContext } from '../context/currentUser';

// components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Grid, IconButton, Typography } from '@material-ui/core';
import Tooltip from '../components/shared/Tooltip';
import AdminArea from './shared/AdminArea';
import ListSubheader from '@material-ui/core/ListSubheader';

// utils
import { RANK_IMAGES, ROLE_IMAGES } from '../utils/imageMaps';

// services
import { insertPlayerInScrim, removePlayerFromScrim } from '../services/scrims';
// icons
import SwapIcon from '@material-ui/icons/SwapHoriz';
import JoinIcon from '@material-ui/icons/MeetingRoom';
import ExitIcon from '@material-ui/icons/NoMeetingRoom';
import KickIcon from '@material-ui/icons/HighlightOff';

const compareArrays = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i]._id !== arr2[i]._id) return false;
  }

  // If all elements were same.
  return true;
};

const getRankImage = (user) => {
  // replace number with empty string: Diamond 1 => Diamond
  // get rank image from images map by player.rank
  return RANK_IMAGES[user?.rank?.replace(/[^a-z$]/gi, '')];
};

export default function ScrimTeamList({
  playerEntered,
  scrim,
  getNewScrimsData,
  teamOne,
  teamTwo,
  teamData,
  casterEntered,
}) {
  const { currentUser } = useContext(CurrentUserContext);
  const classes = useScrimSectionStyles({ scrim });

  const gameEnded = useMemo(() => scrim.teamWon, [scrim.teamWon]);

  const { teamRoles, teamName, teamTitleName, teamArray } = teamData;

  const joinGame = async (teamJoiningName, role) => {
    getNewScrimsData();

    if (casterEntered) {
      alert("You're already a caster for this game!");
      return;
    }

    const dataSending = {
      playerData: {
        ...currentUser,
        role,
        team: { name: teamJoiningName },
      },
    };

    const updatedScrim = await insertPlayerInScrim(scrim._id, dataSending);

    if (updatedScrim) {
      console.log(
        `%c added ${currentUser?.name} to scrim: ${scrim._id} in team: ${teamJoiningName}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  const handleMovePlayer = async (teamStr, role) => {
    getNewScrimsData();

    let currentTeamName = playerEntered.team.name;
    const currentTeamArr = currentTeamName === 'teamOne' ? teamOne : teamTwo;

    let teamArr = teamStr === 'teamOne' ? teamOne : teamTwo;

    let dataSending = {};

    // if is the array that the user is moving to is different, that means he is changing teams.
    if (compareArrays(currentTeamArr, teamArr) === false) {
      console.log(`swapping teams for summoner ${currentUser?.name}`);

      dataSending = {
        playerData: {
          ...currentUser,
          role,
          team: { name: teamStr },
        },

        swapData: {
          isChangingTeams: true,
          isMoving: true,
          currentTeamName: playerEntered.team.name,
          teamChangingToName: teamStr,
        },
      };
    } else {
      dataSending = {
        playerData: {
          ...currentUser,
          role,
          team: { name: teamStr },
        },
        swapData: {
          isMoving: true,
        },
      };
    }

    const updatedScrim = await insertPlayerInScrim(scrim._id, dataSending);

    if (updatedScrim) {
      console.log(
        `%cswapped ${currentUser?.name} in scrim: ${scrim._id} to: ${teamStr} as ${role}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  const leaveGame = async (teamLeavingName) => {
    const dataSending = {
      playerData: {
        ...currentUser,
        role: playerEntered.role,
        teamLeavingName,
        isLobbyHost: scrim.lobbyHost?._id === playerEntered?._user?._id,
      },
    };

    const updatedScrim = await removePlayerFromScrim(scrim._id, dataSending);

    if (updatedScrim) {
      console.log(
        `%cremoved ${currentUser?.name} from scrim: ${scrim._id}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  const kickPlayerFromGame = async (playerToKick, teamLeavingName) => {
    if (currentUser?.adminKey !== process.env.REACT_APP_ADMIN_KEY) return;
    const dataSending = {
      playerData: {
        ...playerToKick,
        role: playerToKick.role,
        teamLeavingName,
        isLobbyHost: scrim.lobbyHost?.name === playerToKick.name,
        _id: playerToKick._user?._id,
        name: playerToKick._user?.name,
      },
    };

    const updatedScrim = await removePlayerFromScrim(scrim._id, dataSending);

    if (updatedScrim) {
      console.log(
        `%ckicked ${dataSending?.playerData?.name} from scrim: ${scrim._id}`,
        'color: #99ff99'
      );
      getNewScrimsData();
    }
  };

  return (
    <div className={`team-container team-container--${teamName}`}>
      <List
        className={classes.teamList}
        subheader={
          <>
            <ListSubheader component="div" style={{ color: '#fff' }}>
              {teamTitleName}
            </ListSubheader>
            <Divider />
          </>
        }>
        {teamRoles.map((teamRole, idx) => {
          const playerAssigned = teamArray.find(
            (player) => player?.role === teamRole
          );

          // doing this so old data is still working on the front-end after the major database update at 9/3/2021
          // for old database status, if player didnt have nested ._user, just return as is, else return ._user
          const userInfo = playerAssigned?._user;

          const isCurrentUser = userInfo?._id === currentUser?._id;

          if (playerAssigned) {
            return (
              <Fragment key={idx}>
                {idx !== 0 ? <Divider component="div" /> : null}
                <ListItem alignItems="center" className={classes.teamListItem}>
                  <ListItemAvatar>
                    <Avatar
                      alt={playerAssigned.role}
                      src={ROLE_IMAGES[teamRole]}
                    />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Grid container alignItems="center">
                        <a
                          className="link"
                          href={`https://${playerAssigned?._user?.region}.op.gg/summoner/userName=${playerAssigned?.name}`}
                          target="_blank"
                          rel="noreferrer">
                          {userInfo?.name}
                        </a>
                        {userInfo.rank !== 'Unranked' && (
                          <>
                            &nbsp;
                            <img
                              width="25px"
                              style={{ objectFit: 'cover' }}
                              alt={playerAssigned.role}
                              src={getRankImage(userInfo)}
                            />
                          </>
                        )}
                      </Grid>
                    }
                    secondary={
                      <>
                        {playerAssigned?.discord && (
                          <>
                            Discord -&nbsp;
                            <Typography
                              component="span"
                              variant="body2"
                              className={classes.inline}
                              color="textPrimary">
                              {userInfo?.discord}
                            </Typography>
                            <br />
                          </>
                        )}
                        {'Role - '}
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary">
                          {playerAssigned?.role}
                        </Typography>
                        <br />
                        {'Rank - '}
                        <Typography
                          component="span"
                          variant="body2"
                          className={classes.inline}
                          color="textPrimary">
                          {userInfo?.rank}
                        </Typography>
                      </>
                    }
                  />

                  {isCurrentUser
                    ? // don't let user leave if game has already ended
                      !gameEnded && (
                        <Tooltip title="Leave">
                          <IconButton
                            className={classes.iconButton}
                            onClick={() => leaveGame(teamName)}>
                            <ExitIcon />
                          </IconButton>
                        </Tooltip>
                      )
                    : // don't let admins kick if game has ended.
                      !gameEnded && (
                        <AdminArea>
                          <Tooltip title={`Kick ${userInfo?.name}`}>
                            <IconButton
                              className={classes.iconButton}
                              onClick={() => {
                                let yes = window.confirm(
                                  `Are you sure you want to kick ${userInfo?.name}?`
                                );
                                if (!yes) return;
                                kickPlayerFromGame(playerAssigned, teamName);
                              }}>
                              <KickIcon />
                            </IconButton>
                          </Tooltip>
                        </AdminArea>
                      )}
                </ListItem>
                {idx !== teamRoles.length - 1 ? (
                  <Divider component="li" />
                ) : null}
              </Fragment>
            );
          } else
            return (
              <Fragment key={idx}>
                {idx !== 0 ? <Divider component="div" /> : null}

                <ListItem alignItems="center" className={classes.teamListItem}>
                  <ListItemAvatar>
                    <Avatar alt={teamRole} src={ROLE_IMAGES[teamRole]} />
                  </ListItemAvatar>
                  <ListItemText primary={teamRole} />
                  {!playerEntered ? (
                    <Tooltip title={`Join: ${teamTitleName} as ${teamRole}`}>
                      <IconButton
                        onClick={() => joinGame(teamName, teamRole)}
                        className={classes.iconButton}>
                        <JoinIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Tooltip
                        title={`Move to: ${teamTitleName} as ${teamRole}`}>
                        <IconButton
                          className={classes.iconButton}
                          onClick={() => handleMovePlayer(teamName, teamRole)}>
                          <SwapIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </ListItem>
                {idx !== teamRoles.length - 1 ? (
                  <Divider component="div" />
                ) : null}
              </Fragment>
            );
        })}
      </List>
    </div>
  );
}
