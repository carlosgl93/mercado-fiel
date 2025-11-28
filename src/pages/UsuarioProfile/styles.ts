import { Theme } from '@mui/material';

export const profileStyles = {
  container: {
    py: 4,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },
  profileCard: {
    textAlign: 'center',
    p: 3,
  },
  avatarContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatar: {
    width: 120,
    height: 120,
    mb: 2,
    mx: 'auto',
  },
  uploadButton: (theme: Theme) => ({
    position: 'absolute',
    bottom: 8,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    width: 36,
    height: 36,
  }),
  infoCard: {
    p: 3,
  },
  fieldContainer: {
    mb: 3,
  },
  fieldHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 1,
  },
  editField: {
    display: 'flex',
    gap: 1,
  },
  divider: {
    mb: 3,
  },
  statusDivider: {
    my: 3,
  },
};
