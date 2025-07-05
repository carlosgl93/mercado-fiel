import { Title } from '../StyledComponents';
import { StyledChatContainer } from './ChatModalStyledComponents';

export const Mensajes = () => {
  return (
    <>
      <Title sx={{ fontSize: '2rem', textAlign: 'center', mb: '1rem' }}>Chat</Title>
      <StyledChatContainer></StyledChatContainer>
    </>
  );
};
