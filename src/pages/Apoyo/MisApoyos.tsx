import BackButton from '@/components/BackButton';
import {
  BackButtonContainer,
  SectionTitleContainer,
  StyledTitle,
  Wrapper,
} from '../PrestadorDashboard/StyledPrestadorDashboardComponents';
import { ContentContainer } from '../ConstruirPerfil/Comunas/StyledCompEditarComunas';
import { Section, Text } from '@/components/StyledComponents';
import Loading from '@/components/Loading';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { CenteredFlexBox } from '@/components/styled';
import { ApoyoController } from './ApoyoController';
import React from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { AddButton } from '@/components';

export const MisApoyos = () => {
  const {
    handleReadApoyo,
    handleCreateApoyo,
    getServiceIcon,
    handleDeleteApoyo,
    isSupportRequestsError,
    isSupportRequestsLoading,
    userSupportRequests,
    isDeleteSupportRequestLoading,
  } = ApoyoController();

  return (
    <Wrapper
      sx={{
        justifyContent: 'start',
      }}
    >
      <BackButtonContainer
        sx={{
          py: '1rem',
        }}
      >
        <BackButton displayText to="/usuario-dashboard" />
      </BackButtonContainer>
      <SectionTitleContainer sx={{ width: '100%', m: '1rem auto', justifyContent: 'space-around' }}>
        <StyledTitle>Mis apoyos</StyledTitle>
        <AddButton onClick={handleCreateApoyo} />
      </SectionTitleContainer>
      {isSupportRequestsLoading ? (
        <Loading />
      ) : !isSupportRequestsError && (userSupportRequests || [])?.length > 0 ? (
        <>
          <Section
            sx={{
              backgroundColor: 'white',
              borderRadius: '1rem',
            }}
          >
            <ContentContainer>
              <List
                sx={{
                  width: {
                    xs: '80vw',
                  },
                }}
              >
                {userSupportRequests?.map((apoyo, i) => {
                  const icon = getServiceIcon(apoyo.serviceName);
                  return (
                    <ListItem
                      onClick={() => handleReadApoyo(apoyo)}
                      key={apoyo.id}
                      sx={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom:
                          userSupportRequests.length - 1 === i ? '0px' : '1px solid #e0e0e0',
                      }}
                      secondaryAction={
                        isDeleteSupportRequestLoading ? (
                          <Loading />
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApoyo(apoyo.id!);
                            }}
                          >
                            <DeleteOutlineOutlinedIcon
                              sx={{
                                color: 'secondary.contrastText',
                              }}
                            />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: 'primary.main',
                          }}
                        >
                          {React.createElement(icon)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={apoyo.title}
                        secondary={`Paciente: ${apoyo.patientName}`}
                        sx={{
                          fontSize: '1.5rem',
                        }}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </ContentContainer>
          </Section>
        </>
      ) : isSupportRequestsError ? (
        <CenteredFlexBox>
          <Text>No se pudieron cargar tus apoyos</Text>
        </CenteredFlexBox>
      ) : (
        <CenteredFlexBox>
          <Text>Aún no has creado ninguna solicitud de apoyo</Text>
        </CenteredFlexBox>
      )}
    </Wrapper>
  );
};
