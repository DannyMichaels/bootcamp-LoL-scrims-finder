import { makeStyles } from '@mui/styles';

const BG_GIF =
  'https://pa1.narvii.com/5779/8d76b2b8112e6aa9494a93f0ca6bbffe96e2f6c3_hq.gif';

export const useScrimSectionStyles = makeStyles((theme) => ({
  scrimBox: {
    display: 'block',
    width: '98%',
    maxWidth: '1100px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundImage: ({ imageUploaded, scrim }) =>
      imageUploaded === scrim?._id
        ? `url(${scrim?.postGameImage?.location}), url(${BG_GIF})` // fallback with ,
        : `url(${BG_GIF})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: ({ imageUploaded, scrim }) =>
      imageUploaded === scrim?._id ? '100% 100%' : 'cover',
    border: '1px solid white',
  },
  scrimSectionHeader: {
    background: '#101820 !important', // fallback
    backgroundColor: 'rgba(18,25,35,.85) !important',
    padding: '10px',
    backdropFilter: 'blur(8px)',
  },
  iconButton: {
    color: theme.primary,
    cursor: 'pointer',
    position: 'absolute',
    top: '30%',
    right: '4px',
  },
  infoIcon: {
    color: theme.primary,
    cursor: 'pointer',
    position: 'absolute',
    top: '10%',
    right: '13px',
  },
  teamsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gridGap: '20px',
    padding: '10px',

    '@media screen and (max-width: 630px)': {
      gridTemplateColumns: 'inherit',
      gridTemplateRows: '1fr 1fr 1fr',
    },
  },
  teamListHeader: {
    color: '#fff !important',
    background: '#101820 !important', // fallback
    backgroundColor: 'rgba(18,25,35, .85) !important',
    backdropFilter: 'blur(8px)',
  },
  teamList: {
    width: '100%',
    maxWidth: '36ch',
    background: '#101820 !important', // fallback
    backgroundColor: 'rgba(18,25,35, .85) !important',
    backdropFilter: 'blur(20px)',

    transition: 'all 250ms ease-in-out',
    paddingBottom: 0,
    '&:hover': {
      backgroundColor: 'rgba(18,25,35) !important',
    },
    '@media screen and (max-width: 630px)': {
      maxWidth: '100%',
    },
  },

  teamListItem: {
    minHeight: '120px',
    maxHeight: '120px',
    [theme.breakpoints.down('md')]: {
      minHeight: '130px',
      maxHeight: '130px',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none',
      },

      '-ms-overflow-style': 'none' /* IE 11 */,
      scrollbarWidth: 'none' /* Firefox 64 */,
    },
    [theme.breakpoints.down('sm')]: {
      minHeight: '150px',
      maxHeight: '150px',
    },
  },

  inline: {
    display: 'inline',
  },
}));
