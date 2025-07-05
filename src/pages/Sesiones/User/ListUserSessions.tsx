import { Appointment } from '@/api/appointments';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { Fragment, useMemo, useState } from 'react';
import { Text } from '@/components/StyledComponents';
import { UserSessionCard } from './UserSessionCard';

type ListUserSessionsProps = {
  userSessions: Appointment[];
};

export const ListUserSessions = ({ userSessions }: ListUserSessionsProps) => {
  const [showPastSessions, setShowPastSessions] = useState(false);
  const { userPastSessions, userFutureSessions } = useMemo(() => {
    const userPastSessions: Appointment[] = [];
    const userFutureSessions: Appointment[] = [];

    userSessions.forEach((session) => {
      const dateTime = session.scheduledDate + ' ' + session.scheduledTime;
      const sesionDate = typeof dateTime === 'string' ? dateTime : undefined;
      const isPast = dayjs().isAfter(dayjs(sesionDate));
      if (isPast) {
        userPastSessions.push(session);
      } else {
        userFutureSessions.push(session);
      }
    });

    return { userPastSessions, userFutureSessions };
  }, [userSessions]);

  if (!userSessions.length) {
    return (
      <>
        <Text>Aun no tienes sesiones.</Text>
      </>
    );
  }

  const pastSessionsList = userPastSessions.map((appointment, y) => (
    <Fragment key={y}>
      <UserSessionCard appointment={appointment} />
    </Fragment>
  ));

  return (
    <>
      {/* PAST SESSIONS BUTTON */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button
          sx={{ my: 2 }}
          variant={showPastSessions ? 'contained' : 'outlined'}
          onClick={() => setShowPastSessions((prev) => !prev)}
        >
          {showPastSessions ? 'Pasadas' : 'Futuras'}
        </Button>
      </Box>
      {/* PAST SESSIONS MAP/ITERATION */}
      {showPastSessions && !userPastSessions.length && (
        <Box
          sx={{
            margin: '2rem auto',
          }}
        >
          <Text>No tienes sesiones pasadas.</Text>
        </Box>
      )}
      {showPastSessions && userPastSessions.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
              lg: '1fr 1fr 1fr',
            },
            gridTemplateRows: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr',
            },
          }}
        >
          {pastSessionsList}
        </Box>
      )}

      {/* FUTURE SESSIONS MAP/ITERATION */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
          gridTemplateRows: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr',
          },
        }}
      >
        {userFutureSessions?.map((appointment, i) => (
          <Fragment key={i}>
            {i === 0 && (
              <Text
                sx={{
                  px: '1rem',
                }}
              >
                Tu siguiente sesión:
              </Text>
            )}
            <UserSessionCard key={i} appointment={appointment} />
          </Fragment>
        ))}
      </Box>
    </>
  );
};
